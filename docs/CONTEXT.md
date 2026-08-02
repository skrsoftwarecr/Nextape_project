# NEXTAPE — Contexto del sistema (rama `thelineRAG`)

> **Qué es este archivo.** Análisis del sistema hecho leyendo el código de la rama `thelineRAG`, con el
> estado **verificado ejecutando** el proyecto (no inferido de la documentación). Es el contexto de
> arranque para trabajar con agentes: qué existe, cómo fluye, qué está roto y dónde encaja el trabajo nuevo.
>
> **Complementa, no reemplaza:** [`/CLAUDE.md`](../CLAUDE.md) son las reglas vinculantes;
> [`docs/README.md`](./README.md) indexa la documentación por área. Este archivo es el **mapa + el estado real**.
> El arnés de trabajo está en [`HARNESS.md`](./HARNESS.md).
>
> Snapshot: rama `thelineRAG` @ `aa9e91a` · analizado el 2026-08-01.

---

## 0. Lo primero que hay que saber

**`thelineRAG` es hoy byte-idéntica a `fix/system-hardening`.** Mismo HEAD (`aa9e91a`), mismos 12 commits,
`git diff` vacío entre ambas. **No hay una sola línea de RAG en el repositorio**: cero embeddings, cero
retrieval, cero vector store, cero corpus. Búsqueda de `rag|embedding|vector|retriev|index` en `src/` y
`docs/` → 0 resultados reales.

Es decir: la rama es un **punto de partida limpio con el nombre del objetivo**, no un trabajo a medias.
Todo el trabajo de RAG está por hacer, y eso es una ventaja — se diseña desde cero sobre una base sana.

**Segundo dato relevante:** `main` y `thelineRAG` **no comparten historia** (`git merge-base` → *no merge
base*). El commit `d74ee15` ("CORE: Full system migration to Next.js 15 + Genkit") de la rama `migration`
es un commit huérfano que reemplazó el árbol completo. `main` (75 commits) es el sistema **viejo**; la línea
viva es `migration → fix/system-hardening → thelineRAG` (12 commits). Un `merge` a `main` no será trivial:
requiere decisión de equipo (probablemente `main` se reescribe, no se mergea).

---

## 1. El producto

Plataforma de **evaluación técnica con IA** que construye el *"DNA técnico verificado"* de un developer.
Dos roles, `developer` y `recruiter`, con navegación distinta sobre el mismo dashboard.

| Módulo | Qué hace | Dónde vive |
|---|---|---|
| **The LINE** | Simulación técnica generada por IA (5 preguntas de opción múltiple sobre escenarios de producción). Es el **motor de todo**: sin LINE no hay DNA. | [`dashboard/line/`](../src/app/dashboard/line/page.tsx) + [`api/line/*`](../src/app/api/line/) |
| **CORE** | La identidad técnica persistida: un score 0–100 por skill. | [`dashboard/core/`](../src/app/dashboard/core/page.tsx) → `user_skill_scores` |
| **Roadmap** | Plan de mejora generado por IA a partir de los gaps del CORE. | [`dashboard/roadmap/`](../src/app/dashboard/roadmap/page.tsx) |
| **Jobs / Compatibility** | Match entre `job.requiredSkills` y el DNA. | [`dashboard/jobs/`](../src/app/dashboard/jobs/page.tsx), [`match.ts`](../src/lib/match.ts) |
| **Vacancies / Candidates** | Lado reclutador: publicar vacante, generar su prueba, ver el ranking de candidatos. | [`dashboard/vacancies/`](../src/app/dashboard/vacancies/page.tsx), [`dashboard/candidates/`](../src/app/dashboard/candidates/page.tsx) |

**La tesis del producto es la integridad.** Se vende un DNA *verificado*; si el score fuese falsificable el
producto no vale nada. Toda la arquitectura de la rama gira alrededor de eso.

---

## 2. Arquitectura

### 2.1 La frontera de confianza (lo esencial)

Monolito modular sobre Firebase **+ una capa de confianza en servidor**. La regla que ordena todo el sistema:

> **El cliente LEE. El servidor ESCRIBE todo lo que vale.**

```
┌──────────────────────── Browser ('use client') ────────────────────────┐
│  app/dashboard/*  →  services/*  →  lib/firebase/client.ts (Web SDK)   │
│                   →  lib/api.ts  ── apiPost(+ Firebase ID token) ──┐   │
└────────────┬───────────────────────────────────────────────────────┼───┘
             │ read  (sujeto a firestore.rules)                       │ POST /api/*
             ▼                                                        ▼
      Firebase Auth + Firestore  ◄──────────  Route handlers (runtime nodejs)
             ▲                                 lib/firebase/admin.ts (Admin SDK)
             │  escrituras de confianza         └── ai/flows/* (Genkit) ──► Groq
             └──── DNA · intentos · claves ────────────┘                  llama-3.3-70b
```

- **Admin SDK bypassa las reglas** → por eso el DNA es `write:false` para el cliente y su integridad no
  depende del navegador.
- **`correctIndex` nunca sale al cliente.** El tipo público es
  [`PublicQuestion = Omit<Question,"correctIndex">`](../src/types/job.types.ts#L17) y
  [`stripAnswerKey()`](../src/lib/server/assessment.ts#L16) lo garantiza en el borde.
- **`AuthGuard` es solo UX**, no seguridad. La autoridad real son las reglas + `verifyRequestUid`.

### 2.2 Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js **15.5.22** (App Router, RSC) · React **19.2** |
| Lenguaje | TypeScript 5 `strict` · alias `@/* → src/*` |
| UI | Tailwind 3 + shadcn/ui (34 componentes en `components/ui/`) · lucide-react · recharts |
| Auth/DB/Storage | Firebase Web SDK 11 (cliente) + firebase-admin 13 (servidor) |
| IA | Genkit **1.28** + **`genkitx-groq`** → `groq/llama-3.3-70b-versatile` |
| Validación | Zod 3 · react-hook-form |
| Tests | Vitest 2 (`environment: node`, solo `src/**/*.test.ts`) |
| Hosting | **ambiguo — ver §6.2** |

### 2.3 Tamaño real del código

| Área | Líneas | Archivos | Nota |
|---|---:|---:|---|
| `src/components/ui` | 3 655 | 34 | shadcn generado — **no es código propio**, no lo revises |
| `src/app` | 2 263 | 17 | 12 páginas + 3 route handlers |
| `src/lib` | 494 | 14 | incluye los 4 archivos de test |
| `src/ai` | 293 | 5 | **toda la capa de IA cabe aquí** |
| `src/hooks` | 242 | 3 | |
| `src/types` | 112 | 5 | tipos canónicos `*.types.ts` |
| `src/services` | 75 | 5 | wrappers finísimos de lectura |

**El código propio no llega a 3 500 líneas.** Cabe entero en contexto. Esto es importante para el arnés:
no hace falta RAG sobre el propio repo, hace falta disciplina de lectura dirigida.

---

## 3. Flujos críticos (trazados sobre el código real)

### 3.1 The LINE — el flujo que sostiene el producto

```
[cliente] dashboard/line/page.tsx
   │ apiPost("/api/line/start", { jobId } | { specialty, level })
   ▼
[servidor] api/line/start/route.ts                             ← runtime "nodejs"
   1. verifyRequestUid(Authorization: Bearer)          → 401 si falla
   2. ¿jobId?  SÍ → lee job_answer_keys/{jobId}  (server-only)
      │             └─ si no existe → generateQuestions(job.requiredSkills, job.level)   ⚠️ ver §6.4
      └─ NO → generateQuestions(SPECIALTY_STACKS[specialty], level)  → Groq
   3. crea line_sessions/{id} = { userId, jobId, questions CON correctIndex, createdAt }
   4. responde { sessionId, questions: stripAnswerKey(...) }        ← SIN la clave
   ▼
[cliente] el usuario responde; se acumulan índices en answers[]
   │ apiPost("/api/line/submit", { sessionId, answers })
   ▼
[servidor] api/line/submit/route.ts
   1. verifyRequestUid → 401
   2. lee line_sessions/{sessionId}; valida session.userId === uid → 403
   3. gradeAnswers(questions, answers)  → { skillScores por tag, overall }
   4. user_skill_scores/{uid}: merge quedándose con Math.max por skill    ⚠️ sin transacción, §6.5
   5. assessment_attempts/{uid}_{sessionId}: historial del intento
   6. si session.jobId → candidate_matches/{uid}_{jobId} + jobs.applicantsCount++   (best-effort)
   7. borra la sesión (un solo uso)
   8. responde { overall, skillScores }
```

**Invariantes que este flujo garantiza y que ningún cambio puede romper:**
1. La clave de respuestas nunca cruza la red hacia el cliente.
2. El score lo calcula el servidor contra una clave que el cliente no vio.
3. El DNA solo se escribe con Admin SDK, y solo **sube** (`Math.max`) — un reintento peor no castiga.
4. La sesión es de un solo uso.

### 3.2 Generación de la prueba de una vacante

```
[reclutador] apiPost("/api/jobs/assessment", { jobId })
   → valida job.createdBy === uid  → 403
   → generateQuestions(job.requiredSkills, job.level)
   → job_answer_keys/{jobId} = { questions CON clave }     ← server-only, read/write: false
   → jobs/{jobId}.assessmentQuestions = stripAnswerKey(...) ← público, sin clave
```

### 3.3 La capa de IA completa

Son 293 líneas. Todo pasa por [`generateJson()`](../src/ai/generate.ts):

```ts
ai.generate({ model, prompt })  →  limpia fences ```json  →  JSON.parse  →  schema.parse (Zod)
                                   └─ 2 intentos; si ambos fallan, throw
```

Y cada flow usa el patrón **lenient → normalize → strict**: un esquema Zod tolerante para lo que devuelve
Llama (difficulty como `string` libre, `resources` opcional, `correctIndex` con `z.coerce`), y luego
funciones de normalización hacia el tipo canónico. Es una decisión deliberada y buena: el structured output
nativo de Genkit es poco fiable con Llama.

| Flow | Input | Output | Detalle no obvio |
|---|---|---|---|
| [`generateQuestions`](../src/ai/flows/generate-assessment-flow.ts) | `{ stack[], level, count=5 }` | `{ questions: Question[] }` | [`normalizeTag()`](../src/ai/flows/generate-assessment-flow.ts#L65) fuerza el `tag` de la IA al vocabulario exacto del `stack`. **Sin esto el match se rompe**: un tag `"react hooks"` no casaría con `"react"` y el usuario no recibiría crédito. |
| [`generateRoadmap`](../src/ai/flows/generate-roadmap-flow.ts) | `{ currentSkills[], targetRole, gaps[] }` | `{ steps[], summary }` | Se invoca como **server action directa** desde la página, no vía route handler — inconsistente con The LINE. |

---

## 4. Modelo de datos y su matriz de seguridad

Firestore, proyecto `studio-4462619429-470d8`.

| Colección | Doc ID | Cliente lee | Cliente escribe | Escritor real |
|---|---|---|---|---|
| `users` | `{uid}` | owner | **owner** | `UserService.saveUser` (cliente) |
| `user_skill_scores` | `{uid}` | owner | ❌ `false` | `/api/line/submit` (Admin) |
| `assessment_attempts` | `{uid}_{sessionId}` | owner (query filtrada) | ❌ `false` | `/api/line/submit` (Admin) |
| `line_sessions` | auto | ❌ `false` | ❌ `false` | `/api/line/start` (Admin) |
| `job_answer_keys` | `{jobId}` | ❌ `false` | ❌ `false` | `/api/jobs/assessment` (Admin) |
| `jobs` | auto | **público** (`read: true`) | owner `createdBy` (no delete) | cliente + `/api/*` |
| `candidate_matches` | `{uid}_{jobId}` | candidato **o** reclutador | ❌ `false` | `/api/line/submit` (Admin) |
| `user_roadmaps` | `{uid}` | owner | owner | cliente |
| `questions` | — | auth | ❌ `false` | **nadie — regla huérfana, §6.7** |

Las dos colecciones `false/false` (`line_sessions`, `job_answer_keys`) son **el corazón de la integridad**:
contienen `correctIndex`. Si alguna vez alguien las abre a lectura, el producto muere.

**Invariante transversal:** las skills se guardan y comparan **siempre en minúsculas**. Se rompe en tres
sitios distintos si se olvida: `normalizeTag`, `gradeAnswers`, `calculateMatch`.

---

## 5. Estado verificado (ejecutado, no leído)

Ejecutado sobre `thelineRAG @ aa9e91a` con `npm ci` limpio, Node 22:

| Gate | Al clonar (`aa9e91a`) | Tras los arreglos del 2026-08-01 |
|---|---|---|
| `npm run typecheck` | ✅ limpio | ✅ limpio |
| `npm test` | ✅ 14 pasan, 5 skipped | ✅ **20 pasan**, 5 skipped |
| `npm run build` | ✅ OK — 19 páginas, 3 route handlers `ƒ`, 102 kB First Load | ✅ OK |
| `npm run lint` | ❌ **CRASHEA — OOM de V8** (§6.1) | ✅ 0 errores, **14 warnings** |

Cobertura de tests: 4 archivos, y cubren exactamente lo que importa — `gradeAnswers`/`stripAnswerKey`/
`isValidAnswerSet` (11), `calculateMatch` (4), `grading` (5) y las reglas (5, dormidos). **Cero tests de
los route handlers, de los flows de IA y de la UI.**

---

## 6. Hallazgos

Todo lo de esta sección lo verifiqué contra el código. Lo marcado 🆕 **no está** en
[`TECH_DEBT.md`](./TECH_DEBT.md).

### 6.1 ✅🆕 `npm run lint` revienta — y con él, CI · *resuelto 2026-08-01*

`eslint .` agota el heap de V8 y aborta con stack dump. Causa: se está linteando
**`.open-next/` — 17 MB y 103 archivos de bundle de Cloudflare Workers commiteados al repo**.

- [`.gitignore`](../.gitignore) no ignora `.open-next/` ni `.wrangler/` → los artefactos entraron a git.
- [`eslint.config.mjs:29`](../eslint.config.mjs#L29) ignora `.next/**` y `node_modules/**`, pero **no** `.open-next/**`.

Impacto real: [`ci.yml`](../.github/workflows/ci.yml) corre `npm run lint` en **todo PR**. Cualquier PR
desde esta rama falla CI por una razón que no tiene nada que ver con el cambio. Es el primer arreglo.

**Resuelto:** `.open-next/` y `.wrangler/` añadidos a `.gitignore` y al array `ignores` de
[`eslint.config.mjs`](../eslint.config.mjs); 106 archivos destrackeados con `git rm -r --cached`.
`npm run lint` ahora termina con 0 errores.

### 6.2 🔴🆕 Cuatro configuraciones de hosting coexistiendo

El repo declara simultáneamente:

| Archivo | Destino |
|---|---|
| [`netlify.toml`](../netlify.toml) | Netlify + `@netlify/plugin-nextjs` |
| [`wrangler.jsonc`](../wrangler.jsonc) + [`open-next.config.ts`](../open-next.config.ts) | **Cloudflare Workers** |
| [`apphosting.yaml`](../apphosting.yaml) | Firebase App Hosting |
| [`firebase.json`](../firebase.json) `hosting` | Firebase Hosting |

Los **3 commits más recientes** de la rama son todos de Cloudflare (`fix(cloudflare)`, `exclude jose and
opentelemetry from edge bundle`). Pero [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md) y
[`CLAUDE.md`](../CLAUDE.md) siguen diciendo **Netlify**, y dicen explícitamente que `apphosting.yaml` y
`firebase.json:hosting` son "config muerta".

Riesgo concreto: los tres route handlers declaran `export const runtime = "nodejs"` porque el Admin SDK lo
exige. En Cloudflare Workers eso se traduce vía `nodejs_compat`, y el propio `open-next.config.ts` ya tiene
que excluir `jose` y OpenTelemetry a mano del bundle edge. **Nadie ha verificado end-to-end que
`firebase-admin` funcione en Workers.** Antes de invertir en features hay que cerrar esta decisión.

### 6.3 🔴 El deploy no funciona sin secretos (heredado, sigue abierto)

`GROQ_API_KEY` y `FIREBASE_SERVICE_ACCOUNT` no están configuradas en el hosting. Sin ellas **The LINE, el
roadmap y la generación de pruebas fallan en producción** — es todo el producto. Ver
[`HANDOFF.md §3`](../HANDOFF.md) y [`DEPLOYMENT.md`](./DEPLOYMENT.md).

### 6.4 ✅🆕 Preguntas inconsistentes entre candidatos de la misma vacante · *resuelto 2026-08-01*

En [`api/line/start/route.ts:33-47`](../src/app/api/line/start/route.ts#L33-L47): si llega un `jobId` y
**no existe** `job_answer_keys/{jobId}`, se generan preguntas nuevas al vuelo… **y no se persisten**.

Consecuencias: (a) cada candidato de esa vacante responde un examen **distinto**, y el ranking de
`candidate_matches` deja de ser comparable — que es justo el valor que se le vende al reclutador;
(b) una llamada a Groq extra por candidato; (c) tampoco se valida que el `jobId` exista.

**Resuelto:** las preguntas generadas se persisten en `job_answer_keys` dentro de una transacción (que
resuelve la carrera entre dos candidatos que empiezan a la vez), el doc público `jobs` recibe la versión
sin clave, y un `jobId` inexistente devuelve 404 en vez de caer al stack por defecto.

### 6.5 ✅🆕 Escritura del DNA sin transacción (lost update) · *resuelto 2026-08-01*

`api/line/submit/route.ts` hacía *read → merge → write* sobre `user_skill_scores/{uid}` sin
`runTransaction`. Dos simulaciones concurrentes del mismo usuario (dos pestañas) podían perder una de las
dos actualizaciones. **No había una sola transacción ni batch en todo el repo.**

**Resuelto:** el merge del DNA va en `runTransaction`. Y el mismo patrón en `candidate_matches` —
`bestScore` y el incremento de `jobs.applicantsCount` ahora son atómicos entre sí, así que el contador no
puede desincronizarse del número real de candidatos.

Sigue abierto (menor): las 4 escrituras de `submit` no son atómicas *entre ellas*, así que un fallo a
medias puede dejar DNA escrito e intento no. Requiere rediseño, no un parche.

### 6.6 🟠🆕 Sin rate limiting en endpoints que llaman al LLM

`grep rateLimit|throttle src` → 0. Cada `POST /api/line/start` es una generación con Groq. Un usuario
autenticado puede llamarlo en bucle y quemar la cuota o la factura. Autenticación ≠ límite de uso.

### 6.7 🟡🆕 Otros

- **Regla huérfana:** `questions/{qId}` tiene regla en [`firestore.rules:67`](../firestore.rules#L67) y
  **cero uso en el código**.
- ✅ **`gradeAnswers` no validaba longitud** — *resuelto 2026-08-01*: nueva
  [`isValidAnswerSet()`](../src/lib/server/assessment.ts) (pura, 6 tests) verifica correspondencia 1:1 y
  rango de índices; `submit` devuelve **400 `invalid_answers`** en vez de puntuar en silencio.
- **Config de Firebase hardcodeada como fallback** ([`client.ts:14-19`](../src/lib/firebase/client.ts#L14-L19)):
  no es secreto (la config web es pública), pero un deploy sin env vars apunta **al proyecto de producción**
  sin avisar.
- ✅ **CI no cubría esta rama en push** — *resuelto 2026-08-01*: `thelineRAG` añadida a
  [`ci.yml`](../.github/workflows/ci.yml).
- **`role` autoasignado:** cualquiera puede registrarse como `recruiter` (documentado en
  [`SECURITY.md`](./SECURITY.md), sin resolver).
- **Telemetría falsa en la UI:** "Latencia 12ms / Cifrado" hardcodeado en
  [`line/page.tsx:226-234`](../src/app/dashboard/line/page.tsx#L226-L234).

### 6.8 Documentación desincronizada (arreglar al tocar cada área)

| Documento | Dice | Realidad |
|---|---|---|
| [`README.md`](../README.md) | "Genkit + Gemini 1.5 Flash" | Es **Groq / Llama 3.3 70b** |
| [`DATABASE.md`](./DATABASE.md) §1 | "No hay Admin SDK ni backend con service account" | Existe y es el núcleo de la integridad |
| [`DATABASE.md`](./DATABASE.md) §1 | `.firebaserc` → `nextape-prod` | Ya es `studio-4462619429-470d8` (**B3 resuelto en código, no en doc**) |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) §2 | three.js + `@react-three/*` + `laptop.glb` | Eliminado en el saneamiento |
| [`BACKEND_AI.md`](./BACKEND_AI.md) §2 | patrón `ai.definePrompt` + Handlebars | El código usa `generateJson` + prompt en template literal |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Netlify; App Hosting es "config muerta" | Los últimos commits van a **Cloudflare** |

---

## 7. Dónde encaja el RAG

El nombre de la rama fija el objetivo: **traer retrieval a The LINE**. El punto de inserción es único y
está bien aislado — [`generateQuestions()`](../src/ai/flows/generate-assessment-flow.ts), llamado desde
exactamente dos sitios (`api/line/start`, `api/jobs/assessment`).

```
   HOY:  stack + level ────────────────────────► prompt ──► Groq ──► preguntas
  CON RAG:  stack + level ──► retrieve(corpus) ──► prompt + contexto ──► Groq ──► preguntas
                                    ▲
                            ¿qué corpus? ← LA decisión que falta
```

**El problema que el RAG debería resolver** (y que conviene tener explícito antes de escribir código): hoy
las preguntas salen del conocimiento paramétrico de Llama 3.3. Eso produce escenarios genéricos, **no
auditables** (nadie puede justificar por qué una opción es la correcta) y potencialmente alucinados —
lo cual es una contradicción directa con vender evaluación *verificada*.

**Restricciones que el diseño hereda y no puede violar:**

1. La recuperación ocurre **en servidor**. El corpus y el índice nunca se exponen al cliente — si un
   candidato puede leer la fuente de la pregunta, puede deducir la respuesta.
2. `correctIndex` sigue sin salir del servidor. RAG no cambia el contrato `PublicQuestion`.
3. Toda colección nueva (`rag_documents`, `rag_chunks`, lo que sea) necesita su regla en
   `firestore.rules` **en el mismo cambio**, y será `read, write: if false`.
4. Groq **no ofrece endpoint de embeddings**, así que la inferencia del modelo es una pieza aparte.
   ✅ El equipo ya eligió **BGE-M3** (2026-08-01) — 1024 dims, 8 192 tokens de contexto, multilingüe.
   Con ~568M parámetros **no cabe en un cold start serverless**: sigue abierto dónde corre y en qué
   vector store vive el índice. Ver [`HARNESS.md §6.0`](./HARNESS.md).
5. La latencia de `/api/line/start` ya la domina la llamada al LLM. Añadir retrieval **antes** la empeora;
   hay que medirla.

**Decisión pendiente del equipo — qué se indexa.** El modelo ya está elegido, el corpus no. Las opciones
no son equivalentes y llevan a arquitecturas distintas; están desarrolladas en
[`HARNESS.md §6.1`](./HARNESS.md).

---

## 8. Mapa de lectura para un agente

No leas el repo entero. Según lo que toques:

| Si trabajas en… | Lee exactamente esto |
|---|---|
| **The LINE / RAG** | `ai/genkit.ts`, `ai/generate.ts`, `ai/flows/generate-assessment-flow.ts`, `api/line/start/route.ts`, `api/line/submit/route.ts`, `lib/server/assessment.ts`, `types/job.types.ts` |
| **Scoring / DNA** | `lib/server/assessment.ts`, `api/line/submit/route.ts`, `lib/grading.ts`, `lib/match.ts` + sus `.test.ts` |
| **Seguridad** | `firestore.rules`, `storage.rules`, `lib/firebase/admin.ts`, `lib/api.ts`, `docs/SECURITY.md` |
| **Datos** | `types/*.types.ts`, `services/*`, `lib/firebase/firestore.ts`, `docs/DATABASE.md` |
| **Frontend** | `app/dashboard/<ruta>/page.tsx`, `components/layout/DashboardShell.tsx`, `hooks/use-auth-user.ts` |
| **Infra / deploy** | `next.config.ts`, `open-next.config.ts`, `wrangler.jsonc`, `netlify.toml`, `ci.yml`, `.env.example` |

**Nunca leas** `src/components/ui/**` (3 655 líneas de shadcn generado) ni `.open-next/**` ni
`package-lock.json`. Es el 80 % del peso del repo y el 0 % de la información.
