import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const QuestionSchema = z.object({
  skillId: z.string(),
  scenario: z.string(),
  options: z.object({
    bad: z.string(),
    acceptable: z.string(),
    excellent: z.string(),
  }),
  difficulty: z.enum(['junior', 'mid', 'senior']),
  approved: z.boolean(),
  qualityScore: z.number().min(0).max(100).describe('Score interno de calidad 0-100. >= 70 se aprueba.'),
  qualityNotes: z.string().describe('Razón breve del score de calidad.'),
});

const GenerateQuestionsInputSchema = z.object({
  skillId: z.string(),
  skillName: z.string(),
  difficulty: z.enum(['junior', 'mid', 'senior']),
  count: z.number().min(1).max(20).default(5),
});

const GenerateQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema),
  approved: z.number().describe('Cantidad de preguntas aprobadas'),
  rejected: z.number().describe('Cantidad de preguntas rechazadas'),
});

export type GenerateQuestionsInput = z.infer<typeof GenerateQuestionsInputSchema>;
export type GenerateQuestionsOutput = z.infer<typeof GenerateQuestionsOutputSchema>;

export async function generateQuestions(
  input: GenerateQuestionsInput
): Promise<GenerateQuestionsOutput> {
  return generateQuestionsFlow(input);
}

const generateQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuestionsFlow',
    inputSchema: GenerateQuestionsInputSchema,
    outputSchema: GenerateQuestionsOutputSchema,
  },
  async (input) => {
    const promptText = `Eres un Arquitecto de Software Senior con 15 años de experiencia evaluando developers de élite.

Debes responder ÚNICAMENTE con un objeto JSON válido. Sin texto adicional, sin markdown, solo JSON puro.

Genera EXACTAMENTE ${input.count} preguntas para la skill "${input.skillName}" de nivel ${input.difficulty}.

El JSON debe tener esta estructura exacta:
{
  "questions": [
    {
      "skillId": "${input.skillId}",
      "scenario": "descripción de situación técnica real de producción",
      "options": {
        "bad": "mala práctica plausible",
        "acceptable": "funciona pero no es óptimo",
        "excellent": "mejor práctica senior"
      },
      "difficulty": "${input.difficulty}",
      "qualityScore": 85,
      "approved": true,
      "qualityNotes": "una línea explicando el score"
    }
  ]
}

REGLAS:
- "approved": true si qualityScore >= 70, false si no
- "qualityScore": número del 0 al 100
- "skillId": siempre "${input.skillId}"
- "difficulty": siempre "${input.difficulty}"
- Los escenarios son situaciones reales de producción, NUNCA preguntas de sintaxis
- Las 3 opciones deben ser plausibles (la mala no debe ser obvia)

REGLAS DE NIVEL:
- junior: conceptos fundamentales en situaciones simples
- mid: decisiones de diseño con trade-offs claros
- senior: arquitectura, performance, sistemas distribuidos

Genera EXACTAMENTE ${input.count} preguntas en el array "questions". Responde solo con el JSON.`;

    const response = await ai.generate({
      model: 'groq/llama-3.3-70b-versatile',
      prompt: promptText,
    });

    const rawText = response.text.trim();

    // Strip markdown code fences if present
    const jsonText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      throw new Error(`AI returned invalid JSON: ${jsonText.slice(0, 200)}`);
    }

    const rawQuestions = (parsed.questions as Record<string, unknown>[]) ?? [];

    const questions = rawQuestions.map((q) => ({
      skillId: String(q.skillId ?? input.skillId),
      scenario: String(q.scenario ?? ''),
      options: {
        bad: String((q.options as Record<string, unknown>)?.bad ?? ''),
        acceptable: String((q.options as Record<string, unknown>)?.acceptable ?? ''),
        excellent: String((q.options as Record<string, unknown>)?.excellent ?? ''),
      },
      difficulty: (q.difficulty as 'junior' | 'mid' | 'senior') ?? input.difficulty,
      qualityScore: Number(q.qualityScore ?? 0),
      // Normalize: model may return isApproved or approved
      approved: Boolean(q.approved ?? q.isApproved ?? (Number(q.qualityScore ?? 0) >= 70)),
      qualityNotes: String(q.qualityNotes ?? ''),
    }));

    const approvedCount = questions.filter((q) => q.approved).length;
    const rejectedCount = questions.length - approvedCount;

    return {
      questions,
      approved: approvedCount,
      rejected: rejectedCount,
    };
  }
);