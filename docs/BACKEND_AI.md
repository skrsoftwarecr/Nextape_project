# NEXTAPE — Backend, Servicios e IA (Genkit)

> Fuente de verdad: `src/ai/*`, `src/services/*`, `src/lib/firebase/*`.

## 1. Arquitectura de backend

NEXTAPE tiene una **capa de confianza en servidor** sobre Firebase:

1. **Route handlers** (`src/app/api/*`, runtime Node) con el **Firebase Admin SDK**
   (`src/lib/firebase/admin.ts`): todo lo sensible (scoring, corrección, escritura de DNA/intentos,
   generación de pruebas). El Admin SDK bypassa las reglas; por eso los datos "verificados" son
   `write:false` para el cliente.
2. **Flows de Genkit** (`'use server'` en `src/ai/flows/*`): generación con Groq (Llama), invocados desde los handlers.
3. **Firebase gestionado** (Auth + Firestore + Storage): el cliente **LEE** con el Web SDK (sujeto a reglas)
   y llama a la API con `apiPost` (`src/lib/api.ts`) adjuntando su Firebase ID token.

### Route handlers (server-trust)
| Endpoint | Qué hace |
|---|---|
| `POST /api/line/start` | Genera preguntas (o carga la clave de una vacante), crea `line_sessions` (server-only) y devuelve preguntas **sin `correctIndex`** (`PublicQuestion`). |
| `POST /api/line/submit` | Corrige contra la clave de la sesión, escribe el DNA (`user_skill_scores`, mejor score/skill) y el intento (`assessment_attempts`) con Admin SDK, borra la sesión. Si la sesión tiene `jobId` (postulación a una vacante), además escribe/actualiza `candidate_matches/{userId_jobId}` e incrementa `jobs.applicantsCount` la primera vez (best-effort). |
| `POST /api/jobs/assessment` | (Reclutador dueño) genera la prueba de una vacante: preguntas públicas sin clave en `jobs`, clave en `job_answer_keys` (server-only). |

Todos verifican el ID token con `verifyRequestUid` (Admin). Nunca confían en un `uid` del body.
`src/lib/server/assessment.ts` contiene la lógica pura (`gradeAnswers`, `stripAnswerKey`, `SPECIALTY_STACKS`).

## 2. Capa de IA — Genkit + Groq

### Configuración — `src/ai/genkit.ts`
```ts
import groq from 'genkitx-groq';
export const GROQ_MODEL = process.env.GROQ_MODEL ?? 'groq/llama-3.3-70b-versatile';
export const ai = genkit({
  plugins: [groq({ apiKey: process.env.GROQ_API_KEY })],
  model: GROQ_MODEL,
});
```
- Proveedor **Groq** (plugin de comunidad `genkitx-groq`). Modelo por defecto `llama-3.3-70b-versatile`,
  sobreescribible con `GROQ_MODEL`. Se eligió por **coste** (Groq es mucho más barato/gratuito que Gemini).
- API key en **`GROQ_API_KEY`** (secreto de servidor). En Netlify va como variable de entorno.
- **Generación de JSON:** en vez del structured output nativo (poco fiable con Llama), se usa el helper
  `src/ai/generate.ts` → `generateJson(prompt, zodSchema)`: llama al modelo, limpia fences de markdown,
  `JSON.parse` y **valida con Zod** (con un reintento). Los flows usan un esquema *lenient* para tolerar
  variaciones del modelo y luego normalizan a los tipos estrictos.

### Dev server — `src/ai/dev.ts`
- Scripts: `genkit:dev` / `genkit:watch` (`genkit start -- tsx src/ai/dev.ts`).
- ✅ `dev.ts` registra los flows (import por efecto secundario) para el Genkit Dev UI.

### Flow: `generateQuestions` — `src/ai/flows/generate-assessment-flow.ts`
- **Input** (`GenerateQuestionsInputSchema`): `{ stack: string[], level: string, count=5 }`.
- **Output**: `{ questions: Question[] }`, `Question = { id, briefing, text, options[4], correctIndex 0-3, difficulty(enum junior|mid|senior|master), tag }`.
- **Prompt**: "Arquitecto Senior de NEXTAPE"; genera desafíos de producción (no sintaxis): fugas de
  memoria, cuellos de botella, seguridad, deuda técnica. 4 opciones, una óptima.
- Usado por: `The LINE` (`src/app/dashboard/line/page.tsx` y `src/app/line/page.tsx`) y por
  `JobService.generateJobAssessment`.

### Flow: `generateRoadmap` — `src/ai/flows/generate-roadmap-flow.ts`
- **Input**: `{ currentSkills: {name, score}[], targetRole="Tech Lead", gaps: string[] }`.
- **Output**: `{ steps: RoadmapStep[], summary }`, `RoadmapStep = { title, description, estimatedHours, priority(low|medium|high|critical), resources[] }`.
- **Prompt**: genera 4 pasos concretos hacia el rol objetivo según skills actuales y gaps.
- Usado por: página Roadmap (ver FRONTEND).

### Patrón de un flow (a replicar para nuevos)
```ts
'use server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
// 1) Esquemas Zod de input y output (output SIEMPRE tipado → structured output)
// 2) ai.definePrompt({ name, input:{schema}, output:{schema}, prompt: `...handlebars...` })
// 3) ai.defineFlow({ name, inputSchema, outputSchema }, async (input) => (await prompt(input)).output!)
// 4) export async function wrapper(input): Promise<Output> { return flow(input); }
```
- Se usa Handlebars en el prompt (`{{var}}`, `{{#each arr}}{{this}}{{/each}}`).
- El wrapper `export async function` es lo que consumen los componentes cliente (como server action).
- ⚠️ `output!` asume salida no nula; si el modelo devuelve vacío hará throw. Considerar manejo de error.

## 3. Capa de servicios — `src/services/*`

Wrappers finos sobre los helpers de Firestore y los flows de IA. **Punto de entrada preferente** para
la lógica de datos desde componentes.

> Los servicios de cliente son de **lectura**. Las escrituras de datos verificados (DNA, intentos,
> claves) ocurren en los route handlers `/api/*` con Admin SDK (§1).

| Servicio | Métodos | Colección / IA |
|---|---|---|
| `UserService` | `getUser`, `saveUser` | `users` |
| `SkillsService` | `getSkills` (solo lectura) | `user_skill_scores` |
| `JobService` | `getLatestJobs`, `getJob`, `getJobsByRecruiter`, `calculateMatch` | `jobs` |
| `AssessmentService` | `getSession` (solo lectura) | `assessment_attempts` |
| `CompatibilityService` | `getMatchesForRecruiter` | `candidate_matches` (escritor: `/api/line/submit`) |

`calculateMatch` es una función pura en `src/lib/match.ts` (reexportada por `JobService`).

### Escritura del DNA — server-only
- El DNA (`user_skill_scores`) y los intentos (`assessment_attempts`) los escribe **`/api/line/submit`**
  con Admin SDK: score por skill (mejor resultado, `Math.max`), `Timestamp` de servidor. El cliente no
  tiene métodos de escritura (reglas `write:false`). Ver SECURITY.

### `JobService.calculateMatch(jobSkills, userScores)`
- Normaliza skills a minúsculas, suma scores del usuario para las skills requeridas presentes,
  divide entre `jobSkills.length` (penaliza faltantes), redondea. Devuelve 0 si falta input.

### `JobService.generateJobAssessment(jobId, stack, level)`
- Llama `generateQuestions` (server action) → `updateDoc(jobs/{jobId}, { assessmentQuestions, updatedAt })`.
- ✅ Ya permitido: las reglas dejan al reclutador dueño (`createdBy == uid`) actualizar su `jobs` (B1).
- Captura el error y devuelve `[]` (silencioso). El `console.error` es la única señal.

## 4. Frontera cliente/servidor (importante)

- `src/ai/flows/*` → `'use server'` → ejecutan en el servidor de Next (seguro para la API key de Groq).
- `src/services/*` y `src/lib/firebase/*` → **cliente** (`'use client'` o sin marca, importan el Web SDK).
- Un componente cliente puede `import { generateQuestions } from '@/ai/flows/...'` y llamarlo: Next lo
  serializa como server action. **No** importar el Web SDK de Firebase dentro de un archivo `'use server'`.

## 5. Reglas para nuevos flows / servicios

- Todo flow: `'use server'`, esquemas Zod de input **y** output, wrapper `export async function`.
- No mezclar Firebase Web SDK con `'use server'`. Si un flow necesita escribir en Firestore de forma
  confiable, hacerlo con **Admin SDK** en una Cloud Function / route handler, no con el Web SDK del cliente.
- Nombrar el flow y el prompt de forma única (`name:`), coincidiendo con el nombre de archivo.
- Registrar el flow en `src/ai/dev.ts` (import por efecto secundario) para poder probarlo en Genkit Dev UI.
- Validar y manejar `output` nulo del modelo; no asumir `output!` en producción.
