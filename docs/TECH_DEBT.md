# NEXTAPE — Deuda Técnica e Inconsistencias

> Registro consolidado de inconsistencias, bugs y deuda detectados en la revisión de la rama `migration`.
> Prioridad: 🔴 bloqueador de producción · 🟠 importante · 🟡 menor/cosmético.
> Cada ítem indica archivo(s) y acción sugerida.

## Estado de resolución (rama `fix/system-hardening`)

Ver detalle en [`CHANGELOG_FIXES.md`](./CHANGELOG_FIXES.md).

- ✅ **Resueltos:** **B1, B2, B5, B6, B7, B8**, C1(modelo IA doc), **C3**, **A1, A2, A3, A4, A5, A7**, **R1–R7**,
  y **B3** en su mayoría (proyecto canónico `studio-...` fijado + config por env; falta solo el secreto de
  Gemini en hosting). Además: bugs de landing, botones no-op, hook de auth, util de grading, `ui/calendar`
  muerto, script de build no multiplataforma. **Integridad (B2): scoring/DNA movido a servidor** (Admin SDK,
  route handlers `/api/*`); el DNA ya **no es falsificable en cliente** y el `correctIndex` no sale al navegador.
- ✅ **Calidad/CI:** ESLint configurado (0 errores), tests con Vitest (14 pasan; reglas listas para emulador),
  CI en GitHub Actions (typecheck+lint+test+build).
- ⏳ **Pendientes:** `GROQ_API_KEY` + credenciales Admin en Netlify; **A6** (media de últimos 3 intentos,
  si se mantiene); reducir 24 warnings de ESLint; correr los tests de reglas contra el emulador en CI;
  visibilidad de `users` para reclutadores (C2).

## 🔴 Bloqueadores de producción

| # | Problema | Archivo(s) | Acción sugerida |
|---|---|---|---|
| B1 | **Reglas bloquean crear vacantes**: `jobs write: if false`, pero el reclutador crea/actualiza `jobs` desde cliente. | `firestore.rules`, `dashboard/vacancies/new/page.tsx`, `services/jobs.service.ts` | Permitir write a `role==recruiter` dueño (`createdBy==uid`) o mover a Cloud Function con Admin SDK. |
| B2 | **DNA falsificable**: scoring y escritura de `user_skill_scores` ocurren en cliente (owner-write). El `correctIndex` viaja al navegador. Anula el "DNA verificado". | `firestore.rules`, `dashboard/line/page.tsx`, `services/skills.service.ts`, `ai/flows/generate-assessment-flow.ts` | Scoring en servidor (Cloud Function/Admin SDK); no enviar `correctIndex`; `user_skill_scores` write `if false` para clientes. |
| B3 | **Mismatch de `projectId`**: app usa `studio-4462619429-470d8`; `.firebaserc` despliega a `nextape-prod`. Reglas podrían no aplicar al proyecto real. | `src/lib/firebase/client.ts`, `.firebaserc` | Unificar en un único proyecto; mover config a `.env` (`NEXT_PUBLIC_*`). |
| B4 | **`GROQ_API_KEY` no configurada** en hosting → flows IA fallan en prod. | `ai/genkit.ts`, Netlify env | Declarar `GROQ_API_KEY` como variable de entorno en Netlify (ver DEPLOYMENT). |
| B5 | **Build ignora errores** de TS y ESLint → se puede desplegar código roto. | `next.config.ts` | Quitar `ignoreBuildErrors`/`ignoreDuringBuilds`; arreglar errores; CI con `typecheck`+`lint`. |
| B6 | **`vacancies/page.tsx` rompe en runtime**: usa `<Terminal>` y `<Briefcase>` sin importar. | `dashboard/vacancies/page.tsx` | Importar iconos de `lucide-react`. |
| B7 | **Storage con lectura pública total** (`read: if true`). Cualquier archivo de usuario es público. | `storage.rules` | Restringir lectura; separar carpetas públicas/privadas; validar tipo/tamaño. |
| B8 | **`assessment_attempts` listable por cualquiera** (`list` sin filtro de `userId`). | `firestore.rules` | Filtrar `list` por `userId == request.auth.uid`. |

## 🟠 Inconsistencias de arquitectura / modelo

| # | Problema | Archivo(s) | Acción |
|---|---|---|---|
| A1 | **Dos `UserProfile` incompatibles**: `types/index.ts` (legacy: username/grade/skills) vs `types/user.types.ts` (real). | `types/index.ts`, `features/core/*` | Eliminar el legacy; migrar consumidores a `user.types.ts`. |
| A2 | **Colección `core` fantasma**: `CoreService`/`useCore` leen/escriben `core`, sin regla (denegado) y usando el tipo legacy. Código muerto/roto. | `features/core/services/core.service.ts`, `features/core/hooks/useCore.ts` | Borrar el módulo o crear regla + tipo. El CORE real vive en `user_skill_scores`. |
| A3 | **Dos arquitecturas a medias**: `src/features/*` (stubs vacíos) vs `src/services/*` (real). | `src/features/*` | Decidir una; hoy usar `services`. Borrar stubs `AuthService={}`, `useAssessment`, `CompatibilityEngine`. |
| A4 | ✅ **Resuelto (2026-07-22).** El tipo pasó a `CandidateMatch` (con `recruiterId`, `score`, `matchPercent`, `skills` snapshot); `/api/line/submit` escribe `candidate_matches` al postular con The LINE (Admin SDK, conserva mejor `score`, incrementa `applicantsCount`); `CompatibilityService.getMatchesForRecruiter` + `/dashboard/candidates` rankean candidatos por vacante. La regla (ya usaba `recruiterId`) quedó alineada. | `types/job.types.ts`, `app/api/line/submit/route.ts`, `services/compatibility.service.ts`, `services/jobs.service.ts`, `dashboard/candidates/page.tsx` | — |
| A5 | **`assessment_attempts` nunca se escribe**: The LINE salta esta colección → historial y métrica "Simulaciones" vacíos. | `dashboard/line/page.tsx`, `services/assessments.service.ts` | Persistir cada intento al terminar la simulación. |
| A6 | **Media de últimos 3 intentos no implementada**: el blueprint la promete; el código sobrescribe el score. | `services/skills.service.ts` | Implementar histórico + promedio, o actualizar el blueprint. |
| A7 | **The LINE solo guarda 1 skill** (`questions[0].tag`) aunque evalúe varias; y **sobrescribe** (reintento peor baja el score). | `dashboard/line/page.tsx` | Puntuar por tag y agregar (max/promedio) por skill. |

## 🟠 Inconsistencias de contenido / docs

| # | Problema | Acción |
|---|---|---|
| C1 | ✅ **Resuelto.** Migrado a **Groq** (`genkitx-groq`, `llama-3.3-70b-versatile`) por coste. Modelo centralizado en `genkit.ts` (`GROQ_MODEL`). `blueprint.md` (histórico) aún menciona Gemini. |
| C2 | Blueprint dice `users` con lectura pública para reclutadores; la regla es **owner-only** → rompe el journey de reclutador. | Decidir modelo de visibilidad de candidatos y alinear reglas + blueprint. |
| C3 | Umbrales de "grade" divergen entre `core` y `profile`. | Extraer a una única función util de grading. |
| C4 | `company` hardcodeado a `"Empresa NEXTAPE"` en toda vacante; telemetría falsa ("12ms/Encrypted"); `totalApplicants:0`; fallbacks de roadmap/stackMap hardcodeados. | Sustituir por datos reales / marcar claramente como demo. |

## 🟡 Limpieza de repositorio (archivos basura)

| # | Archivo | Problema | Acción |
|---|---|---|---|
| R1 | `estructura.txt` (1.8 MB, 98k líneas) | Volcado de `ls -R` **incluyendo `node_modules`**, commiteado por error. | Borrar y añadir a `.gitignore`. |
| R2 | `tailwing.config.ts` | Duplicado **idéntico** de `tailwind.config.ts` (typo en el nombre). | Borrar. |
| R3 | `.modified` | Archivo vacío (artefacto de IDX). | Borrar. |
| R4 | Rutas top-level `src/app/{line,jobs,roadmap,profile,compatibility,digital-twin}/page.tsx` | Stubs `return null` (código muerto). | Borrar. |
| R5 | `src/app/dashboard/digital-twin/page.tsx` | `ObsoletePage` que retorna `null`. | Borrar. |
| R6 | `three` / `@react-three/*` / `public/models/laptop.glb` | Instalados pero **0 usos** en `src`. | Borrar del `package.json` y el asset, o implementar el visor 3D. |
| R7 | `src/app/lib/placeholder-images.json` vs `src/lib/placeholder-images.*` | Posible duplicado de imágenes placeholder. | Consolidar en un único origen. |

## 🟡 Bugs menores / UX

- Landing: botón "Soy Reclutador/Empresa" sin `onClick`; ancla `#how-it-works` sin destino; typos Tailwind `sm:row`, `md:row`.
- `compatibility`: botones "Recalcular Auditoría" / "Aplicar con Identity" sin handler.
- Varias páginas usan `auth.currentUser` en `useEffect` sin esperar `onAuthStateChanged` (frágil; dependen del `AuthGuard`).
- `SkillsService.updateSkillScore` usa `new Date()` en vez de `Timestamp.now()`.
- Profile no es editable; avatar/`githubUrl` no se muestran.
- `src/ai/dev.ts` vacío → los flows no se registran en Genkit Dev UI.
- The LINE sin guard cuando `questions` llega vacío (crash potencial).

## Notas de proceso

- **No modificar** este comportamiento sin acordarlo con el equipo (3 personas). Este archivo es el
  backlog compartido; al resolver un ítem, marcarlo y enlazar el commit/PR.
- Antes de "ir a producción", priorizar todos los 🔴 y B-items. Ver `docs/PRODUCTION_READINESS.md`.
