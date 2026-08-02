/**
 * Tipos de pregunta de **The LINE**.
 *
 * El examen no es solo "marca con X": una prueba combina varios tipos, como un examen real.
 * Todos los tipos aquí se corrigen **en servidor y de forma determinista** (sin IA), que es lo
 * que permite que hacer una prueba no cueste ni una llamada al modelo.
 *
 * ⚠️ Si algún día se añade un tipo de respuesta abierta, su corrección exigirá un LLM por entrega
 * y `/api/line/submit` volverá a ser un disparador de trabajo caro. En ese caso hay que corregir
 * en diferido, no dentro del submit.
 */

export const QUESTION_TYPES = [
  "multiple_choice",
  "code_output",
  "multi_select",
  "true_false",
  "ordering",
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

/** Campos comunes a todos los tipos. */
export interface QuestionBase {
  id: string;
  type: QuestionType;
  /** Contexto corto del sistema en producción donde ocurre el problema. */
  briefing: string;
  /** Enunciado. */
  text: string;
  difficulty: string;
  /** Skill evaluada. Invariante del match: siempre en minúsculas. */
  tag: string;
  /**
   * Fuente de referencia asociada (catálogo en `src/lib/server/sources.ts`).
   * ⚠️ Atribuida por el modelo, **no verificada**. Nunca se envía al cliente.
   */
  source?: string;
}

/** Clásica: 4 opciones, una sola correcta. */
export interface MultipleChoiceQuestion extends QuestionBase {
  type: "multiple_choice";
  options: string[];
  correctIndex: number;
}

/** Lee un fragmento de código y elige el resultado/comportamiento correcto. */
export interface CodeOutputQuestion extends QuestionBase {
  type: "code_output";
  code: string;
  /** Lenguaje para el resaltado y el contexto (p. ej. "typescript"). */
  language: string;
  options: string[];
  correctIndex: number;
}

/** Varias respuestas correctas de una lista. Admite crédito parcial. */
export interface MultiSelectQuestion extends QuestionBase {
  type: "multi_select";
  options: string[];
  /** Índices correctos dentro de `options`. Al menos uno. */
  correctIndexes: number[];
}

/** Afirmación técnica: verdadera o falsa. */
export interface TrueFalseQuestion extends QuestionBase {
  type: "true_false";
  correct: boolean;
}

/**
 * Ordenar pasos de un procedimiento (despliegue, depuración, mitigación de un incidente).
 *
 * `items` se almacena **desordenado** a propósito; `correctOrder[k]` es el índice dentro de
 * `items` del elemento que va en la posición `k`. Si `items` se guardara en el orden correcto,
 * enviarlo al cliente revelaría la respuesta.
 */
export interface OrderingQuestion extends QuestionBase {
  type: "ordering";
  items: string[];
  correctOrder: number[];
}

export type Question =
  | MultipleChoiceQuestion
  | CodeOutputQuestion
  | MultiSelectQuestion
  | TrueFalseQuestion
  | OrderingQuestion;

/**
 * Pregunta tal y como la ve el candidato: **sin ningún campo de solución**.
 *
 * Se construye con lista blanca (`toPublicQuestion`), no borrando campos: así, si mañana se añade
 * un tipo con una clave nueva, no se filtra por descuido. Es la invariante I1 del proyecto.
 */
export type PublicMultipleChoice = Omit<MultipleChoiceQuestion, "correctIndex" | "source">;
export type PublicCodeOutput = Omit<CodeOutputQuestion, "correctIndex" | "source">;
export type PublicMultiSelect = Omit<MultiSelectQuestion, "correctIndexes" | "source">;
export type PublicTrueFalse = Omit<TrueFalseQuestion, "correct" | "source">;
export type PublicOrdering = Omit<OrderingQuestion, "correctOrder" | "source">;

export type PublicQuestion =
  | PublicMultipleChoice
  | PublicCodeOutput
  | PublicMultiSelect
  | PublicTrueFalse
  | PublicOrdering;

/**
 * Respuesta del candidato a una pregunta. La forma depende del tipo:
 * - `multiple_choice` / `code_output` → `number` (índice elegido)
 * - `multi_select` → `number[]` (índices elegidos)
 * - `true_false` → `boolean`
 * - `ordering` → `number[]` (índice de `items` elegido para cada posición)
 * - sin responder → `null`
 */
export type Answer = number | boolean | number[] | null;
