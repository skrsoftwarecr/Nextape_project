import { genkit, type Genkit } from 'genkit';
import { openAICompatible } from '@genkit-ai/compat-oai';

/**
 * Proveedor de IA de **respaldo**: **NVIDIA NIM** (modelo `meta/llama-3.3-70b-instruct`), vía el plugin oficial
 * `@genkit-ai/compat-oai` apuntando a la API OpenAI-compatible de NVIDIA NIM.
 *
 * Se usa SOLO cuando Groq (proveedor primario) devuelve un error de rate limit (429).
 * No se mezcla con el proveedor primario en la misma llamada — es fallback secuencial.
 *
 * La inicialización es **perezosa** para que `process.env.NVIDIA_API_KEY` se lea en el momento
 * de la primera llamada, no al importar el módulo.
 *
 * La API key va en `NVIDIA_API_KEY` (secreto de servidor). Ver docs/BACKEND_AI.md.
 */
export const NVIDIA_MODEL = process.env.NVIDIA_MODEL ?? 'meta/llama-3.1-8b-instruct';

let _aiBackup: Genkit | undefined;

/**
 * Devuelve la instancia de Genkit configurada con NVIDIA NIM. Se inicializa una sola vez.
 * Lanza un error claro si `NVIDIA_API_KEY` no está definida.
 */
export function aiBackup(): Genkit {
  if (_aiBackup) return _aiBackup;

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Falta NVIDIA_API_KEY. Defínela en .env.local o en las variables de entorno del servidor.',
    );
  }

  const model = process.env.NVIDIA_MODEL ?? 'meta/llama-3.1-8b-instruct';

  _aiBackup = genkit({
    plugins: [
      openAICompatible({
        name: 'nvidia',
        apiKey,
        baseURL: 'https://integrate.api.nvidia.com/v1',
        timeout: 60000,
      }),
    ],
    model: `nvidia/${model}`,
  });

  return _aiBackup;
}
