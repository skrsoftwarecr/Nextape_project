import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import type { DocumentData } from "firebase-admin/firestore";
import { adminDb, verifyRequestUid } from "@/lib/firebase/admin";
import {
  examSizeFor,
  normalizeSimulationParams,
  normalizeStoredQuestions,
  pickRandomQuestions,
  stripAnswerKey,
} from "@/lib/server/assessment";
import { composeJobPoolFromBank, JOB_POOL_MIN_QUESTIONS } from "@/lib/server/job-pool";
import { hasGithubEvidence } from "@/lib/server/github-evidence";
import type { Question } from "@/types/question.types";

// El Admin SDK requiere el runtime de Node (no Edge).
export const runtime = "nodejs";

/**
 * Lee el repertorio de un documento de banco de preguntas. `[]` si no hay.
 * Normaliza repertorios anteriores a los tipos de pregunta (sin campo `type`).
 */
function readPool(data: DocumentData | undefined): Question[] {
  const questions = data?.questions;
  return Array.isArray(questions) ? normalizeStoredQuestions(questions as Question[]) : [];
}

/**
 * POST /api/line/start
 * Inicia una simulación: sortea las preguntas de un repertorio ya existente, guarda la clave en
 * una sesión que el cliente no puede leer y devuelve las preguntas SIN claves de respuesta.
 *
 * Tamaño del examen: 10 preguntas si el candidato tiene su GitHub analizado (su código real aporta
 * señal) y 20 si no; en una vacante, el reclutador puede fijarlo (10–30).
 *
 * En ningún camino se llama a un modelo de IA: la práctica general lee el banco precargado, y una
 * vacante sin repertorio lo compone al vuelo desde ese mismo banco.
 *
 * Body: { jobId?: string } | { technology?: string, specialty?: string, level?: string }
 * Auth: header `Authorization: Bearer <Firebase ID token>`.
 */
export async function POST(req: NextRequest) {
  const uid = await verifyRequestUid(req.headers.get("authorization"));
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const jobId: string | undefined = typeof body?.jobId === "string" ? body.jobId : undefined;

  try {
    const githubSnap = await adminDb().collection("github_evidence").doc(uid).get();
    const withGithub = hasGithubEvidence(githubSnap.data());

    let pool: Question[] = [];
    let override: unknown;

    if (jobId) {
      const jobRef = adminDb().collection("jobs").doc(jobId);
      const jobSnap = await jobRef.get();
      if (!jobSnap.exists) return NextResponse.json({ error: "job_not_found" }, { status: 404 });

      const job = jobSnap.data()!;

      if (job.active === false) {
        return NextResponse.json({ error: "job_closed" }, { status: 409 });
      }

      // Sin skills la prueba no evalúa el puesto; sin dueño no hay empresa que reciba la candidatura.
      if (!Array.isArray(job.requiredSkills) || job.requiredSkills.length === 0 || !job.createdBy) {
        console.error(`[line/start] jobId=${jobId} incompleta (skills/createdBy). No evaluable.`);
        return NextResponse.json({ error: "job_incomplete" }, { status: 409 });
      }

      override = job.examQuestionCount;
      const keyRef = adminDb().collection("job_answer_keys").doc(jobId);
      pool = readPool((await keyRef.get()).data());

      if (pool.length === 0) {
        // La vacante no tiene repertorio (se publicó antes de este cambio, o falló al publicarse):
        // se compone ahora desde el banco. Rápido y sin IA, así que cabe en la petición.
        const composed = await composeJobPoolFromBank(
          adminDb(),
          job.requiredSkills,
          typeof job.level === "string" ? job.level : "senior",
        );

        if (composed.questions.length < JOB_POOL_MIN_QUESTIONS) {
          console.error(
            `[line/start] jobId=${jobId} sin banco suficiente (${composed.questions.length}). ` +
              `Skills sin preguntas: ${composed.missing.join(", ") || "—"}`,
          );
          return NextResponse.json(
            { error: "job_without_bank", missingSkills: composed.missing },
            { status: 409 },
          );
        }

        // Transacción: dos candidatos que empiezan a la vez comparten el mismo repertorio.
        pool = await adminDb().runTransaction(async (tx) => {
          const fresh = readPool((await tx.get(keyRef)).data());
          if (fresh.length > 0) return fresh;
          tx.set(keyRef, {
            jobId,
            questions: composed.questions,
            covered: composed.covered,
            missing: composed.missing,
            source: "bank",
            updatedAt: FieldValue.serverTimestamp(),
          });
          tx.update(jobRef, {
            assessmentReady: true,
            assessmentPoolSize: composed.questions.length,
            assessmentMissingSkills: composed.missing,
          });
          return composed.questions;
        });
      }
    } else {
      // Práctica general: repertorio PRECARGADO por tecnología y nivel. Solo se lee un documento.
      const { subject, level } = normalizeSimulationParams(
        body?.technology ?? body?.specialty,
        body?.level,
      );
      pool = readPool(
        (await adminDb().collection("line_question_pools").doc(`${subject}_${level}`).get()).data(),
      );

      if (pool.length === 0) {
        console.warn(`[line/start] banco sin precargar: ${subject}_${level}`);
        return NextResponse.json({ error: "pool_not_seeded", subject, level }, { status: 503 });
      }
    }

    if (pool.length === 0) {
      return NextResponse.json({ error: "no_questions" }, { status: 502 });
    }

    const overrideSet = typeof override === "number" && Number.isInteger(override);
    const examSize = examSizeFor({ hasGithubEvidence: withGithub, override });

    // Sorteo estratificado por skill y por tipo de pregunta.
    const questions = pickRandomQuestions(pool, examSize);

    const sessionRef = adminDb().collection("line_sessions").doc();
    await sessionRef.set({
      userId: uid,
      jobId: jobId ?? null,
      questions,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      sessionId: sessionRef.id,
      questions: stripAnswerKey(questions),
      examSize: questions.length,
      githubCompensated: withGithub && !overrideSet,
    });
  } catch (err) {
    console.error("[line/start] error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
