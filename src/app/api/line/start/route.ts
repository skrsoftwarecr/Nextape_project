import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, verifyRequestUid } from "@/lib/firebase/admin";
import { generateQuestions } from "@/ai/flows/generate-assessment-flow";
import { SPECIALTY_STACKS, stripAnswerKey } from "@/lib/server/assessment";
import type { Question } from "@/types/job.types";

// El Admin SDK requiere el runtime de Node (no Edge).
export const runtime = "nodejs";

/**
 * POST /api/line/start
 * Inicia una simulación: genera (o carga) preguntas EN SERVIDOR, guarda la clave de respuestas
 * en una sesión que el cliente no puede leer, y devuelve las preguntas SIN `correctIndex`.
 *
 * Body: { jobId?: string } | { specialty?: string, level?: string }
 * Auth: header `Authorization: Bearer <Firebase ID token>`.
 */
export async function POST(req: NextRequest) {
  const uid = await verifyRequestUid(req.headers.get("authorization"));
  if (!uid) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const jobId: string | undefined = body?.jobId;
  const specialty: string = body?.specialty ?? "frontend";
  const level: string = body?.level ?? "senior";

  try {
    let questions: Question[] = [];

    if (jobId) {
      // Preferimos la clave de respuestas protegida (server-only); si no existe, generamos.
      const keySnap = await adminDb().collection("job_answer_keys").doc(jobId).get();
      if (keySnap.exists && Array.isArray(keySnap.data()?.questions)) {
        questions = keySnap.data()!.questions as Question[];
      } else {
        const jobSnap = await adminDb().collection("jobs").doc(jobId).get();
        const job = jobSnap.data();
        const result = await generateQuestions({
          stack: job?.requiredSkills || ["react", "nextjs"],
          level: job?.level || "senior",
          count: 5,
        });
        questions = result.questions as Question[];
      }
    } else {
      const result = await generateQuestions({
        stack: SPECIALTY_STACKS[specialty] ?? SPECIALTY_STACKS.frontend,
        level,
        count: 5,
      });
      questions = result.questions as Question[];
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: "no_questions" }, { status: 502 });
    }

    // Sesión con la clave completa (solo Admin puede leerla/escribirla).
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
    });
  } catch (err) {
    console.error("[line/start] error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
