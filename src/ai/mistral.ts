import { genkit, type Genkit } from 'genkit';
import { openAICompatible } from '@genkit-ai/compat-oai';

/**
 * Cliente centralizado para **Mistral AI**, utilizando el plugin oficial `@genkit-ai/compat-oai`
 * apuntando a la API OpenAI-compatible de Mistral (https://api.mistral.ai/v1).
 *
 * Modelo por defecto: `mistral-small-latest`, sobreescribible con `MISTRAL_MODEL`.
 * API Key: `process.env.MISTRAL_API_KEY` (secreto de servidor).
 *
 * Inicialización perezosa para evitar fallos durante el build o en entornos sin la API key configurada.
 */
export const MISTRAL_MODEL = process.env.MISTRAL_MODEL ?? 'mistral-small-latest';

let _aiMistral: Genkit | undefined;

/**
 * Devuelve la instancia de Genkit configurada con Mistral AI.
 * Lanza un error descriptivo si MISTRAL_API_KEY no está definida al invocarla.
 */
export function aiMistral(): Genkit {
  if (_aiMistral) return _aiMistral;

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Falta MISTRAL_API_KEY. Defínela en .env.local o en las variables de entorno del servidor.',
    );
  }

  const model = process.env.MISTRAL_MODEL ?? 'mistral-small-latest';

  _aiMistral = genkit({
    plugins: [
      openAICompatible({
        name: 'mistral',
        apiKey,
        baseURL: 'https://api.mistral.ai/v1',
        timeout: 60000,
      }),
    ],
    model: `mistral/${model}`,
  });

  return _aiMistral;
}
