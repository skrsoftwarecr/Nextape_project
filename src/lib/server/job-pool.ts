import type { Firestore } from "firebase-admin/firestore";
import { LEVELS, normalizeStoredQuestions, pickRandomQuestions } from "./assessment";
import { MAX_SKILLS_PER_JOB, resolveTechnologyId } from "@/lib/technologies";
import type { Question } from "@/types/question.types";

/**
 * Repertorio de la prueba de una vacante, compuesto desde el **banco precargado**
 * (`line_question_pools`), sin llamar a ningún modelo de IA.
 *
 * Por qué no se genera con IA al publicar: la generación son varias llamadas al modelo por skill
 * dentro de una Netlify Function síncrona, y basta con que el proveedor falle o se retrase para
 * que la vacante se quede sin prueba — el candidato pulsa "Postular" y recibe un error. Componer
 * desde el banco son unas pocas lecturas de Firestore: rápido, sin coste y sin depender de que
 * haya un proveedor disponible.
 *
 * Cada vacante sigue teniendo SU prueba: un subconjunto propio, sorteado y estratificado por tipo,
 * que se guarda en `job_answer_keys/{jobId}`; y cada candidato recibe a su vez un sorteo de ese
 * repertorio. Cuando el banco crece (`npm run seed:questions`), las vacantes nuevas lo aprovechan.
 *
 * SOLO servidor: el repertorio contiene las claves de respuesta.
 */

/** Preguntas máximas por skill dentro del repertorio de una vacante. */
export const JOB_POOL_PER_SKILL = 30;

/** Por debajo de esto no hay variedad suficiente para examinar: la vacante no es evaluable. */
export const JOB_POOL_MIN_QUESTIONS = 10;

/** Tope de skills que se componen: el mismo que deja elegir el formulario de vacantes. */
export const JOB_POOL_MAX_SKILLS = MAX_SKILLS_PER_JOB;

export interface JobPoolCoverage {
  /** Skill tal como la escribió la vacante. */
  skill: string;
  /** Id canónico con el que se buscó en el banco (y con el que se acreditará el score). */
  key: string;
  /** Nivel del que salieron las preguntas (puede diferir del de la vacante si no había banco). */
  level: string;
  questions: number;
}

export interface JobPoolResult {
  questions: Question[];
  covered: JobPoolCoverage[];
  /** Skills de la vacante sin banco en ningún nivel: no se pueden evaluar hoy. */
  missing: string[];
}

/** Niveles a probar, empezando por el de la vacante y siguiendo por cercanía. */
export function levelFallbackOrder(level: string): string[] {
  switch (String(level).toLowerCase()) {
    case "junior":
      return ["junior", "mid", "senior"];
    case "mid":
      return ["mid", "senior", "junior"];
    default:
      // "senior" y valores heredados ("master") empiezan por senior.
      return ["senior", "mid", "junior"];
  }
}

/**
 * Compone el repertorio a partir de los documentos del banco ya cargados. PURA: no toca la red,
 * así que es testeable. `bank` indexa preguntas por id de documento (`<tecnologia>_<nivel>`).
 */
export function buildJobPoolFromBank({
  skills,
  level,
  bank,
  perSkill = JOB_POOL_PER_SKILL,
}: {
  skills: string[];
  level: string;
  bank: Record<string, Question[]>;
  perSkill?: number;
}): JobPoolResult {
  const covered: JobPoolCoverage[] = [];
  const missing: string[] = [];
  const collected: Question[] = [];
  const seenKeys = new Set<string>();

  for (const raw of skills.slice(0, JOB_POOL_MAX_SKILLS)) {
    const key = resolveTechnologyId(raw);
    if (!key) {
      missing.push(raw);
      continue;
    }
    if (seenKeys.has(key)) continue; // "Next.js" y "nextjs" en la misma vacante son la misma skill
    seenKeys.add(key);

    const usedLevel = levelFallbackOrder(level).find((lv) => (bank[`${key}_${lv}`] ?? []).length > 0);
    if (!usedLevel) {
      missing.push(raw);
      continue;
    }

    const source = normalizeStoredQuestions(bank[`${key}_${usedLevel}`]);
    // El tag se fija al id canónico: es la clave bajo la que se acredita el DNA y la que busca el
    // match de la vacante.
    const picked = pickRandomQuestions(source, perSkill).map((q) => ({ ...q, tag: key }));
    collected.push(...picked);
    covered.push({ skill: raw, key, level: usedLevel, questions: picked.length });
  }

  return {
    // Ids únicos dentro del repertorio: cada documento del banco numera desde 0.
    questions: collected.map((q, i) => ({ ...q, id: `${q.tag}-${i}` })),
    covered,
    missing,
  };
}

/** Carga del banco los documentos necesarios (una sola lectura por lotes) y compone el repertorio. */
export async function composeJobPoolFromBank(
  db: Firestore,
  skills: string[],
  level: string
): Promise<JobPoolResult> {
  const keys = [
    ...new Set(
      skills
        .slice(0, JOB_POOL_MAX_SKILLS)
        .map((s) => resolveTechnologyId(s))
        .filter((k): k is string => Boolean(k))
    ),
  ];

  const refs = keys.flatMap((k) =>
    LEVELS.map((lv) => db.collection("line_question_pools").doc(`${k}_${lv}`))
  );
  const snaps = refs.length > 0 ? await db.getAll(...refs) : [];

  const bank: Record<string, Question[]> = {};
  for (const snap of snaps) {
    const questions = snap.data()?.questions;
    if (Array.isArray(questions) && questions.length > 0) bank[snap.id] = questions as Question[];
  }

  return buildJobPoolFromBank({ skills, level, bank });
}
