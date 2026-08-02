import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import type { DocumentData, DocumentReference } from "firebase-admin/firestore";
import { adminDb, verifyRequestUid } from "@/lib/firebase/admin";
import {
  SPECIALTY_STACKS,
  normalizeSimulationParams,
  normalizeStoredQuestions,
  pickRandomQuestions,
  stripAnswerKey,
} from "@/lib/server/assessment";
import { buildQuestionPool, QUESTIONS_PER_EXAM } from "@/lib/server/question-pool";
import type { Question } from "@/types/question.types";

// El Admin SDK requiere el runtime de Node (no Edge).
export const runtime = "nodejs";

/**
 * Lee el repertorio de un documento de banco de preguntas. `[]` si no hay.
 * Normaliza los repertorios creados antes de existir los tipos de pregunta (sin campo `type`),
 * para que una vacante publicada entonces siga siendo evaluable.
 */
function readPool(data: DocumentData | undefined): Question[] {
  const questions = data?.questions;
  return Array.isArray(questions) ? normalizeStoredQuestions(questions as Question[]) : [];
}

/**
 * Devuelve el repertorio de `ref`; si está vacío, lo genera con IA y lo persiste.
 *
 * La generación es el camino EXCEPCIONAL: en régimen normal el repertorio ya existe (lo crea
 * `/api/jobs/assessment` al publicar la vacante) y esta función solo lee. La transacción evita
 * que dos candidatos que empiezan a la vez generen —y paguen— dos repertorios distintos.
 */
async function loadOrCreatePool(
  ref: DocumentReference,
  input: { stack: string[]; level: string },
  metadata: Record<string, unknown>
): Promise<Question[]> {
  const snap = await ref.get();
  const existing = readPool(snap.data());
  if (existing.length > 0) return existing;

  const generated = await buildQuestionPool(input);
  if (generated.length === 0) return [];

  return adminDb().runTransaction(async (tx) => {
    const fresh = await tx.get(ref);
    const freshPool = readPool(fresh.data());
    if (freshPool.length > 0) return freshPool; // otro candidato ganó la carrera
    tx.set(ref, {
      ...metadata,
      questions: generated,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return generated;
  });
}

/**
 * POST /api/line/start
 * Inicia una simulación: **sortea** las preguntas de un repertorio ya generado, guarda la clave
 * de respuestas en una sesión que el cliente no puede leer, y devuelve las preguntas SIN
 * `correctIndex`.
 *
 * En el camino normal **no llama a la IA**: el repertorio se genera una sola vez (al publicar la
 * vacante, o la primera vez que se usa una especialidad). Eso abarata el coste por candidato y
 * quita a este endpoint su capacidad de disparar trabajo caro bajo demanda.
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

  try {
    let pool: Question[] = [];
    let examSize = QUESTIONS_PER_EXAM;

    if (jobId) {
      const jobRef = adminDb().collection("jobs").doc(jobId);
      const jobSnap = await jobRef.get();
      if (!jobSnap.exists) {
        return NextResponse.json({ error: "job_not_found" }, { status: 404 });
      }
      const job = jobSnap.data()!;

      // Una vacante archivada no admite nuevas candidaturas.
      if (job.active === false) {
        return NextResponse.json({ error: "job_closed" }, { status: 409 });
      }

      // El reclutador puede fijar el tamaño del examen; se acota para que nadie pida un examen
      // absurdo (ni de 0 preguntas ni de 500).
      if (Number.isInteger(job.examQuestionCount)) {
        examSize = Math.min(Math.max(job.examQuestionCount, 3), 20);
      }

      const keyRef = adminDb().collection("job_answer_keys").doc(jobId);

      pool = await loadOrCreatePool(
        keyRef,
        {
          stack: Array.isArray(job.requiredSkills) && job.requiredSkills.length
            ? job.requiredSkills
            : SPECIALTY_STACKS.frontend,
          level: job.level || "senior",
        },
        { jobId }
      );

      // Si el repertorio se acaba de crear aquí (la generación al publicar falló), se refleja en
      // el doc público para que el reclutador vea el estado real de la prueba. Best-effort.
      if (pool.length > 0 && !job.assessmentReady) {
        await jobRef
          .update({ assessmentReady: true, assessmentPoolSize: pool.length })
          .catch((err) => console.error("[line/start] no se pudo marcar assessmentReady:", err));
      }
    } else {
      // Simulación general: un repertorio compartido por especialidad y nivel.
      const { specialty, level } = normalizeSimulationParams(body?.specialty, body?.level);
      const poolRef = adminDb().collection("line_question_pools").doc(`${specialty}_${level}`);

      pool = await loadOrCreatePool(
        poolRef,
        { stack: SPECIALTY_STACKS[specialty], level },
        { specialty, level }
      );
    }

    if (pool.length === 0) {
      return NextResponse.json({ error: "no_questions" }, { status: 502 });
    }

    // El examen del candidato: X preguntas sorteadas del repertorio, repartidas entre las skills
    // y entre los tipos de pregunta.
    const questions = pickRandomQuestions(pool, examSize);

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
