'use server';
/**
 * @fileOverview Generador de Roadmaps personalizados basados en el Skill DNA (proveedor: Groq / Llama).
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { generateJsonWithFallback } from '@/ai/generate';

const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
type Priority = (typeof PRIORITIES)[number];

// Esquema de salida ESTRICTO (tipo canónico que consume la página de Roadmap).
const RoadmapStepSchema = z.object({
  title: z.string(),
  description: z.string(),
  estimatedHours: z.number(),
  priority: z.enum(PRIORITIES),
  resources: z.array(z.string()),
});

const GenerateRoadmapInputSchema = z.object({
  currentSkills: z.array(z.object({
    name: z.string(),
    score: z.number(),
  })),
  targetRole: z.string().default('Tech Lead'),
  gaps: z.array(z.string()),
});

const GenerateRoadmapOutputSchema = z.object({
  steps: z.array(RoadmapStepSchema),
  summary: z.string(),
});

export type GenerateRoadmapInput = z.infer<typeof GenerateRoadmapInputSchema>;
export type GenerateRoadmapOutput = z.infer<typeof GenerateRoadmapOutputSchema>;

export async function generateRoadmap(input: GenerateRoadmapInput): Promise<GenerateRoadmapOutput> {
  return generateRoadmapFlow(input);
}

// Esquema TOLERANTE para la salida del modelo (priority como string libre; resources opcional).
const LenientStep = z.object({
  title: z.string(),
  description: z.string(),
  estimatedHours: z.coerce.number(),
  priority: z.string(),
  resources: z.array(z.string()).optional(),
});
const LenientRoadmap = z.object({
  steps: z.array(LenientStep),
  summary: z.string(),
});

function normalizePriority(value: string): Priority {
  return (PRIORITIES as readonly string[]).includes(value) ? (value as Priority) : 'medium';
}

const generateRoadmapFlow = ai.defineFlow(
  {
    name: 'generateRoadmapFlow',
    inputSchema: GenerateRoadmapInputSchema,
    outputSchema: GenerateRoadmapOutputSchema,
  },
  async (input) => {
    const skillsList =
      input.currentSkills.map((s) => `- ${s.name}: ${s.score}%`).join('\n') || '- (sin datos aún)';
    const gapsList = input.gaps.map((g) => `- ${g}`).join('\n') || '- (ninguna)';

    const prompt = `Eres un mentor técnico de NEXTAPE. Genera un roadmap de aprendizaje personalizado para un developer que aspira a ${input.targetRole}.

Responde ÚNICAMENTE con un objeto JSON válido. Sin markdown, sin texto adicional, solo JSON.

Habilidades actuales:
${skillsList}

Brechas detectadas:
${gapsList}

Estructura EXACTA del JSON:
{
  "steps": [
    {
      "title": "título del paso",
      "description": "qué hacer y por qué, con profundidad técnica",
      "estimatedHours": 20,
      "priority": "high",
      "resources": ["tema o recurso 1", "tema o recurso 2"]
    }
  ],
  "summary": "resumen breve del plan"
}

REGLAS:
- Genera EXACTAMENTE 4 pasos concretos, ordenados por impacto.
- "priority": uno de low, medium, high o critical.
- "estimatedHours": número (horas estimadas).
- Enfócate en profundidad técnica real para alcanzar el rol de ${input.targetRole}.

Responde solo con el JSON.`;

    const { data: parsed, provider } = await generateJsonWithFallback(prompt, LenientRoadmap);
    console.log(`[generateRoadmapFlow] Generado con proveedor: ${provider}`);

    const steps = parsed.steps.map((s) => ({
      title: s.title,
      description: s.description,
      estimatedHours: s.estimatedHours,
      priority: normalizePriority(s.priority),
      resources: s.resources ?? [],
    }));

    return { steps, summary: parsed.summary };
  }
);
