# NEXTAPE — Modelo de Seguridad

> Fuente de verdad: `firestore.rules`, `storage.rules`, `src/lib/firebase/*`, `src/components/auth/*`.
> Este documento describe cómo funciona hoy la seguridad **y** los riesgos abiertos antes de producción.

## 1. Autenticación

- **Firebase Authentication** (Web SDK). Proveedores habilitados en código:
  - Email/Password (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`)
  - Google (`GoogleAuthProvider`, popup)
  - GitHub (`GithubAuthProvider`, popup)
- Estado de sesión: `onAuthStateChanged` (`subscribeToAuth`). No hay sesión de servidor / cookies:
  la app es un SPA autenticado en cliente. **No hay verificación de token en servidor.**
- Alta de perfil: tras registrarse, `AuthModal` crea el doc `users/{uid}` con el `role` elegido
  (`developer` | `recruiter`). El `role` lo **elige el propio usuario** en el formulario → cualquiera
  puede auto-asignarse `recruiter`. No hay verificación de empresa.

### Protección de rutas — `AuthGuard`
- `src/components/auth/AuthGuard.tsx` envuelve `/dashboard/*`. Si no hay usuario y la ruta es
  `/dashboard`, redirige a `/`. Es protección **solo de cliente** (UX), no de datos: la seguridad
  real recae 100% en las reglas de Firestore/Storage.
- ⚠️ En el `catch` y tras 5 reintentos sin perfil, hace `setStatus("authenticated")` "para no
  bloquear al usuario". Degrada de forma abierta (fail-open) a nivel de UI.

## 2. Reglas de Firestore (`firestore.rules`)

Helpers: `isAuthenticated()`, `isOwner(userId)`.

> **Actualizado (rama `fix/system-hardening`).** Cambios aplicados marcados con ✅. Ver `CHANGELOG_FIXES.md`.

| Colección | read | write | Estado / Riesgo |
|---|---|---|---|
| `users/{uid}` | owner | owner | ⚠️ Un reclutador **no puede leer** perfiles de candidatos (el blueprint asume lectura pública para reclutadores). Pendiente de decisión de producto. |
| `user_skill_scores/{uid}` | owner | **`if false`** | ✅ **(B2)** El DNA es de solo lectura para el cliente; lo escribe el servidor con Admin SDK (`/api/line/submit`). Ya no es falsificable. |
| `user_roadmaps/{uid}` | owner | owner | OK para datos privados. |
| `assessment_attempts/{id}` | **owner** | **`if false`** | ✅ **(B8/B2)** Lista solo del dueño; creación solo en servidor (Admin). |
| `line_sessions/{id}` | — | — (`if false`) | ✅ Server-only. Guarda la clave de respuestas de una simulación. Solo Admin. |
| `job_answer_keys/{jobId}` | — | — (`if false`) | ✅ Server-only. Clave de respuestas de la prueba de una vacante. Solo Admin. |
| `jobs/{jobId}` | público | **owner (`createdBy`)** | ✅ **(B1)** El reclutador dueño crea/edita; sin borrado; sin reasignar `createdBy`. ✅ `assessmentQuestions` ahora se guarda **sin `correctIndex`**. |
| `questions/{qId}` | autenticado | `if false` | ⚠️ Banco no usado activamente; contiene claves. Restringir si se usa. |
| `candidate_matches/{id}` | `userId==uid \|\| recruiterId==uid` | `if false` | ⚠️ Regla usa `recruiterId`, campo inexistente; sin escritor → inerte (pendiente A4). |
| `core/{uid}` | — sin regla — | — sin regla — | ✅ Resuelto: el módulo `core` roto fue eliminado (el CORE real es `user_skill_scores`). |

**Deny-by-default:** cualquier colección sin `match` explícito queda denegada (correcto), pero varias
partes del código asumen colecciones sin regla (`core`).

## 3. Reglas de Storage (`storage.rules`) — ✅ actualizado (B7)

```
/users/{userId}/{allPaths=**}
  read:  if request.auth != null                       // ✅ ya no es público
  write: if request.auth != null && request.auth.uid == userId
         && request.resource.size < 5 * 1024 * 1024     // ✅ límite de 5 MB
```
- ✅ Lectura restringida a usuarios autenticados (antes era pública para cualquiera).
- ✅ Escritura del dueño con límite de tamaño (5 MB).
- ⚠️ Aún sin validación de `contentType`. `uploadFile` (`src/lib/firebase/storage.ts`) tampoco valida
  tipo en cliente. Añadir si se habilitan subidas de archivos sensibles (CVs, etc.).

## 4. Secretos y configuración

- **Config web de Firebase hardcodeada** en `src/lib/firebase/client.ts` (apiKey, appId, etc.).
  Esto es aceptable para Firebase web (no es secreto), pero **la seguridad depende enteramente de las
  reglas** — que hoy tienen agujeros (arriba).
- **API Key de Google AI (Gemini):** los flows Genkit (`'use server'`) requieren credencial de
  `@genkit-ai/google-genai` en el **servidor**. No está en el repo (correcto: `.env` está en `.gitignore`),
  pero **`apphosting.yaml` no declara ninguna variable/secreto** → en producción App Hosting los flows
  de IA fallarán salvo que se configure el secreto (`GEMINI_API_KEY`/`GOOGLE_API_KEY`) en el backend.
- `next.config.ts` fija `typescript.ignoreBuildErrors: true` y `eslint.ignoreDuringBuilds: true`
  → 🔴 se puede desplegar código con errores de tipos/lint. Riesgo de seguridad y calidad.

## 5. Integridad del producto — ✅ resuelto (B2)

El valor central de NEXTAPE es el **"DNA técnico verificado"**. La integridad está garantizada por una
**capa de confianza en servidor** (`src/app/api/*` + Admin SDK):

1. **Generación en servidor**: las preguntas se generan en `/api/line/start` y se guarda la clave en
   `line_sessions` (server-only). Al cliente llegan como `PublicQuestion` (**sin `correctIndex`**).
2. **Corrección en servidor**: `/api/line/submit` corrige contra la clave y escribe el DNA/intento con
   Admin SDK. El cliente no puede escribir `user_skill_scores` (`write:false`).
3. **Autenticación**: los route handlers verifican el Firebase ID token (`verifyRequestUid`); el cliente
   lo adjunta con `apiPost`. No se confía en ningún `uid` del body.
4. **Vacantes**: `/api/jobs/assessment` guarda la clave en `job_answer_keys` (server-only) y solo las
   preguntas públicas (sin clave) en el doc `jobs`.

> Resultado: el DNA **no es falsificable desde el cliente** y las respuestas correctas nunca salen al
> navegador. Requisito operativo: credenciales del Admin SDK (ADC o `FIREBASE_SERVICE_ACCOUNT`) y la
> API key de Gemini configuradas en el servidor. Ver `docs/PRODUCTION_READINESS.md`.

## 6. Checklist de seguridad antes de producción

- [ ] Mover cálculo y persistencia de scores a servidor (Admin SDK); `user_skill_scores` write `if false` para clientes.
- [ ] No enviar `correctIndex` al cliente; validar respuestas en servidor.
- [ ] Corregir `jobs` write: permitir a `role == recruiter` dueño (`createdBy`), o mover a Cloud Function.
- [ ] `assessment_attempts` list: filtrar por `userId == request.auth.uid`.
- [ ] Storage: restringir lectura; validar `contentType` y tamaño.
- [ ] Verificar el `role` (evitar auto-asignación de `recruiter` sin validación).
- [ ] Unificar `projectId` (client vs `.firebaserc`) y confirmar a qué proyecto se despliegan las reglas.
- [ ] Configurar secreto de Gemini en App Hosting.
- [ ] Quitar `ignoreBuildErrors`/`ignoreDuringBuilds` antes de release.
- [ ] Eliminar la colección/servicio `core` roto o crear su regla.
