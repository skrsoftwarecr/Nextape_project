import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, verifyRequestUid } from "@/lib/firebase/admin";
import { gradeAnswers, isValidAnswerSet } from "@/lib/server/assessment";
import { calculateMatch } from "@/lib/match";
import type { Question } from "@/types/job.types";

export const runtime = "nodejs";

/**
 * POST /api/line/submit
 * Recibe las respuestas de una sesión, corrige EN SERVIDOR contra la clave guardada, y persiste
 * el DNA (`user_skill_scores`, mejor score por skill) y el intento (`assessment_attempts`) con el
 * Admin SDK. El cliente nunca ve `correctIndex` ni puede escribir su propio DNA.
 *
 * Body: { sessionId: string, answers: number[] }
 * Auth: header `Authorization: Bearer <Firebase ID token>`.
 */
export async function POST(req: NextRequest) {
  const uid = await verifyRequestUid(req.headers.get("authorization"));
  if (!uid) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const sessionId: string | undefined = body?.sessionId;
  const answers: number[] = Array.isArray(body?.answers) ? body.answers : [];

  if (!sessionId) {
    return NextResponse.json({ error: "missing_session" }, { status: 400 });
  }

  try {
    const sessionRef = adminDb().collection("line_sessions").doc(sessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
      return NextResponse.json({ error: "session_not_found" }, { status: 404 });
    }
    const session = sessionSnap.data()!;
    if (session.userId !== uid) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const questions = session.questions as Question[];

    // El set de respuestas debe corresponder 1:1 con el examen. Antes, un `answers` incompleto
    // se corregía en silencio (las faltantes contaban como falladas).
    if (!isValidAnswerSet(questions, answers)) {
      return NextResponse.json({ error: "invalid_answers" }, { status: 400 });
    }

    const { skillScores, overall } = gradeAnswers(questions, answers);

    // Mapa de respuestas del usuario (índice elegido por pregunta) para el historial del intento.
    const answersMap: Record<string, string> = {};
    questions.forEach((q, i) => {
      answersMap[q.id] = String(answers[i] ?? -1);
    });

    // DNA: merge quedándonos con el MEJOR score por skill.
    // Va en TRANSACCIÓN: era un read-modify-write y dos simulaciones concurrentes del mismo
    // usuario (p.ej. dos pestañas) podían perder una de las dos actualizaciones.
    const scoresRef = adminDb().collection("user_skill_scores").doc(uid);
    const merged = await adminDb().runTransaction(async (tx) => {
      const currentSnap = await tx.get(scoresRef);
      const next: Record<string, number> = { ...(currentSnap.data()?.scores || {}) };
      for (const [skill, score] of Object.entries(skillScores)) {
        next[skill] = Math.max(next[skill] ?? 0, score);
      }
      tx.set(
        scoresRef,
        { uid, scores: next, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
      return next;
    });

    // Registro del intento (historial + métrica de "Simulaciones").
    const attemptId = `${uid}_${sessionId}`;
    await adminDb().collection("assessment_attempts").doc(attemptId).set({
      assessmentId: sessionId,
      userId: uid,
      jobId: session.jobId ?? null,
      status: "completed",
      answers: answersMap,
      score: overall,
      startedAt: session.createdAt ?? FieldValue.serverTimestamp(),
      completedAt: FieldValue.serverTimestamp(),
    });

    // Si la simulación era la prueba de una vacante concreta, registramos el candidato para el
    // reclutador dueño (loop developer→recruiter). Cierra el ciclo: la vacante ve aplicantes reales
    // y `/candidates` puede rankear por DNA. Tomar la prueba de una vacante = postular = consentir
    // compartir el resultado con ese reclutador. Es best-effort: un fallo aquí no invalida el intento.
    const jobId: string | null = session.jobId ?? null;
    if (jobId) {
      try {
        const jobSnap = await adminDb().collection("jobs").doc(jobId).get();
        const job = jobSnap.data();
        if (job && job.createdBy) {
          const requiredSkills: string[] = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];
          const userSnap = await adminDb().collection("users").doc(uid).get();
          const candidateName: string = userSnap.data()?.name || userSnap.data()?.displayName || "Candidato";

          // Snapshot de los scores del candidato en las skills que pide la vacante.
          const skillsSnapshot: Record<string, number> = {};
          for (const skill of requiredSkills) {
            const key = skill.toLowerCase();
            skillsSnapshot[key] = merged[key] ?? 0;
          }
          const matchPercent = calculateMatch(requiredSkills, merged);

          const matchId = `${uid}_${jobId}`;
          const matchRef = adminDb().collection("candidate_matches").doc(matchId);
          const jobRef = adminDb().collection("jobs").doc(jobId);

          // Mismo patrón read-modify-write que el DNA: en transacción para no perder el mejor
          // score entre intentos concurrentes y para que `applicantsCount` no se desincronice
          // del número real de candidatos (el contador solo sube al crear el match).
          await adminDb().runTransaction(async (tx) => {
            const matchSnap = await tx.get(matchRef);
            const isNewApplicant = !matchSnap.exists;
            const bestScore = Math.max(matchSnap.data()?.score ?? 0, overall);

            tx.set(
              matchRef,
              {
                userId: uid,
                recruiterId: job.createdBy,
                jobId,
                jobTitle: job.title ?? "",
                candidateName,
                score: bestScore,
                matchPercent,
                skills: skillsSnapshot,
                completedAt: FieldValue.serverTimestamp(),
              },
              { merge: true }
            );

            // Solo la primera vez que este candidato aplica a esta vacante cuenta como aplicante nuevo.
            if (isNewApplicant) {
              tx.update(jobRef, { applicantsCount: FieldValue.increment(1) });
            }
          });
        }
      } catch (matchErr) {
        console.error("[line/submit] candidate_match error:", matchErr);
      }
    }

    // La sesión es de un solo uso.
    await sessionRef.delete();

    return NextResponse.json({ overall, skillScores });
  } catch (err) {
    console.error("[line/submit] error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
