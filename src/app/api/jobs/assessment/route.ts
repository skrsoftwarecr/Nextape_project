import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, verifyRequestUid } from "@/lib/firebase/admin";
import { generateQuestions } from "@/ai/flows/generate-assessment-flow";
import { stripAnswerKey } from "@/lib/server/assessment";
import type { Question } from "@/types/job.types";

export const runtime = "nodejs";

/**
 * POST /api/jobs/assessment
 * Genera la prueba técnica de una vacante EN SERVIDOR. Guarda en el documento público `jobs`
 * las preguntas SIN `correctIndex`, y la clave de respuestas en `job_answer_keys/{jobId}`
 * (colección que el cliente no puede leer). Solo el reclutador dueño de la vacante puede llamarlo.
 *
 * Body: { jobId: string }
 * Auth: header `Authorization: Bearer <Firebase ID token>`.
 */
export async function POST(req: NextRequest) {
  const uid = await verifyRequestUid(req.headers.get("authorization"));
  if (!uid) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const jobId: string | undefined = body?.jobId;
  if (!jobId) {
    return NextResponse.json({ error: "missing_job" }, { status: 400 });
  }

  try {
    const jobRef = adminDb().collection("jobs").doc(jobId);
    const jobSnap = await jobRef.get();
    if (!jobSnap.exists) {
      return NextResponse.json({ error: "job_not_found" }, { status: 404 });
    }
    const job = jobSnap.data()!;
    if (job.createdBy !== uid) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const result = await generateQuestions({
      stack: job.requiredSkills || ["react", "nextjs"],
      level: job.level || "senior",
      count: 5,
    });
    const questions = result.questions as Question[];

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: "no_questions" }, { status: 502 });
    }

    // Clave de respuestas protegida (server-only).
    await adminDb().collection("job_answer_keys").doc(jobId).set({
      jobId,
      questions,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Preguntas públicas SIN la respuesta correcta.
    await jobRef.update({
      assessmentQuestions: stripAnswerKey(questions),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true, count: questions.length });
  } catch (err) {
    console.error("[jobs/assessment] error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
