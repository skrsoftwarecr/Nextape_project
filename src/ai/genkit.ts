import { genkit } from 'genkit';
import groq from 'genkitx-groq';

/**
 * Proveedor de IA: **Groq** (modelos open-source tipo Llama), vía el plugin `genkitx-groq`.
 * Se eligió por coste (Groq es mucho más barato/gratuito que Gemini) manteniendo Genkit como
 * capa de orquestación. El modelo está centralizado aquí y se puede sobreescribir con `GROQ_MODEL`.
 * La API key va en `GROQ_API_KEY` (secreto de servidor). Ver docs/BACKEND_AI.md.
 */
export const GROQ_MODEL = process.env.GROQ_MODEL ?? 'groq/llama-3.3-70b-versatile';

export const ai = genkit({
  plugins: [groq({ apiKey: process.env.GROQ_API_KEY })],
  model: GROQ_MODEL,
});
