# NEXTAPE — Índice de Documentación

Documentación técnica del sistema, generada como base para **harness engineering** (contexto para
agentes de IA + humanos). Mantener actualizada cuando cambie el código.

## Documentos

| Documento | Contenido |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Visión global: stack, patrón (monolito modular), estructura de carpetas, rutas, journeys, comandos. **Empieza aquí.** |
| [DATABASE.md](./DATABASE.md) | Modelo de datos Firestore: colecciones, esquemas, relaciones, índices, reglas de negocio de datos. |
| [SECURITY.md](./SECURITY.md) | Auth, reglas de Firestore/Storage, secretos, superficie de ataque y checklist de seguridad. |
| [BACKEND_AI.md](./BACKEND_AI.md) | Server actions, servicios y flows de Genkit/Gemini. Frontera cliente/servidor. |
| [FRONTEND.md](./FRONTEND.md) | Rutas, layout/navegación, sistema de diseño, estado, código muerto, bugs de UI. |
| [TECH_DEBT.md](./TECH_DEBT.md) | Backlog consolidado de inconsistencias/bugs por prioridad (🔴🟠🟡). |
| [PRODUCTION_READINESS.md](./PRODUCTION_READINESS.md) | Checklist por fases para llevar a producción. |
| [blueprint.md](./blueprint.md) | Blueprint original del equipo (**visión/intención**). ⚠️ Difiere del código en varios puntos; el código manda. |

## Cómo usar esta documentación

- **Fuente de verdad = el código.** Los docs describen el estado real; donde el código y el
  `blueprint.md` discrepan, se marca con ⚠️ y se registra en `TECH_DEBT.md`.
- Los **agentes especializados** (`.claude/agents/`) y las **reglas absolutas** (`/CLAUDE.md`) se apoyan
  en estos documentos. Si cambias arquitectura, datos o seguridad, **actualiza el doc correspondiente**.
- Antes de un cambio grande: lee ARCHITECTURE + el doc del área + los ítems relevantes de TECH_DEBT.
