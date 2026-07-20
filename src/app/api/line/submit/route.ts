import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, verifyRequestUid } from "@/lib/firebase/admin";
import { gradeAnswers } from "@/lib/server/assessment";
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
    const { skillScores, overall } = gradeAnswers(questions, answers);

    // DNA: merge quedándonos con el MEJOR score por skill.
    const scoresRef = adminDb().collection("user_skill_scores").doc(uid);
    const currentSnap = await scoresRef.get();
    const merged: Record<string, number> = { ...(currentSnap.data()?.scores || {}) };
    for (const [skill, score] of Object.entries(skillScores)) {
      merged[skill] = Math.max(merged[skill] ?? 0, score);
    }
    await scoresRef.set(
      { uid, scores: merged, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );

    // Registro del intento (historial + métrica de "Simulaciones").
    const attemptId = `${uid}_${sessionId}`;
    await adminDb().collection("assessment_attempts").doc(attemptId).set({
      assessmentId: sessionId,
      userId: uid,
      jobId: session.jobId ?? null,
      status: "completed",
      answers: {},
      score: overall,
      startedAt: session.createdAt ?? FieldValue.serverTimestamp(),
      completedAt: FieldValue.serverTimestamp(),
    });

    // La sesión es de un solo uso.
    await sessionRef.delete();

    return NextResponse.json({ overall, skillScores });
  } catch (err) {
    console.error("[line/submit] error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
