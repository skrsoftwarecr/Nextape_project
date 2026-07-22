# NEXTAPE — Modelo de Datos (Firestore)

> Fuente de verdad: código real en `src/types/*`, `src/services/*`, `firestore.rules`.
> Cuando este documento y `docs/blueprint.md` discrepen, **manda el código**. Las discrepancias
> conocidas están marcadas con ⚠️ y recogidas en `docs/TECH_DEBT.md`.

## 1. Base de datos

- **Motor:** Cloud Firestore (modo nativo), proyecto Firebase.
- ⚠️ **Ambigüedad de proyecto:** `.firebaserc` apunta a `nextape-prod`, pero
  `src/lib/firebase/client.ts` inicializa el SDK con `projectId: "studio-4462619429-470d8"`.
  El frontend habla con `studio-4462619429-470d8`; el CLI de Firebase despliega reglas a `nextape-prod`.
  **Las reglas pueden estar desplegándose a un proyecto distinto del que usa la app.** Ver TECH_DEBT.
- Acceso a datos **exclusivamente desde el cliente** vía Firebase Web SDK v11 (`'use client'`).
  No hay Admin SDK ni backend con service account. Toda escritura pasa por las reglas de seguridad.

## 2. Colecciones

### `users/{uid}`  — Perfil de usuario
Tipo canónico: [`UserProfile`](../src/types/user.types.ts) (`src/types/user.types.ts`).

| Campo | Tipo | Notas |
|---|---|---|
| `uid` | string | PK = uid de Firebase Auth |
| `displayName` | string | |
| `email` | string | |
| `photoURL` | string? | opcional (login social) |
| `githubUrl` | string? | opcional, no se captura hoy en el registro |
| `role` | `"developer" \| "recruiter"` | define la navegación del dashboard |
| `createdAt` | Timestamp | |
| `updatedAt` | Timestamp? | |

- Escrito por `UserService.saveUser` (`setDoc` con `merge:true`) en el registro (`AuthModal`).
- ⚠️ Existe un **segundo tipo `UserProfile` incompatible** en `src/types/index.ts`
  (`username`, `grade`, `skills[]`, `core{}`) usado por `CoreService`/`useCore`. No representa
  la colección `users`. Es un modelo legacy. Ver TECH_DEBT.

### `user_skill_scores/{uid}`  — El "CORE" / DNA técnico
Tipo: [`UserSkills`](../src/types/user.types.ts).

| Campo | Tipo | Notas |
|---|---|---|
| `uid` | string | PK = uid |
| `scores` | `{ [skillName: string]: number }` | clave = skill en **minúsculas**, valor 0–100 |
| `updatedAt` | Timestamp | ✅ ahora `Timestamp.now()` (antes `new Date()`) |

- Leído por `SkillsService.getSkills`. Escrito por `SkillsService.updateSkillScores` (y el atajo
  `updateSkillScore`).
- ✅ Persiste **todas** las habilidades evaluadas (por `tag`) y se queda con el **mejor** score por skill.
- ✅ **Escritura SOLO en servidor** (B2): la escribe `/api/line/submit` con Admin SDK. El cliente es
  `write:false` → el DNA **no es falsificable**. Lectura: solo el owner. Ver SECURITY / BACKEND_AI.
- ⚠️ La "media de últimos 3 intentos" del blueprint sigue sin implementarse (se toma el mejor, no la media).

### `assessment_attempts/{attemptId}`  — Intentos de evaluación
Tipo: [`AssessmentSession`](../src/types/assessment.types.ts).

| Campo | Tipo | Notas |
|---|---|---|
| `assessmentId` | string | |
| `userId` | string | debe == `request.auth.uid` para crear |
| `status` | `"pending" \| "in_progress" \| "completed"` | |
| `answers` | `{ [questionId: string]: string }` | |
| `score` | number | |
| `startedAt` | Timestamp | |
| `completedAt` | Timestamp? | |

- Servicio: `AssessmentService` (`getSession`, lectura). La escritura es server-only.
- ✅ **El servidor escribe un documento por intento** (`/api/line/submit`, Admin SDK) al terminar la
  simulación (status `completed`, `score` global). Alimenta la métrica "Simulaciones" del dashboard.
- ✅ Cliente `write:false`; lectura solo del dueño (la query debe filtrar por `userId`).

### `line_sessions/{sessionId}` y `job_answer_keys/{jobId}` — 🔒 server-only
Colecciones de **confianza**, escritas/leídas SOLO por el Admin SDK (reglas `read, write: if false`).
- `line_sessions`: `{ userId, jobId?, questions (con correctIndex), createdAt }`. Sesión de una simulación;
  guarda la clave de respuestas. Se borra al enviar (`/api/line/submit`).
- `job_answer_keys`: `{ jobId, questions (con correctIndex), updatedAt }`. Clave de la prueba de una vacante
  (el doc público `jobs` guarda las preguntas **sin** clave).

### `jobs/{jobId}`  — Vacantes
Tipo: [`JobOpportunity`](../src/types/job.types.ts).

| Campo | Tipo | Notas |
|---|---|---|
| `id` | string? | id de documento |
| `title`, `company`, `description`, `salary`, `location`, `type`, `level` | string | `company` hoy hardcodeado a `"Empresa NEXTAPE"` |
| `requiredSkills` | string[] | normalizadas a minúsculas |
| `assessmentQuestions` | `Question[]?` | generadas por IA (Genkit) |
| `createdBy` | string | uid del reclutador |
| `postedAt` | Timestamp | |
| `applicantsCount` | number? | |

- Leído por `JobService.getLatestJobs` (`orderBy(postedAt desc) limit 20`) y `getJob`.
- Creado/actualizado desde `dashboard/vacancies/new` (client `addDoc` + `JobService.generateJobAssessment` `updateDoc`).
- ✅ **Reglas corregidas (B1):** el reclutador **dueño** (`createdBy == uid`) puede crear y actualizar su
  vacante; sin borrado desde cliente; no puede reasignar `createdBy`. La creación de vacantes ya no está bloqueada.

#### Subtipo `Question` (embebido en `jobs.assessmentQuestions` y generado por IA)
`id, briefing, text, options[4], correctIndex (0-3), difficulty, tag`.
- ⚠️ `correctIndex` viaja al cliente (lectura pública de `jobs`). Un candidato puede leer las respuestas.

### `questions/{qId}`  — Banco de preguntas (no usado activamente)
Tipo: `Question`. Reglas: lectura autenticada, escritura `if false`.
- No hay servicio que lo consulte hoy; las preguntas viven embebidas en `jobs` o se generan al vuelo.

### `candidate_matches/{matchId}`  — Matches candidato↔vacante
Tipo: [`CandidateMatch`](../src/types/job.types.ts). `matchId = ${uid}_${jobId}`.

| Campo | Tipo | Notas |
|---|---|---|
| `userId` | string | Candidato. |
| `recruiterId` | string | Dueño de la vacante (denormalizado, `= job.createdBy`). La regla de lectura lo usa. |
| `jobId` | string | |
| `jobTitle` | string | Denormalizado desde `jobs`. |
| `candidateName` | string | Denormalizado desde `users`. |
| `score` | number | Resultado de The LINE (0–100). Se conserva el **mejor** entre intentos. |
| `matchPercent` | number | Afinidad DNA↔`requiredSkills` (0–100), vía `calculateMatch`. |
| `skills` | `Record<string, number>` | Snapshot de los scores del candidato en las skills de la vacante. |
| `completedAt` | Timestamp | |

- **Escritor:** `POST /api/line/submit` (Admin SDK) cuando la sesión de The LINE tiene `jobId`: tras calcular
  el DNA, escribe/actualiza `candidate_matches/{userId_jobId}` (conserva el mejor `score`) e incrementa
  `jobs.applicantsCount` solo la primera vez que el candidato aplica. Es best-effort (no invalida el intento).
- **Lector:** `CompatibilityService.getMatchesForRecruiter(recruiterId)` (lee `where recruiterId == uid`).
  Escritura `if false` para el cliente (solo Admin SDK).

### `user_roadmaps/{uid}`  — Roadmaps de aprendizaje
- **Sí se usa** (aunque sin tipo dedicado). La página Roadmap lee `getDocById("user_roadmaps", uid)` y
  escribe `setDocById("user_roadmaps", uid, { steps, summary, updatedAt })` tras generar con IA.
- Estructura de facto: `{ steps: RoadmapStep[], summary: string, updatedAt }`.
- ⚠️ Falta un tipo en `src/types` para esta colección (usa objetos ad-hoc). ⚠️ La UI no renderiza
  `summary` ni `resources[]` (se guardan pero no se muestran).

### `core/{uid}`  — ⚠️ Colección fantasma
- `CoreService` lee/escribe la colección `core`, **pero no existe regla para `core`**.
  Firestore **deniega por defecto** → toda operación falla. Además usa el `UserProfile` legacy.
  Es código muerto/roto. Ver TECH_DEBT.

## 3. Relaciones

```
Auth user (uid)
 ├─1:1─ users/{uid}                (perfil, role)
 ├─1:1─ user_skill_scores/{uid}    (DNA técnico: scores por skill)
 ├─1:1─ user_roadmaps/{uid}        (roadmap IA — sin persistencia confirmada)
 ├─1:N─ assessment_attempts/{id}   (userId == uid)  [hoy sin uso real]
 └─1:N─ candidate_matches/{uid_jobId} (userId == uid; recruiterId == job.createdBy)

recruiter (uid)
 └─1:N─ jobs/{jobId}               (createdBy == uid)  [bloqueado por reglas]

jobs/{jobId}.assessmentQuestions[]  ← generado por Genkit (generateQuestionsFlow)
```

## 4. Índices

- `jobs`: consulta `orderBy(postedAt, desc) + limit(20)` → índice de un solo campo (automático). OK.
- No hay `firestore.indexes.json` en el repo. Cualquier consulta compuesta futura (p.ej. filtrar
  jobs por skill + orden por fecha) requerirá índice compuesto declarado.

## 5. Reglas de negocio de datos

- **Skills normalizadas a minúsculas** en todos los puntos de escritura/lectura de scores y requiredSkills.
  El match (`JobService.calculateMatch`) también normaliza a minúsculas antes de comparar. Mantener esta invariante.
- **Cálculo de match** (`calculateMatch`): suma los scores del usuario para las skills requeridas y divide
  entre `jobSkills.length` (no entre las encontradas) → penaliza skills faltantes. Devuelve entero redondeado 0–100.

## 6. Convenciones al tocar datos

- Todo acceso a Firestore pasa por los helpers de `src/lib/firebase/firestore.ts`
  (`getDocById`, `setDocById` [merge], `updateDocById`, `queryCollection`) o por un `*.service.ts`.
  **No** llamar al SDK de Firestore directamente desde componentes salvo casos ya existentes (migrar hacia servicios).
- Timestamps: usar `Timestamp.now()` de `firebase/firestore`, nunca `new Date()`.
- Al añadir una colección: (1) tipo en `src/types`, (2) servicio en `src/services`, (3) **regla en `firestore.rules`**,
  (4) documentarla aquí. Sin regla, la colección no funciona en prod.
