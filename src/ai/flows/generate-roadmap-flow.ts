
'use server';
/**
 * @fileOverview Generador de Roadmaps personalizados basados en el Skill DNA.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RoadmapStepSchema = z.object({
  title: z.string(),
  description: z.string(),
  estimatedHours: z.number(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  resources: z.array(z.string()).describe('Temas clave para investigar (ej: Roadmap.sh section, docs).')
});

const GenerateRoadmapInputSchema = z.object({
  currentSkills: z.array(z.object({
    name: z.string(),
    score: z.number()
  })),
  targetRole: z.string().default('Tech Lead'),
  gaps: z.array(z.string())
});

const GenerateRoadmapOutputSchema = z.object({
  steps: z.array(RoadmapStepSchema),
  summary: z.string()
});

export type GenerateRoadmapInput = z.infer<typeof GenerateRoadmapInputSchema>;
export type GenerateRoadmapOutput = z.infer<typeof GenerateRoadmapOutputSchema>;

export async function generateRoadmap(input: GenerateRoadmapInput): Promise<GenerateRoadmapOutput> {
  return generateRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRoadmapPrompt',
  input: {schema: GenerateRoadmapInputSchema},
  output: {schema: GenerateRoadmapOutputSchema},
  prompt: `Genera un roadmap de aprendizaje personalizado para un desarrollador que aspira a ser {{targetRole}}.

Basándote en sus habilidades actuales:
{{#each currentSkills}}
- {{this.name}}: {{this.score}}%
{{/each}}

Y sus brechas identificadas:
{{#each gaps}}
- {{this}}
{{/each}}

Crea 4 pasos concretos para alcanzar la maestría técnica necesaria para el rol de {{targetRole}}. Enfócate en el impacto y la profundidad técnica.`,
});

const generateRoadmapFlow = ai.defineFlow(
  {
    name: 'generateRoadmapFlow',
    inputSchema: GenerateRoadmapInputSchema,
    outputSchema: GenerateRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
