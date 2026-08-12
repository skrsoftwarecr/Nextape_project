import { config } from "dotenv";

/**
 * Carga `.env.local` (y `.env` como respaldo) **por efecto secundario al importar**.
 *
 * Debe importarse como PRIMERA línea de cualquier script de `scripts/`, antes que nada que toque
 * `@/ai/*` o `@/lib/server/*`.
 *
 * Por qué existe en vez de llamar a `config()` dentro de `main()`: los módulos ES se evalúan en el
 * orden de sus `import`, y varios módulos del proyecto leen `process.env` **en el momento de
 * importarse**, no al usarse. `src/ai/genkit.ts` es el caso crítico:
 *
 *     export const ai = genkit({ plugins: [groq({ apiKey: process.env.GROQ_API_KEY })] });
 *
 * Si `config()` se ejecuta dentro de `main()`, ese `groq(...)` ya se construyó con la clave a
 * `undefined` y todas las generaciones fallan, aunque `.env.local` tenga la clave correcta y el
 * script la vea al comprobarla después. Importando este módulo primero, las variables están
 * cargadas antes de que se evalúe ningún otro import.
 */
config({ path: ".env.local" });
config();
