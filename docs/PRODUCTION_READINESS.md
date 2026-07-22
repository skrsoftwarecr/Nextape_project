# NEXTAPE — Production Readiness

> Checklist para llevar la rama `migration` a producción. Ordenado por fase.
> Referencias: [SECURITY](./SECURITY.md), [TECH_DEBT](./TECH_DEBT.md) (IDs B/A/C/R), [CHANGELOG_FIXES](./CHANGELOG_FIXES.md).

## Estado (rama `fix/system-hardening`)
- ✅ **Fase 0 (higiene)** completa. ✅ **Fase 4 (config/build)** en su mayoría: `ignoreBuildErrors`
  eliminado, build cross-platform, config por env. ✅ Parte de **Fase 1/2** (correcciones funcionales,
  reglas `jobs`/`attempts`/`storage`).
- ✅ **Verificado:** `npm run typecheck` limpio y `npm run build` correcto (16/16 rutas, con type-check activo).
- ⏳ **Falta lo pesado (requiere decisión/infra):** scoring/DNA en servidor (integridad, B2), proyecto
  Firebase canónico + `GROQ_API_KEY` (B3/B4), motor de matching (A4), **ESLint + CI**, y **tests**.

## Fase 0 — Higiene del repo (rápido, sin riesgo)
- [ ] Borrar `estructura.txt`, `tailwing.config.ts`, `.modified` y añadir patrones a `.gitignore` (R1–R3).
- [ ] Borrar rutas top-level muertas y `dashboard/digital-twin` obsoleto (R4, R5).
- [ ] Decidir sobre el stack 3D huérfano (`three`/`laptop.glb`): eliminar o implementar (R6).
- [ ] Eliminar stubs de `src/features/*` sin uso o completar la migración a features (A3).

## Fase 1 — Integridad (núcleo del producto) 🔴
> Sin esto, el "DNA verificado" no es confiable y el flujo de reclutador no funciona.
- [ ] Mover **scoring de The LINE al servidor**: validar respuestas contra un banco cuyo `correctIndex`
      **no** se envía al cliente (B2).
- [ ] Escribir `user_skill_scores` **solo desde servidor** (Admin SDK); regla `write: if false` para clientes (B2).
- [ ] Persistir `assessment_attempts` por intento e implementar el promedio histórico si se mantiene esa promesa (A5, A6).
- [ ] Habilitar creación de `jobs` para reclutadores (regla por `createdBy` o Cloud Function) (B1).
- [ ] Definir o eliminar el flujo `candidate_matches` (matching en servidor) (A4).

## Fase 2 — Seguridad 🔴
- [ ] Cerrar `assessment_attempts` `list` por `userId` (B8).
- [ ] Restringir Storage: lectura no pública, validación de tipo/tamaño (B7).
- [ ] Verificar el `role` (evitar auto-asignación libre de `recruiter`).
- [ ] Revisar visibilidad de `users` para reclutadores según el producto (C2).
- [ ] Auditoría de reglas con tests (emulador) antes de desplegar.

## Fase 3 — Configuración e infraestructura 🔴
- [ ] Unificar `projectId` (client vs `.firebaserc`) y mover config Firebase a `.env` (`NEXT_PUBLIC_*`) (B3).
- [ ] Configurar `GROQ_API_KEY` en Netlify (B4).
- [ ] Quitar `ignoreBuildErrors`/`ignoreDuringBuilds`; arreglar todos los errores de `npm run typecheck` y `npm run lint` (B5).
- [ ] Registrar flows en `src/ai/dev.ts`.
- [ ] Revisar `apphosting.yaml` (`maxInstances: 1` — evaluar para carga real).

## Fase 4 — Corrección funcional 🟠
- [ ] Arreglar imports faltantes en `dashboard/vacancies/page.tsx` (B6).
- [ ] Crear página `/dashboard/candidates` o quitar el enlace (nav recruiter).
- [ ] Unificar función de "grade" entre `core` y `profile` (C3).
- [ ] Guard en The LINE cuando `questions` llega vacío.
- [ ] Consolidar los dos `UserProfile` en uno (`user.types.ts`) (A1).
- [ ] Reemplazar datos hardcodeados por reales o marcarlos como demo (C4).

## Fase 5 — Calidad y operación 🟡
- [ ] Añadir **tests** (no hay ninguno): reglas Firestore (emulador), servicios, flows IA, componentes clave.
- [ ] Configurar **CI**: `typecheck` + `lint` + build en cada PR.
- [ ] Manejo de errores y estados de carga consistentes (evitar fail-open silencioso del `AuthGuard`).
- [ ] Observabilidad: logging/monitorización de errores (p.ej. errores de flows IA).
- [ ] Accesibilidad y responsive review; dark mode (decidir si se soporta: hoy hay variables sin toggle).
- [ ] Definir estrategia de `firestore.indexes.json` para consultas futuras.

## Definición de "listo para producción"
1. Todos los ítems 🔴 (Fases 1–3) resueltos y verificados.
2. `npm run typecheck` y `npm run lint` en verde, build sin flags de "ignore".
3. Reglas de seguridad con tests que prueben que un usuario no puede falsificar su DNA ni leer datos ajenos.
4. Un único proyecto Firebase con secretos configurados.
5. Los flujos de developer y recruiter completos de extremo a extremo en un entorno de staging.
