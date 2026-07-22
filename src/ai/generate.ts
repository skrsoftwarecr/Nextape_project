import { z } from 'zod';
import { ai, GROQ_MODEL } from './genkit';

/**
 * Genera contenido con el modelo (Groq) y devuelve un objeto JSON **validado con Zod**.
 *
 * Los modelos tipo Llama a veces envuelven el JSON en fences de markdown o añaden texto;
 * por eso se limpia la respuesta y se valida el esquema, con un reintento ante JSON inválido.
 * (Este patrón es más robusto con Groq que el structured output nativo de Genkit.)
 */
export async function generateJson<T>(prompt: string, schema: z.ZodType<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await ai.generate({ model: GROQ_MODEL, prompt });
    const cleaned = response.text
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    try {
      return schema.parse(JSON.parse(cleaned));
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('La IA devolvió un JSON que no cumple el esquema esperado.');
}
