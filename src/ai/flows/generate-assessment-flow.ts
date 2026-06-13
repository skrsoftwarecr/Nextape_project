
'use server';
/**
 * @fileOverview Generador de preguntas para The LINE basado en el perfil.
 *
 * - generateQuestions - Genera preguntas dinámicas para el examen técnico.
 * - GenerateQuestionsInput - Perfil técnico y stack del usuario.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionSchema = z.object({
  id: z.string(),
  briefing: z.string().describe('Contexto corto y tecnológico del sistema.'),
  text: z.string().describe('Descripción de la anomalía o problema técnico.'),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().min(0).max(3),
  difficulty: z.enum(['junior', 'mid', 'senior', 'master']),
  tag: z.string().describe('Habilidad principal que evalúa (ej: React, PostgreSQL, Docker).')
});

const GenerateQuestionsInputSchema = z.object({
  stack: z.array(z.string()),
  level: z.string(),
  count: z.number().default(5)
});

const GenerateQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema)
});

export type GenerateQuestionsInput = z.infer<typeof GenerateQuestionsInputSchema>;
export type GenerateQuestionsOutput = z.infer<typeof GenerateQuestionsOutputSchema>;

export async function generateQuestions(input: GenerateQuestionsInput): Promise<GenerateQuestionsOutput> {
  return generateQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuestionsPrompt',
  input: {schema: GenerateQuestionsInputSchema},
  output: {schema: GenerateQuestionsOutputSchema},
  prompt: `Eres un Arquitecto de Software Senior encargado de evaluar candidatos de élite.

Genera {{count}} preguntas de opción múltiple para un entorno de simulación técnica llamado "The LINE".
Las preguntas deben ser de nivel {{level}} y enfocarse en el siguiente stack: {{#each stack}}{{this}}, {{/each}}.

REGLAS DE GENERACIÓN:
1. Las preguntas no deben ser sobre sintaxis, sino sobre resolución de problemas, arquitectura, performance y respuesta ante incidentes.
2. Cada pregunta debe tener una descripción de "anomalía" realista.
3. Las opciones deben ser plausibles pero solo una debe ser la mejor práctica o solución técnica correcta.

Stack: {{stack}}
Nivel: {{level}}`,
});

const generateQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuestionsFlow',
    inputSchema: GenerateQuestionsInputSchema,
    outputSchema: GenerateQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
