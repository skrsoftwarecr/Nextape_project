import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, verifyRequestUid } from "@/lib/firebase/admin";
import { composeJobPoolFromBank, JOB_POOL_MIN_QUESTIONS } from "@/lib/server/job-pool";

export const runtime = "nodejs";

/**
 * POST /api/jobs/assessment
 * (Reclutador dueño) crea el **repertorio** de la prueba de su vacante y lo guarda en
 * `job_answer_keys/{jobId}` (server-only, con las claves de respuesta).
 *
 * El repertorio se compone desde el banco precargado de preguntas para las skills y el nivel de la
 * vacante (`src/lib/server/job-pool.ts`). No se llama a ningún modelo de IA: antes se generaba en
 * esta misma petición y bastaba con que el proveedor fallara —clave revocada, modelo retirado, cuota
 * agotada— para que la vacante quedara sin prueba y los candidatos recibieran un error al postular.
 *
 * El documento público `jobs` NO recibe las preguntas: solo el estado (`assessmentReady`,
 * `assessmentPoolSize`, `assessmentMissingSkills`).
 *
 * Es idempotente: si ya hay repertorio no se recompone salvo `force: true`.
 *
 * Body: { jobId: string, force?: boolean }
 */
export async function POST(req: NextRequest) {
  const uid = await verifyRequestUid(req.headers.get("authorization"));
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const jobId: string | undefined = typeof body?.jobId === "string" ? body.jobId : undefined;
  const force: boolean = body?.force === true;
  if (!jobId) return NextResponse.json({ error: "missing_job" }, { status: 400 });

  try {
    const jobRef = adminDb().collection("jobs").doc(jobId);
    const jobSnap = await jobRef.get();
    if (!jobSnap.exists) return NextResponse.json({ error: "job_not_found" }, { status: 404 });

    const job = jobSnap.data()!;
    if (job.createdBy !== uid) return NextResponse.json({ error: "forbidden" }, { status: 403 });

    if (!Array.isArray(job.requiredSkills) || job.requiredSkills.length === 0) {
      return NextResponse.json({ error: "job_without_skills" }, { status: 400 });
    }

    const keyRef = adminDb().collection("job_answer_keys").doc(jobId);

    if (!force) {
      const existing = await keyRef.get();
      const questions = existing.data()?.questions;
      if (Array.isArray(questions) && questions.length >= JOB_POOL_MIN_QUESTIONS) {
        return NextResponse.json({
          ok: true,
          reused: true,
          poolSize: questions.length,
          missingSkills: existing.data()?.missing ?? [],
        });
      }
    }

    const level = typeof job.level === "string" ? job.level : "senior";
    const { questions, covered, missing } = await composeJobPoolFromBank(
      adminDb(),
      job.requiredSkills,
      level,
    );

    if (questions.length < JOB_POOL_MIN_QUESTIONS) {
      // La vacante queda marcada como NO lista y dice qué skills faltan: el reclutador puede
      // ajustarlas en vez de publicar una prueba que el candidato no podría hacer.
      await jobRef.update({
        assessmentReady: false,
        assessmentPoolSize: questions.length,
        assessmentMissingSkills: missing,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return NextResponse.json(
        { error: "no_bank_for_skills", poolSize: questions.length, missingSkills: missing },
        { status: 422 },
      );
    }

    await keyRef.set({
      jobId,
      questions,
      covered,
      missing,
      source: "bank",
      updatedAt: FieldValue.serverTimestamp(),
    });

    await jobRef.update({
      assessmentReady: true,
      assessmentPoolSize: questions.length,
      assessmentMissingSkills: missing,
      // Campo de una etapa anterior que guardaba las preguntas en el doc público.
      assessmentQuestions: FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      ok: true,
      reused: false,
      poolSize: questions.length,
      missingSkills: missing,
    });
  } catch (err) {
    console.error("[jobs/assessment] error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
