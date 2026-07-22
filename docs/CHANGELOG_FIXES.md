# NEXTAPE — Changelog de correcciones (rama `fix/system-hardening`)

Registro de las correcciones aplicadas al sanear el sistema. Cada fase referencia los IDs de
[`docs/TECH_DEBT.md`](./TECH_DEBT.md). Rama base: `migration`.

## FASE 8 — Cierre del loop reclutador (A4) — 2026-07-22
> Antes: el reclutador publicaba vacantes pero nunca podía ver ni rankear candidatos; `candidate_matches`
> estaba inerte (sin escritor) y su regla referenciaba `recruiterId`, campo ausente en el tipo. Ahora el
> loop developer→recruiter está **cerrado**.
- **Tipo** (`types/job.types.ts`): `CompatibilityMatch` → **`CandidateMatch`** con `userId`, `recruiterId`
  (denormalizado), `jobId`, `jobTitle`, `candidateName`, `score` (The LINE 0–100, se conserva el mejor),
  `matchPercent` (afinidad DNA↔`requiredSkills` 0–100), `skills` (`Record<string,number>`, snapshot) y
  `completedAt`. `doc id = ${userId}_${jobId}`.
- **Escritor server-trust** (`app/api/line/submit/route.ts`): si la sesión de The LINE tiene `jobId`, tras
  calcular el DNA escribe/actualiza `candidate_matches/{userId_jobId}` con Admin SDK (`recruiterId = job.createdBy`,
  denormaliza `jobTitle`/`candidateName`, conserva el mejor `score`, calcula `matchPercent` con `calculateMatch`,
  guarda snapshot de `skills`) e incrementa `jobs.applicantsCount` (`FieldValue.increment(1)`) **solo la primera
  vez** que ese candidato aplica a la vacante. Best-effort (try/catch; un fallo no invalida el intento).
- **Servicios** (`src/services/`): `CompatibilityService.getMatch` (muerto) → **`getMatchesForRecruiter(recruiterId)`**
  (lee `candidate_matches where recruiterId == uid`; ordena en cliente por `score` para no depender de índice
  compuesto). Nuevo **`JobService.getJobsByRecruiter(uid)`**.
- **`/dashboard/candidates`**: reescrita. Lee matches reales vía servicios (ya **no** usa el SDK crudo de
  Firestore), agrupa por vacante, rankea candidatos por su `score` de The LINE, muestra `matchPercent` y `skills`.
  Stats reales (vacantes activas, aplicaciones totales, DNA verificados). Eliminado el copy deshonesto sobre
  "el ranking… se activará cuando el pipeline… esté disponible".
- **Dashboard reclutador** (`dashboard/page.tsx`): "Candidatos en Pipeline" ahora suma el `applicantsCount`
  real de las vacantes (antes hardcodeado a 0).
- **Jobs (developer)** (`dashboard/jobs/page.tsx`): la CTA "TOMAR PRUEBA ESPECÍFICA" → "POSTULAR CON THE LINE",
  con microcopy honesto: al completar la prueba, el resultado verificado se comparte con el reclutador de la vacante.
- **Regla** `candidate_matches` (`firestore.rules`): **sin cambios** (ya era correcta: `allow read if userId==uid
  || recruiterId==uid`, `write:false`); ahora el `recruiterId` que referenciaba sí existe en el documento.
- **Privacidad/consentimiento:** tomar The LINE de una vacante concreta = postular = consentir compartir ese
  resultado con el reclutador dueño de esa vacante, que solo ve candidatos de **sus** vacantes (`recruiterId==uid`).
- **Verificación:** `npm run typecheck` ✅ · `npm run lint` ✅ · `npm run build` ✅.

## FASE 1 — Código muerto y basura (devops-firebase / code-reviewer)
- **R1** Eliminado `estructura.txt` (1.8 MB, volcado de `ls -R` con `node_modules`).
- **R2** Eliminado `tailwing.config.ts` (duplicado idéntico por typo de `tailwind.config.ts`).
- **R3** Eliminado `.modified` (archivo vacío, artefacto de IDX).
- **R4** Eliminadas rutas top-level muertas: `src/app/{compatibility,digital-twin,jobs,line,profile,roadmap}/page.tsx` (stubs `return null`).
- **R5** Eliminado `src/app/dashboard/digital-twin/page.tsx` (obsoleto; renombrado a CORE).
- **R6** Eliminado el stack 3D huérfano: deps `three`, `@react-three/fiber`, `@react-three/drei`,
  `@types/three` del `package.json` + asset `public/models/laptop.glb` (0 usos en `src`).
- **R7** Eliminados placeholders sin consumidores: `src/app/lib/placeholder-images.json`,
  `src/lib/placeholder-images.ts`, `src/lib/placeholder-images.json`.
- **A3** Eliminado `src/features/*` completo (stubs vacíos: `AuthService`, `useAssessment`,
  `CompatibilityEngine`, y el módulo `core` roto). 0 imports en el resto del código.

## FASE 2 — Consolidación de tipos (database-architect)
- **A1/A2** `src/types/index.ts` dejó de definir un `UserProfile` legacy incompatible. Ahora es un
  **barrel** que reexporta los tipos canónicos (`firebase.types`, `user.types`, `assessment.types`,
  `job.types`). El único consumidor del legacy era el módulo `features/core` (ya eliminado).

## FASE 3 — Bugs de runtime y lógica (frontend / backend)
- **Nuevo hook `src/hooks/use-auth-user.ts`**: estandariza la suscripción a Auth y elimina el
  _race condition_ de leer `auth.currentUser` en `useEffect`. Aplicado en `dashboard`, `core`,
  `profile`, `jobs`, `compatibility`, `vacancies`, `candidates`.
- **Nueva util `src/lib/grading.ts`** (`getTechnicalGrade`, `calculateAverageScore`): fuente única del
  "grade". Corrige **C3** (umbrales divergentes CORE vs Perfil) y el `NaN` del Perfil con scores vacíos.
- **B6** `dashboard/vacancies/page.tsx`: importados `Terminal` y `Briefcase` (crash de runtime resuelto);
  typo `md:row`→`md:flex-row`; `postedAt.toDate()` protegido con `formatPostedAt`; "Ver Candidatos" enlaza a la página.
- **Landing `page.tsx`**: `useRef` e iconos sin usar eliminados; typo `sm:row`→`sm:flex-row`; botón
  "Soy Reclutador" ahora abre el modal; **construida la sección `#how-it-works`** (enlace del navbar que estaba roto).
- **Construida `dashboard/candidates/page.tsx`**: la ruta enlazada desde el menú del reclutador ya no es
  un 404; muestra métricas y vacantes reales con un estado honesto para el ranking por DNA.
- **`compatibility/page.tsx`**: botón "Recalcular Auditoría" ahora recalcula; "Aplicar con Identity"
  enlaza a la prueba de la vacante; `Badge` sin usar eliminado.
- **A7 / A5 — The LINE (`dashboard/line/page.tsx`)**: puntúa **por habilidad (tag)**, no solo la primera;
  persiste el intento en `assessment_attempts` (arregla la métrica "Simulaciones" muerta); **guard** cuando
  la IA no devuelve preguntas (evita crash); banner de error; `level` de la vacante usado al generar.
- **`services/skills.service.ts`**: `updateSkillScores` (varias skills a la vez), se queda con el **mejor**
  score por skill (no regresa el DNA en reintentos peores), y usa **`Timestamp.now()`** (antes `new Date()`).
- **`dashboard/jobs`**: filtro protegido contra `title`/`company` nulos.

## FASE 4 — Hardening de config/build (devops-firebase)
- **B5** `next.config.ts`: eliminado `typescript.ignoreBuildErrors`. El proyecto pasa `tsc --noEmit`
  limpio, así que los errores de tipos ahora **bloquean** el build. (ESLint sigue ignorado en build
  porque aún no hay config de ESLint — ver Pendientes.)
- **Código muerto extra**: eliminado `src/components/ui/calendar.tsx` (0 usos, rompía el typecheck por
  API v9 de react-day-picker) y su dependencia `react-day-picker`.
- **Script de build no multiplataforma**: `"build": "NODE_ENV=production next build"` fallaba en Windows
  (`NODE_ENV` no es reconocido por cmd.exe). Cambiado a `"build": "next build"` (Next ya fija
  `NODE_ENV=production` en build). Ahora el build funciona en Windows/Linux/macOS.
- **B3 (parcial)** `src/lib/firebase/client.ts`: la config lee de `NEXT_PUBLIC_FIREBASE_*` con fallback a
  los valores actuales. Añadido `.env.example` (incluye el secreto `GEMINI_API_KEY`). El proyecto
  canónico sigue pendiente de decisión (Fase 6).

## FASE 5 — Reglas de seguridad (security-auditor)
- **B1** `firestore.rules` `jobs`: `write:if false` → el reclutador **dueño** (`createdBy`) puede crear y
  actualizar su vacante (incl. la prueba IA); sin borrado desde cliente; no se puede reasignar `createdBy`.
- **B8** `firestore.rules` `assessment_attempts`: eliminado el `list` abierto; la lectura/consulta es
  solo del dueño (una query debe filtrar por `userId`).
- **B7** `storage.rules`: lectura pública (`if true`) → solo autenticados; escritura del dueño con
  límite de tamaño (5 MB).
- **B2 (documentado, pendiente)**: `user_skill_scores` sigue owner-write con un comentario que marca la
  necesidad de mover el scoring a servidor (Fase 6). No se cierra sin el pipeline de servidor.

## Verificación
- `npm run typecheck` → **limpio (exit 0)** tras todas las fases.
- ESLint: no configurado en el repo (tarea pendiente, ver docs/PRODUCTION_READINESS.md).

## FASE 6 — Integridad server-trust + calidad (decisiones del usuario)

### 6A — Proyecto Firebase canónico (B3)
- `.firebaserc` alineado a **`studio-4462619429-470d8`** (el que usa la app). Las reglas ya se
  despliegan al mismo proyecto que la app. Pendiente solo el secreto de Gemini en hosting.

### 6B–6E — Scoring en servidor (B2, el fix de integridad central)
- **Firebase Admin SDK** (`src/lib/firebase/admin.ts`, init lazy con ADC/`FIREBASE_SERVICE_ACCOUNT`).
- **Route handlers** (Node runtime, verifican el ID token con Admin):
  - `POST /api/line/start`: genera preguntas EN SERVIDOR, guarda la clave en `line_sessions`
    (server-only) y devuelve preguntas **sin `correctIndex`**.
  - `POST /api/line/submit`: corrige EN SERVIDOR y escribe el DNA (`user_skill_scores`, mejor score
    por skill) y el intento (`assessment_attempts`) con Admin SDK.
  - `POST /api/jobs/assessment`: el reclutador dueño genera la prueba; guarda preguntas públicas
    **sin clave** en `jobs` y la clave en `job_answer_keys` (server-only).
- **Cliente refactorizado**: The LINE y vacancies/new usan `src/lib/api.ts` (`apiPost` con ID token);
  ya no puntúan ni escriben el DNA. `SkillsService`/`AssessmentService` sin métodos de escritura;
  `JobService.generateJobAssessment` eliminado. `calculateMatch` extraído a `src/lib/match.ts` (puro).
- **Reglas cerradas**: `user_skill_scores` `write:false`; `assessment_attempts` `write:false`;
  `line_sessions` y `job_answer_keys` deny total (solo Admin). Tipo `PublicQuestion` (sin `correctIndex`).
- **Resultado (B2 cerrado):** el DNA ya **no es falsificable desde el cliente**; el `correctIndex`
  nunca llega al navegador; el scoring es de confianza (servidor).
- `src/ai/dev.ts` ahora registra los flows (Genkit Dev UI).

### 6G — Calidad y CI
- **ESLint** flat config (`eslint.config.mjs`, `next/core-web-vitals` + `next/typescript`); `npm run lint`
  = 0 errores (24 warnings advisory). Script `lint` → `eslint .`.
- **Tests** con Vitest: `src/lib/grading.test.ts`, `src/lib/match.test.ts`,
  `src/lib/server/assessment.test.ts` (14 tests) + `src/lib/firebase/rules.test.ts` (5 tests de reglas,
  listos para el emulador, se saltan sin él). Scripts `test`/`test:watch`.
- **CI**: `.github/workflows/ci.yml` (typecheck + lint + test + build en push/PR).

### Verificación Fase 6
- `npm run typecheck` ✅ · `npm run lint` ✅ (0 errores) · `npm test` ✅ (14 pasan) · `npm run build` ✅ (rutas `/api/*`).

## FASE 7 — Migración a Groq + coherencia + spanglish

### Proveedor de IA: Gemini → **Groq** (decisión de equipo, coste)
- `src/ai/genkit.ts`: plugin **`genkitx-groq`**, modelo `groq/llama-3.3-70b-versatile` (`GROQ_MODEL`),
  key `GROQ_API_KEY`. Eliminado `@genkit-ai/google-genai`. Se reutiliza el enfoque que el equipo ya tenía
  en la rama `feat/mvp-core-modules`.
- Nuevo `src/ai/generate.ts` (`generateJson`): llama al modelo, limpia fences, `JSON.parse` + **validación
  Zod** con reintento (más robusto con Llama que el structured output nativo).
- Flows reescritos (assessment y roadmap) con esquema *lenient* → normalización a tipos estrictos.
- `.env.example` y **todas las docs** actualizadas (Gemini→Groq). `src/ai/dev.ts` registra los flows.

### Correcciones de coherencia (informe del agente de flujo)
- **#3** El `tag` de la IA se **normaliza al vocabulario del `stack`** (`normalizeTag`) y el prompt lo
  restringe → el pipeline DNA→match ya no subestima el % por diferencias de redacción.
- **#2** Login social: el selector de tipo de cuenta ahora es **visible siempre** (Google/GitHub también
  crean cuenta) → se acabó la auto-asignación silenciosa de `role`.
- **#6** Crear vacante: manejo de error separado (crear vacante vs generar prueba). Ya no hay job huérfano
  con mensaje falso "no se pudo crear"; si falla la IA, la prueba se genera al vuelo después.
- **#7** `jobs.assessmentQuestions` tipado como `PublicQuestion[]` (el doc público no lleva `correctIndex`).
- **#8** `/api/line/submit` persiste las respuestas reales del intento (antes `{}`).
- **#11** `apiPost` espera `auth.authStateReady()` antes de leer `currentUser`.
- **#5** Copy honesto en CORE/Perfil: ya no afirman "los reclutadores ven tu DNA en tiempo real" (las
  reglas no lo permiten hasta A4).
- **Escala de dificultad** de The LINE unificada a junior/mid/senior/master (antes `expert` era inválido).

### Spanglish (informe del agente de consistencia)
- UI a **español** y labels unificados en ~12 archivos: `Recruiter Engine`→`Panel de Reclutador`,
  `Technical Grade`/`Technical Rank`→`Grado Técnico`, `CORE Affinity`/`Core Match`→`Afinidad CORE`,
  `Technical/Skill DNA`→`DNA Técnico`, `Compatibility Engine`→`Motor de Compatibilidad`, `Rank Index`,
  `Skill Gap`, `Latency/Security/Encrypted`, fallbacks `Remote/Full-time/Competitive`, nav `Jobs`→`Empleos`,
  badge `Enterprise`→`Empresa`, roles `Developer`→`Desarrollador`, typo `CORE_SYNCRONIZED`, metadata, etc.
- Política de consistencia (del agente): UI en español; código y nombres de marca (`Nextape`, `The LINE`,
  `CORE`, `Roadmap`, `DNA`, `Match`) en inglés; no mezclar idiomas dentro de una frase.

### Verificación Fase 7
- `npm run typecheck` ✅ · `npm run lint` ✅ (0 errores, 23 warnings) · `npm test` ✅ · `npm run build` ✅.

## Pendiente (siguiente)
- **B3/B4** Configurar `GROQ_API_KEY` + `FIREBASE_SERVICE_ACCOUNT` en Netlify (ver DEPLOYMENT).
- **#4** Migrar el SDK crudo de Firestore de las páginas restantes (`dashboard`, `vacancies`, `vacancies/new`)
  a métodos de `JobService` (regla CLAUDE.md §4.2.7). `candidates` ya migrado en la Fase 8.
- **#10** Compartir el perfil entre `AuthGuard` y `DashboardShell` (evitar doble lectura y flash de nav).
- **#13** CTAs de landing que preseleccionen rol/registro en el modal.
- Reducir warnings de ESLint; tests de reglas con emulador en CI.
