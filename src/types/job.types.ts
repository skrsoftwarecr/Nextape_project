import { FirestoreTimestamp } from "./firebase.types";

export interface Question {
  id: string;
  briefing: string;
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: string;
  tag: string;
}

/**
 * Pregunta expuesta al cliente: SIN la respuesta correcta (`correctIndex`).
 * La clave de respuestas nunca se envía al navegador; el grading ocurre en servidor.
 */
export type PublicQuestion = Omit<Question, "correctIndex">;

export interface JobOpportunity {
  id?: string;
  title: string;
  company: string;
  description: string;
  salary: string;
  location: string;
  type: string;
  level: string;
  requiredSkills: string[];
  // El doc público `jobs` guarda las preguntas SIN la respuesta correcta (la clave vive en
  // `job_answer_keys`, server-only). Por eso es PublicQuestion[], no Question[].
  assessmentQuestions?: PublicQuestion[];
  createdBy: string;
  postedAt: FirestoreTimestamp;
  applicantsCount?: number;
}

/**
 * Registro de un candidato que completó la prueba (The LINE) de una vacante concreta.
 * Vive en `candidate_matches` (escritura SOLO servidor, Admin SDK). La regla de Firestore
 * permite leerlo al propio candidato (`userId`) o al reclutador dueño de la vacante (`recruiterId`).
 * doc id = `${userId}_${jobId}` (un registro por candidato y vacante; se conserva el mejor `score`).
 */
export interface CandidateMatch {
  /** uid del candidato. */
  userId: string;
  /** uid del reclutador dueño de la vacante (denormalizado para la regla de lectura). */
  recruiterId: string;
  jobId: string;
  /** Título de la vacante, denormalizado para el listado de candidatos. */
  jobTitle: string;
  /** Nombre del candidato, denormalizado para el listado. */
  candidateName: string;
  /** Resultado de The LINE para esta vacante (0–100). Se conserva el mejor. */
  score: number;
  /** Afinidad DNA ↔ `requiredSkills` de la vacante (0–100). */
  matchPercent: number;
  /** Snapshot de los scores del candidato en las skills que pide la vacante. */
  skills: Record<string, number>;
  completedAt: FirestoreTimestamp;
}
