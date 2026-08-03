'use server';

/**
 * @fileOverview Flow de Interpretación Humana con Mistral AI.
 *
 * REGLA DE ORO DE ARQUITECTURA: La IA NUNCA recibe código fuente ni AST.
 * Solo interpreta métricas numéricas ya calculadas por el motor determinístico (Capa 2).
 * Presupuesto de output: menos de 1000 tokens.
 */

import { z } from 'zod';
import { aiMistral, MISTRAL_MODEL } from '@/ai/mistral';

export const GenerateGithubFeedbackInputSchema = z.object({
  architecture: z.number().nullable(),
  testing: z.number(),
  security: z.number().nullable(),
  maintainability: z.number().nullable(),
  documentation: z.number(),
  overall: z.number(),
  topWeaknesses: z.array(z.string()),
});

export const GenerateGithubFeedbackOutputSchema = z.object({
  feedback: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
});

export type GenerateGithubFeedbackInput = z.infer<typeof GenerateGithubFeedbackInputSchema>;
export type GenerateGithubFeedbackOutput = z.infer<typeof GenerateGithubFeedbackOutputSchema>;

export async function generateGithubFeedback(
  input: GenerateGithubFeedbackInput,
): Promise<GenerateGithubFeedbackOutput> {
  const prompt = `Eres un Senior Tech Lead evaluador en NEXTAPE.
Interpreta las siguientes métricas técnicas numéricas ya evaluadas para un desarrollador (NO recibes ni analizas código fuente).

PUNTUACIONES TÉCNICAS (0 a 100):
- Arquitectura: ${input.architecture !== null ? `${input.architecture}/100` : 'No analizable (lenguaje no soportado por el parser actual)'}
- Testing y CI: ${input.testing}/100
- Seguridad / Patrones: ${input.security !== null ? `${input.security}/100` : 'No analizable'}
- Mantenibilidad: ${input.maintainability !== null ? `${input.maintainability}/100` : 'No analizable'}
- Documentación: ${input.documentation}/100
- Puntuación Global: ${input.overall}/100

PRINCIPALES DEBILIDADES DETECTADAS:
${input.topWeaknesses.map((w) => `- ${w}`).join('\n')}

INSTRUCCIONES DE RESPUESTA:
Genera un análisis técnico breve y constructivo en idioma español.
Responde ÚNICAMENTE con un objeto JSON válido con este formato exacto:

{
  "feedback": "2 a 3 líneas de resumen constructivo del perfil técnico basándote exclusivamente en estas métricas.",
  "strengths": ["Punto fuerte 1", "Punto fuerte 2"],
  "improvements": ["Área clave de mejora 1", "Área clave de mejora 2"]
}

REGLAS STRICTAS:
- Máximo 300 palabras (menos de 1000 tokens).
- Sé conciso, profesional y basado únicamente en los datos provistos.
- Sin fences de markdown extra si es posible, responde solo con el JSON.`;

  try {
    const mistral = aiMistral();
    const response = await mistral.generate({
      model: `mistral/${MISTRAL_MODEL}`,
      prompt,
    });

    const text = response.text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return GenerateGithubFeedbackOutputSchema.parse(parsed);
    }

    throw new Error('No se pudo extraer JSON de la respuesta de Mistral.');
  } catch (err) {
    console.warn('[generateGithubFeedback] Fallo al invocar Mistral AI:', err);
    // Fallback humano determinístico en caso de error de red o API key faltante
    return {
      feedback: `Evaluación de ingeniería completada con un score global de ${input.overall}/100. Destacan áreas de oportunidad en testing e infraestructura de arquitectura.`,
      strengths: input.overall > 70 ? ['Buena estructura general de código'] : ['Base de código funcional'],
      improvements: input.topWeaknesses.slice(0, 2),
    };
  }
}
