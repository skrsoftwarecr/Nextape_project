import type { Question, PublicQuestion } from "@/types/job.types";

/**
 * Utilidades de servidor para "The LINE". SOLO se importan desde route handlers.
 * La respuesta correcta (`correctIndex`) nunca sale de aquí hacia el cliente.
 */

/** Stacks por especialidad para la simulación general. */
export const SPECIALTY_STACKS: Record<string, string[]> = {
  frontend: ["react", "nextjs", "typescript", "tailwind"],
  backend: ["node.js", "postgresql", "docker", "redis"],
  devops: ["kubernetes", "ci-cd", "aws", "terraform"],
};

/** Elimina `correctIndex` de las preguntas antes de enviarlas al cliente. */
export function stripAnswerKey(questions: Question[]): PublicQuestion[] {
  return questions.map(({ correctIndex: _omit, ...rest }) => rest);
}

/**
 * Valida que el set de respuestas corresponda 1:1 con las preguntas de la sesión.
 *
 * Sin esto, un `answers` más corto que `questions` se corregía en silencio: las faltantes
 * contaban como falladas y el usuario recibía un score bajo sin saber por qué (y un cliente
 * roto podía degradar el DNA de forma invisible). Mejor rechazar el envío.
 */
export function isValidAnswerSet(questions: Question[], answers: number[]): boolean {
  if (!Array.isArray(answers) || answers.length !== questions.length) return false;
  return answers.every(
    (a, i) => Number.isInteger(a) && a >= 0 && a < (questions[i]?.options?.length ?? 0)
  );
}

export interface GradeResult {
  /** Score por habilidad (tag) en 0–100. */
  skillScores: Record<string, number>;
  /** Score global de la simulación en 0–100. */
  overall: number;
}

/**
 * Corrige las respuestas contra la clave. `answers[i]` es el índice elegido para `questions[i]`.
 * Score por tag = % de aciertos dentro de ese tag. Global = % de aciertos total.
 */
export function gradeAnswers(questions: Question[], answers: number[]): GradeResult {
  const perTag: Record<string, { correct: number; total: number }> = {};
  let correctCount = 0;

  questions.forEach((q, i) => {
    const tag = String(q.tag || "general").toLowerCase();
    perTag[tag] = perTag[tag] || { correct: 0, total: 0 };
    perTag[tag].total++;
    if (answers[i] === q.correctIndex) {
      perTag[tag].correct++;
      correctCount++;
    }
  });

  const skillScores: Record<string, number> = {};
  for (const [tag, { correct, total }] of Object.entries(perTag)) {
    skillScores[tag] = Math.round((correct / total) * 100);
  }

  const overall = questions.length > 0
    ? Math.round((correctCount / questions.length) * 100)
    : 0;

  return { skillScores, overall };
}
