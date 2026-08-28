import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, verifyRequestUid } from "@/lib/firebase/admin";
import { buildQuestionPool, QUESTIONS_PER_EXAM } from "@/lib/server/question-pool";

export const runtime = "nodejs";

/**
 * POST /api/jobs/assessment
 * (Reclutador dueño) genera el **repertorio** de preguntas de una vacante: un banco amplio que se
 * guarda en `job_answer_keys/{jobId}` (server-only, con `correctIndex`). Cada candidato recibirá
 * después un sorteo de ese banco, sin volver a llamar a la IA.
 *
 * El documento público `jobs` NO recibe las preguntas — solo el estado (`assessmentReady`,
 * `assessmentPoolSize`). Publicar el repertorio entero permitiría a un candidato estudiárselo
 * antes de la prueba, que es precisamente lo que la evaluación debe impedir.
 *
 * Es **idempotente**: si ya hay repertorio no se regenera (ni se vuelve a pagar) salvo `force:true`.
 *
 * Body: { jobId: string, force?: boolean }
 * Auth: header `Authorization: Bearer <Firebase ID token>`.
 */
export async function POST(req: NextRequest) {
  const uid = await verifyRequestUid(req.headers.get("authorization"));
  if (!uid) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const jobId: string | undefined = body?.jobId;
  const force: boolean = body?.force === true;
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

    const keyRef = adminDb().collection("job_answer_keys").doc(jobId);

    // Reutilizar el repertorio existente evita que reintentos del formulario (o un reclutador
    // pulsando dos veces) disparen generaciones de IA duplicadas.
    if (!force) {
      const existing = await keyRef.get();
      const existingQuestions = existing.data()?.questions;
      if (Array.isArray(existingQuestions) && existingQuestions.length > 0) {
        return NextResponse.json({
          ok: true,
          reused: true,
          poolSize: existingQuestions.length,
        });
      }
    }

    if (!Array.isArray(job.requiredSkills) || job.requiredSkills.length === 0) {
      return NextResponse.json({ error: "job_without_skills" }, { status: 400 });
    }

    const pool = await buildQuestionPool({
      // Sin fallback: generar preguntas de frontend para una vacante de backend produce un
      // examen que no evalúa el puesto, y nadie lo nota porque no hay error.
      stack: job.requiredSkills,
      level: job.level || "senior",
    });

    // Con menos preguntas que un examen, el sorteo no aporta nada: se trata como fallo.
    if (pool.length < QUESTIONS_PER_EXAM) {
      console.error(`[jobs/assessment] repertorio insuficiente (${pool.length}) para ${jobId}`);
      return NextResponse.json(
        { error: "pool_too_small", poolSize: pool.length },
        { status: 502 }
      );
    }

    await keyRef.set({
      jobId,
      questions: pool,
      updatedAt: FieldValue.serverTimestamp(),
    });

    await jobRef.update({
      assessmentReady: true,
      assessmentPoolSize: pool.length,
      // Se elimina el campo de la etapa anterior: guardaba las preguntas del examen en el doc
      // público, que cualquiera puede leer (`jobs` es `read: if true`).
      assessmentQuestions: FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true, reused: false, poolSize: pool.length });
  } catch (err) {
    console.error("[jobs/assessment] error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
