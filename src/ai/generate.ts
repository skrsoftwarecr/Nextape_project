import { z } from 'zod';
import { ai, GROQ_MODEL } from './genkit';
import { aiBackup, NVIDIA_MODEL } from './genkit-nvidia';

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

    try {
      const cleaned = extractJson(response.text);
      return schema.parse(JSON.parse(cleaned));
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('La IA devolvió un JSON que no cumple el esquema esperado.');
}

/* ─────────────────── Fallback: Groq → NVIDIA NIM ─────────────────── */

/**
 * Detecta si un error es un rate limit (HTTP 429 o mensaje con "rate limit" / "RateLimitError").
 * Se usa para decidir si reintentar con el proveedor de backup.
 */
export function isRateLimitError(err: unknown): boolean {
  if (!(err instanceof Error)) {
    if (typeof err === 'object' && err !== null) {
      const status = (err as Record<string, unknown>).status ?? (err as Record<string, unknown>).statusCode;
      if (status === 429) return true;
    }
    return false;
  }
  const msg = err.message.toLowerCase();
  if (
    msg.includes('rate limit') ||
    msg.includes('ratelimiterror') ||
    msg.includes('429') ||
    msg.includes('too many requests') ||
    msg.includes('quota') ||
    msg.includes('tokens per') ||
    msg.includes('requests per') ||
    msg.includes('exceeded')
  ) {
    return true;
  }
  const status = (err as unknown as { status?: number; statusCode?: number }).status ??
    (err as unknown as { status?: number; statusCode?: number }).statusCode;
  if (status === 429) return true;
  const code = (err as unknown as { code?: number | string }).code;
  if (code === 429 || code === '429') return true;
  return false;
}

let isGroqRateLimited = false;

/**
 * Genera JSON con Groq (primario) y, si falla con rate limit, reintenta con NVIDIA NIM (backup).
 *
 * Una vez detectado el rate limit en la corrida actual, las llamadas subsiguientes
 * cambian automáticamente a NVIDIA NIM sin perder tiempo re-intentando Groq.
 *
 * Devuelve `{ data, provider }` para que el llamador pueda loguear qué proveedor se usó.
 */
export async function generateJsonWithFallback<T>(
  prompt: string,
  schema: z.ZodType<T>,
): Promise<{ data: T; provider: 'groq' | 'nvidia' }> {
  if (isGroqRateLimited) {
    const data = await generateJsonNvidia(prompt, schema);
    return { data, provider: 'nvidia' };
  }

  try {
    const data = await generateJson(prompt, schema);
    return { data, provider: 'groq' };
  } catch (err) {
    if (!isRateLimitError(err)) throw err;

    isGroqRateLimited = true;
    console.warn(
      '[ai/generate] ⚠️ Groq rate limit alcanzado — cambiando permanentemente a NVIDIA NIM para esta sesión...',
    );

    const data = await generateJsonNvidia(prompt, schema);
    return { data, provider: 'nvidia' };
  }
}

/**
 * Extrae el primer bloque JSON `{…}` de una respuesta de texto libre.
 *
 * NVIDIA NIM (Llama) suele acompañar el JSON con texto narrativo:
 *   - "Here is the JSON:\n```json\n{…}\n```\nI hope this helps!"
 *   - Trailing commas, comentarios de línea (`//`), etc.
 *
 * La estrategia es:
 *   1. Quitar fences de markdown y texto fuera de `{…}`.
 *   2. Eliminar trailing commas antes de `}` o `]`.
 *   3. Eliminar comentarios de línea (`// …`).
 */
function extractJson(raw: string): string {
  // 1. Si hay un bloque ```json … ```, extraerlo.
  const fenceMatch = raw.match(/```(?:json)?\s*\n?([\s\S]*?)```/i);
  const body = fenceMatch ? fenceMatch[1] : raw;

  // 2. Localizar el primer '{' y el último '}' (el objeto raíz).
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No se encontró un objeto JSON en la respuesta de NVIDIA NIM.');
  }

  let json = body.slice(start, end + 1);

  // 3. Quitar comentarios de bloque (/* … */) y de línea (// …).
  json = json.replace(/\/\*[\s\S]*?\*\//g, '');
  json = json.replace(/^\s*\/\/.*$/gm, '');

  // 4. Quitar trailing commas: `,` seguida de `}` o `]` (con espacios/saltos de línea opcionales).
  json = json.replace(/,\s*([}\]])/g, '$1');

  return json.trim();
}

/**
 * Genera JSON con NVIDIA NIM (backup). Versión robusta que tolera texto
 * narrativo, fences, trailing commas y comentarios que el modelo añade.
 */
async function generateJsonNvidia<T>(prompt: string, schema: z.ZodType<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (attempt > 0) {
        console.warn(`[ai/generate] ⏳ Pausa de reintento (${attempt}/2) para NVIDIA NIM...`);
        await new Promise((r) => setTimeout(r, 3000));
      }

      const response = await aiBackup().generate({
        model: `nvidia/${NVIDIA_MODEL}`,
        prompt,
      });
      const text = response.text;

      if (!text) {
        throw new Error('El modelo NVIDIA NIM no devolvió texto.');
      }

      const cleaned = extractJson(text);
      return schema.parse(JSON.parse(cleaned));
    } catch (err) {
      console.warn(
        `[ai/generate] ⚠️ Intento ${attempt + 1} con NVIDIA NIM falló:`,
        err instanceof Error ? err.message : err,
      );
      lastError = err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('NVIDIA NIM (backup) devolvió un error o JSON no válido tras 3 intentos.');
}
