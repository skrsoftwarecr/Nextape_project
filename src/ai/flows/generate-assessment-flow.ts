'use server';
/**
 * @fileOverview Generador de preguntas para The LINE (proveedor: Groq / Llama).
 *
 * - generateQuestions - Genera preguntas dinámicas para el examen técnico.
 * - GenerateQuestionsInput - Perfil técnico y stack del usuario.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { generateJson } from '@/ai/generate';

const DIFFICULTIES = ['junior', 'mid', 'senior', 'master'] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

// Esquema de salida ESTRICTO (tipo canónico que consumen The LINE y los route handlers).
const QuestionSchema = z.object({
  id: z.string(),
  briefing: z.string(),
  text: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3),
  difficulty: z.enum(DIFFICULTIES),
  tag: z.string(),
});

const GenerateQuestionsInputSchema = z.object({
  stack: z.array(z.string()),
  level: z.string(),
  count: z.number().default(5),
});

const GenerateQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema),
});

export type GenerateQuestionsInput = z.infer<typeof GenerateQuestionsInputSchema>;
export type GenerateQuestionsOutput = z.infer<typeof GenerateQuestionsOutputSchema>;

export async function generateQuestions(input: GenerateQuestionsInput): Promise<GenerateQuestionsOutput> {
  return generateQuestionsFlow(input);
}

// Esquema TOLERANTE para lo que devuelve el modelo (sin `id`; difficulty como string libre que
// normalizamos después). Absorbe pequeñas variaciones del LLM sin romper la validación.
const LenientQuestion = z.object({
  briefing: z.string(),
  text: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.coerce.number().int().min(0).max(3),
  difficulty: z.string(),
  tag: z.string(),
});
const LenientOutput = z.object({ questions: z.array(LenientQuestion) });

function normalizeDifficulty(value: string): Difficulty {
  return (DIFFICULTIES as readonly string[]).includes(value) ? (value as Difficulty) : 'senior';
}

/**
 * Normaliza el `tag` que devuelve la IA al vocabulario exacto del `stack`, para que el score
 * se persista bajo una clave que el matching (`calculateMatch` vs `requiredSkills`) pueda casar.
 * Sin esto, un tag como "react hooks" no coincidiría con "react" y el usuario no recibiría crédito.
 */
function normalizeTag(tag: string, stack: string[]): string {
  const t = tag.toLowerCase().trim();
  const lowerStack = stack.map((s) => s.toLowerCase());
  if (lowerStack.includes(t)) return t;
  const match = lowerStack.find((s) => t.includes(s) || s.includes(t));
  return match ?? lowerStack[0] ?? t;
}

const generateQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuestionsFlow',
    inputSchema: GenerateQuestionsInputSchema,
    outputSchema: GenerateQuestionsOutputSchema,
  },
  async (input) => {
    const count = input.count ?? 5;
    const stack = input.stack.join(', ');

    const prompt = `Eres un Arquitecto de Software Senior en NEXTAPE que evalúa a candidatos de élite.

Responde ÚNICAMENTE con un objeto JSON válido. Sin markdown, sin texto adicional, solo JSON.

Genera EXACTAMENTE ${count} desafíos técnicos de nivel ${input.level} centrados en: ${stack}.

Estructura EXACTA del JSON:
{
  "questions": [
    {
      "briefing": "contexto corto de un sistema en producción",
      "text": "descripción del problema técnico específico a resolver",
      "options": ["solución 1", "solución 2", "solución 3", "solución 4"],
      "correctIndex": 0,
      "difficulty": "${input.level}",
      "tag": "una de las habilidades del stack, en minúsculas"
    }
  ]
}

REGLAS:
- "options": EXACTAMENTE 4 soluciones de ingeniería. Todas deben sonar profesionales; solo UNA es la óptima.
- "correctIndex": índice (0 a 3) de la opción correcta dentro de "options".
- "difficulty": uno de junior, mid, senior o master (el más cercano al nivel "${input.level}").
- "tag": DEBE ser EXACTAMENTE una de estas habilidades (en minúsculas): ${stack}. No inventes otras.
- NO preguntes sintaxis. Plantea problemas reales: fugas de memoria, cuellos de botella, seguridad, deuda técnica.
- Genera EXACTAMENTE ${count} preguntas en el array "questions".

Responde solo con el JSON.`;

    const parsed = await generateJson(prompt, LenientOutput);

    const questions = parsed.questions.map((q, i) => ({
      id: String(i),
      briefing: q.briefing,
      text: q.text,
      options: q.options,
      correctIndex: q.correctIndex,
      difficulty: normalizeDifficulty(q.difficulty),
      tag: normalizeTag(q.tag, input.stack),
    }));

    return { questions };
  }
);
