# Agentes especializados — NEXTAPE

Agentes de Claude Code (harness engineering) por área del sistema. Cada uno arranca con el contexto de
`docs/` y las reglas absolutas de `/CLAUDE.md`. Se invocan con la herramienta Agent (subagentes) o
delegando explícitamente.

| Agente | Área | Edita | Cuándo usarlo |
|---|---|---|---|
| [`frontend-engineer`](./frontend-engineer.md) | UI / Next.js / React / Tailwind | `src/app`, `src/components`, `src/hooks` | Pantallas del dashboard, componentes, formularios, diseño. |
| [`backend-ai-engineer`](./backend-ai-engineer.md) | Servicios + IA | `src/services`, `src/ai`, `src/lib/firebase` | Lógica de datos, server actions, flows de Genkit/Gemini. |
| [`database-architect`](./database-architect.md) | Modelo de datos | `src/types`, `src/services`, `docs/DATABASE.md` | Colecciones/campos, esquemas, índices, migraciones. |
| [`security-auditor`](./security-auditor.md) | Seguridad e integridad | `firestore.rules`, `storage.rules` (único autorizado) | Reglas, auth, integridad del DNA, revisión de riesgos. |
| [`ai-flow-reviewer`](./ai-flow-reviewer.md) | Calidad de IA | `src/ai` (solo) | Revisar/mejorar prompts, flows, structured output, coste. |
| [`code-reviewer`](./code-reviewer.md) | Revisión transversal | — (read-only) | Revisar un cambio/PR contra reglas y deuda antes de commit. |
| [`devops-firebase`](./devops-firebase.md) | Infra / despliegue | configs, `apphosting.yaml`, CI | Build, secretos, proyectos Firebase, despliegue de reglas. |
| [`qa-test-engineer`](./qa-test-engineer.md) | Calidad / tests | tests, config de test | Añadir cobertura (reglas/servicios/flows/UI), verificar flujos. |

## Convenciones entre agentes
- **`security-auditor` es el único** que modifica `*.rules`. Otros agentes que necesiten un cambio de
  reglas abren un ítem y delegan.
- Cambios de **datos** → `database-architect` actualiza tipos + `docs/DATABASE.md`.
- Cambios de **infra/despliegue** → `devops-firebase`.
- Antes de cerrar cualquier cambio de código → `code-reviewer` (y `npm run typecheck`/`lint`).
- Todos: si cambias arquitectura/datos/seguridad/IA/frontend, **actualiza el `.md` de `docs/`** correspondiente
  y registra deuda nueva en `docs/TECH_DEBT.md`.
