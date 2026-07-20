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
  prompt: `Eres un Arquitecto de Software Senior en NEXTAPE encargado de evaluar candidatos de élite.

Tu misión es generar {{count}} desafíos técnicos críticos para un entorno de simulación llamado "The LINE".
Las preguntas deben ser de nivel {{level}} y centrarse en el siguiente stack: {{#each stack}}{{this}}, {{/each}}.

PRINCIPIOS DE NEXTAPE:
1. NO PREGUNTES SOBRE SINTAXIS. Pregunta sobre cómo resolverían un problema real (fugas de memoria, cuellos de botella, debilidades de seguridad, deuda técnica).
2. BRIEFING: Describe un entorno de producción (ej: "Un microservicio de pagos está devolviendo 500s intermitentes bajo carga").
3. DESAFÍO: Describe el problema técnico específico.
4. OPCIONES: Deben ser 4 soluciones de ingeniería. Todas deben sonar profesionales, pero solo una es la arquitectura óptima o la corrección definitiva según las mejores prácticas industriales.

Nivel solicitado: {{level}}
Habilidades clave: {{#each stack}}{{this}} {{/each}}`,
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
