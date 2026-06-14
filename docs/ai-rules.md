# NEXTAPE — Reglas para IA generadora de código

> Aplica a Firebase Studio, Claude, Cursor, Copilot o cualquier agente de IA.

---

## Antes de generar cualquier código

Lee en orden:
1. `docs/AI_CONTEXT.md`
2. `docs/database-v1.md`
3. `docs/business-rules.md`

No generes nada que contradiga esos documentos.

---

## Restricciones absolutas

1. No crear `page.tsx` fuera de `src/app/dashboard/` o `src/app/auth/`
2. No usar route groups `(carpeta)` — causan colisión de rutas en Next.js
3. No poner lógica de negocio en `page.tsx` ni en `components/`
4. No consultar Firestore desde `components/` — solo desde `features/*/services/`
5. No modificar `user_skill_scores` fuera de `features/assessments/services/scoring.service.ts`
6. No usar `any` en TypeScript
7. No usar `localStorage` ni `sessionStorage`
8. No generar preguntas de evaluación que se publiquen sin el campo `approved: true`
9. No implementar lógica de IA en el Compatibility Engine — es determinístico
10. No renombrar el módulo CORE a "digital-twin" ni en carpetas ni en colecciones Firestore

---

## Prompt de inicio de sesión recomendado

```
Lee docs/AI_CONTEXT.md y úsalo como fuente de verdad para todo el proyecto.
No generes código que viole ninguna regla definida en ese archivo.
```

---

*Versión: 1.0 — Junio 2025*
