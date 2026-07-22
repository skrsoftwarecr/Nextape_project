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

export interface CompatibilityMatch {
  userId: string;
  jobId: string;
  percentage: number;
  breakdown: { [skill: string]: number };
  calculatedAt: FirestoreTimestamp;
}
