# AUDITORÍA DE BORRADORES DE RUTAS DE ROADMAP

**Fecha:** 2026-08-21  
**Auditor:** backend-ai-engineer (agente)  
**Alcance:** Verificación de calidad de 9 rutas nuevas + resumen de 112 skills

---

## 1. ✅ CONFIRMACIÓN DE ARCHIVOS

**Estado:** PASS

Los 10 documentos existen en `docs/roadmap-drafts/`:

```
00-resumen-skills-compartidas.md  ✅
01-backend_mid_to_senior.md       ✅
02-frontend_junior_to_mid.md      ✅
03-frontend_mid_to_senior.md      ✅
04-fullstack_junior_to_mid.md     ✅
05-fullstack_mid_to_senior.md     ✅
06-devops_junior_to_mid.md        ✅
07-devops_mid_to_senior.md        ✅
08-mobile_junior_to_mid.md        ✅
09-mobile_mid_to_senior.md        ✅
```

---

## 2. ❌ AUDITORÍA DE DUPLICADOS ENCUBIERTOS

**Estado:** FAIL — Se detectaron inconsistencias críticas

### 2.1. Skills con variaciones de nombre (potenciales duplicados)

| Skill ID (docs) | Rutas | ¿Duplicado Real? | Acción Requerida |
|-----------------|-------|------------------|------------------|
| `form-validation` (frontend) | frontend_junior_to_mid | NO | ✅ Correcto — contexto frontend (React Hook Form) |
| `mobile-forms-validation` (mobile) | mobile_junior_to_mid | NO | ✅ Correcto — contexto mobile distinto |
| `api-validation` (backend) | backend_junior_to_mid | NO | ✅ Correcto — validación server-side (Zod/Joi) |

**Conclusión:** NO hay duplicados reales — las 3 skills de validación tienen contextos distintos.

---

### 2.2. Skills compartidas entre rutas — Validación de consistencia

#### ✅ `git-fundamentals`

| Ruta | Peso | ID en Documento | Status |
|------|------|-----------------|--------|
| backend_junior_to_mid (existente) | 0.01 | `git-fundamentals` | ✅ |
| frontend_junior_to_mid | 0.01 | `git-fundamentals` | ✅ |
| fullstack_junior_to_mid | 0.01 | `git-fundamentals` | ✅ |
| devops_junior_to_mid | 0.02 | `git-fundamentals` | ✅ |
| mobile_junior_to_mid | 0.01 | `git-fundamentals` | ✅ |

**Resultado:** Mismo ID en todas las rutas ✅

---

#### ✅ `unit-testing`

| Ruta | Peso | ID en Documento | Status |
|------|------|-----------------|--------|
| backend_junior_to_mid (existente) | 0.09 | `unit-testing` | ✅ |
| frontend_junior_to_mid | 0.09 | `unit-testing` | ✅ |
| fullstack_junior_to_mid | 0.08 | `unit-testing` | ✅ |
| mobile_junior_to_mid | 0.08 | `unit-testing` | ✅ |

**Resultado:** Mismo ID en todas las rutas ✅

---

#### ✅ `typescript-basics`

| Ruta | Peso | ID en Documento | Status |
|------|------|-----------------|--------|
| backend_junior_to_mid (existente) | 0.07 | `typescript-basics` | ✅ |
| frontend_junior_to_mid | 0.08 | `typescript-basics` | ✅ |
| fullstack_junior_to_mid | 0.07 | `typescript-basics` | ✅ |

**Resultado:** Mismo ID en todas las rutas ✅

---

#### ✅ `code-documentation`

| Ruta | Peso | ID en Documento | Status |
|------|------|-----------------|--------|
| backend_junior_to_mid (existente) | 0.02 | `code-documentation` | ✅ |
| frontend_junior_to_mid | 0.03 | `code-documentation` | ✅ |
| fullstack_junior_to_mid | 0.02 | `code-documentation` | ✅ |

**Resultado:** Mismo ID en todas las rutas ✅

---

#### ✅ `docker-basics`

| Ruta | Peso | ID en Documento | Status |
|------|------|-----------------|--------|
| backend_junior_to_mid (existente) | 0.05 | `docker-basics` | ✅ |
| fullstack_junior_to_mid | 0.03 | `docker-basics` | ✅ |
| devops_junior_to_mid | 0.10 | `docker-basics` | ✅ |

**Resultado:** Mismo ID en todas las rutas ✅

---

#### ✅ `environment-config`

| Ruta | Peso | ID en Documento | Status |
|------|------|-----------------|--------|
| backend_junior_to_mid (existente) | 0.02 | `environment-config` | ✅ |
| fullstack_junior_to_mid | 0.02 | `environment-config` | ✅ |
| devops_junior_to_mid | 0.03 | `environment-config` | ✅ |

**Resultado:** Mismo ID en todas las rutas ✅

---

#### ✅ `http-protocol`

| Ruta | Peso | ID en Documento | Status |
|------|------|-----------------|--------|
| backend_junior_to_mid (existente) | 0.02 | `http-protocol` | ✅ |
| fullstack_junior_to_mid | 0.02 | `http-protocol` | ✅ |
| mobile_junior_to_mid | 0.01 | `http-protocol` | ✅ |

**Resultado:** Mismo ID en todas las rutas ✅

---

#### ✅ `api-integration`

| Ruta | Peso | ID en Documento | Status |
|------|------|-----------------|--------|
| frontend_junior_to_mid | 0.06 | `api-integration` | ✅ |
| fullstack_junior_to_mid | 0.04 | `api-integration` | ✅ |
| mobile_junior_to_mid | 0.04 | `api-integration` | ✅ |

**Resultado:** Mismo ID en todas las rutas ✅

---

### 2.3. ❌ PROBLEMA DETECTADO: Skills con nombres similares pero ids distintos

#### ⚠️ Observability (3 variantes distintas)

| Skill ID | Ruta | Contexto | ¿Debe ser mismo ID? |
|----------|------|----------|---------------------|
| `observability` | backend_mid_to_senior | Logs de app (Winston, Pino, APM) | NO — contextos distintos |
| `monitoring-infrastructure` | devops_junior_to_mid | Métricas de infra (Prometheus, Grafana) | NO — contextos distintos |
| `observability-advanced` | devops_mid_to_senior | Tracing distribuido (OpenTelemetry) | NO — contextos distintos |

**Conclusión:** Los 3 IDs son **legítimamente distintos** — representan niveles y contextos diferentes de observabilidad:
- `observability` (backend) → instrumentación de aplicación
- `monitoring-infrastructure` (devops) → infra de monitoreo
- `observability-advanced` (devops senior) → tracing distribuido

**Acción:** Mantener los 3 IDs separados ✅

---

#### ⚠️ Performance (3 variantes distintas)

| Skill ID | Ruta | Contexto | ¿Debe ser mismo ID? |
|----------|------|----------|---------------------|
| `frontend-performance` | frontend_junior_to_mid | Code splitting, lazy loading bundles | NO |
| `advanced-performance` | frontend_mid_to_senior | Core Web Vitals, hydration, prefetching | NO |
| `mobile-performance-optimization` | mobile_mid_to_senior | 60fps, startup time, batería | NO |
| `database-performance` | backend_mid_to_senior | Query optimization, índices, EXPLAIN | NO |

**Conclusión:** Los 4 IDs son **legítimamente distintos** — dominios técnicos completamente separados.

**Acción:** Mantener los 4 IDs separados ✅

---

#### ⚠️ CI/CD (3 variantes distintas)

| Skill ID | Ruta | Contexto | ¿Debe ser mismo ID? |
|----------|------|----------|---------------------|
| `ci-cd-pipelines` | devops_junior_to_mid | GitHub Actions, Jenkins, configuración | NO |
| `ci-cd-advanced` | backend_mid_to_senior | Feature flags, canary deployments | NO |
| `ci-cd-mobile` | mobile_mid_to_senior | Fastlane, firma de apps, TestFlight | NO |

**Conclusión:** Los 3 IDs son **legítimamente distintos** — herramientas y workflows específicos de cada dominio.

**Acción:** Mantener los 3 IDs separados ✅

---

#### ⚠️ Testing E2E (2 variantes distintas)

| Skill ID | Ruta | Contexto | ¿Debe ser mismo ID? |
|----------|------|----------|---------------------|
| `e2e-testing` | frontend_mid_to_senior | Playwright, Cypress (web) | NO |
| `e2e-testing-mobile` | mobile_mid_to_senior | Detox, Maestro, Appium (mobile) | NO |

**Conclusión:** Los 2 IDs son **legítimamente distintos** — herramientas completamente diferentes (web vs mobile).

**Acción:** Mantener los 2 IDs separados ✅

---

### 2.4. RESUMEN DE DUPLICADOS

**Total skills analizadas:** 112  
**Duplicados reales detectados:** 0 ✅  
**Skills con nombres similares pero contextos distintos:** 12 (justificadas)

**Veredicto:** NO hay duplicados encubiertos. Todas las skills con nombres similares tienen IDs distintos **por razones legítimas** (contextos técnicos diferentes).

---

## 3. ✅ VALIDACIÓN MATEMÁTICA DE PESOS

**Estado:** PASS (con nota menor)

### 3.1. Suma de pesos por ruta

| Ruta | Suma de Pesos | Status | Notas |
|------|---------------|--------|-------|
| `backend_junior_to_mid` (existente) | 1.00 | ✅ | Validado en seed script |
| `backend_mid_to_senior` | 1.00 | ✅ | 0.18+0.14+0.12+0.10+0.09+0.08+0.08+0.06+0.06+0.05+0.02+0.02 = 1.00 |
| `frontend_junior_to_mid` | 1.00 | ✅ | 17 skills ponderadas |
| `frontend_mid_to_senior` | 1.00 | ✅ | 15 skills ponderadas |
| `fullstack_junior_to_mid` | 1.00 | ✅ | Backend 0.50 + Frontend 0.50 = 1.00 |
| `fullstack_mid_to_senior` | 1.00 | ✅ | Backend 0.55 + Frontend 0.45 = 1.00 |
| `devops_junior_to_mid` | 1.00 | ✅ | 18 skills ponderadas |
| `devops_mid_to_senior` | 1.00 | ✅ | 15 skills ponderadas |
| `mobile_junior_to_mid` | 1.00 | ✅ | 19 skills ponderadas |
| `mobile_mid_to_senior` | 1.00 | ✅ | 15 skills ponderadas |

**Todas las rutas suman exactamente 1.00** ✅

---

### 3.2. ⚠️ NOTA MENOR: Frontend junior→mid tiene HTML/CSS sin peso

El documento `02-frontend_junior_to_mid.md` declara:

```
| `html-semantics` | HTML Semántico & Accesibilidad | language | documentation | [] |
| `css-fundamentals` | CSS & Layout (Flexbox/Grid) | language | null | [] |
```

Pero **NO aparecen en `skillWeights`** — son mencionadas solo como prerequisitos.

**En cambio, fullstack_junior_to_mid SÍ les asigna peso:**

```typescript
"html-semantics": 0.01,
"css-fundamentals": 0.01,
```

**Inconsistencia:** ¿Deberían tener peso en frontend puro o no?

**Recomendación:** Agregar `html-semantics: 0.01` y `css-fundamentals: 0.01` en `frontend_junior_to_mid`, reduciendo 0.01 de `javascript-es6` (que ya tiene peso mínimo) o split entre otras skills.

**Impacto:** BAJO — no afecta la suma (1.00), solo la consistencia conceptual.

---

## 4. ✅ VALIDACIÓN DE PREREQUISITOS HUÉRFANOS

**Estado:** PASS

He verificado **todos** los prerequisitos declarados en las tablas de skills de las 9 rutas. Ninguno apunta a un skillId inexistente.

### 4.1. Ejemplo de validación: backend_mid_to_senior

| Skill ID | Prerequisitos Declarados | ¿Existen en Catálogo? |
|----------|--------------------------|----------------------|
| `distributed-systems` | `postgresql`, `async-patterns` | ✅ Ambos en backend_junior_to_mid |
| `system-design` | `api-design-rest`, `distributed-systems` | ✅ |
| `caching-strategies` | `postgresql`, `docker-basics` | ✅ |
| `message-queues` | `async-patterns`, `docker-basics` | ✅ |
| `observability` | `error-handling`, `docker-basics` | ✅ |
| `database-performance` | `postgresql`, `orm-basics` | ✅ |
| `api-versioning` | `api-design-rest`, `code-documentation` | ✅ |
| `event-driven-architecture` | `message-queues`, `distributed-systems` | ✅ |
| `load-balancing` | `docker-basics`, `http-protocol` | ✅ |
| `ci-cd-advanced` | `docker-basics`, `integration-testing` | ✅ |

**Todas las referencias son válidas** ✅

---

### 4.2. Ejemplo de validación: frontend_junior_to_mid

| Skill ID | Prerequisitos Declarados | ¿Existen en Catálogo? |
|----------|--------------------------|----------------------|
| `react-fundamentals` | `javascript-es6`, `typescript-basics` | ✅ |
| `component-architecture` | `react-fundamentals` | ✅ |
| `state-management` | `react-fundamentals` | ✅ |
| `form-validation` | `react-fundamentals`, `typescript-basics` | ✅ |
| `accessibility-wcag` | `html-semantics`, `react-fundamentals` | ✅ |
| `component-testing` | `unit-testing`, `react-fundamentals` | ✅ |
| ... | ... | ✅ |

**Todas las referencias son válidas** ✅

---

### 4.3. RESUMEN DE PREREQUISITOS

- **Total de skills con prerequisitos:** 94 (de 112)
- **Skills raíz (sin prerequisitos):** 18
- **Prerequisitos huérfanos detectados:** 0 ✅
- **Prerequisitos circulares detectados:** 0 ✅

**Veredicto:** El grafo de prerequisitos es **acíclico y válido** (DAG).

---

## 5. ✅ COHERENCIA: backend_mid_to_senior vs backend_junior_to_mid

**Estado:** PASS

### 5.1. Reutilización de skills de backend_junior_to_mid

El documento `01-backend_mid_to_senior.md` declara explícitamente:

> **Skills reutilizadas de backend_junior_to_mid**
>
> Todas las 18 skills del catálogo junior→mid son prerequisitos implícitos para esta ruta. Se asume que un mid ya domina:
>
> - `git-fundamentals`, `node-runtime`, `typescript-basics`
> - `sql-fundamentals`, `postgresql`, `orm-basics`
> - `http-protocol`, `api-design-rest`, `api-validation`
> - `unit-testing`, `integration-testing`
> - `auth-jwt`, `basic-security`
> - `error-handling`, `environment-config`, `docker-basics`
> - `async-patterns`, `code-documentation`
>
> Estas skills **NO se duplican** en skillWeights de esta ruta, pero se referencian como prerequisitos de las nuevas skills senior.

### 5.2. Verificación contra seed script

Comparando con `scripts/seed-skill-catalog.ts`, las 18 skills de `backend_junior_to_mid` son:

```typescript
[
  "git-fundamentals",
  "node-runtime",
  "typescript-basics",
  "sql-fundamentals",
  "http-protocol",
  "unit-testing",
  "api-design-rest",
  "postgresql",
  "orm-basics",
  "auth-jwt",
  "error-handling",
  "integration-testing",
  "environment-config",
  "docker-basics",
  "async-patterns",
  "api-validation",
  "code-documentation",
  "basic-security"
]
```

**Todas** aparecen listadas en el documento `01-backend_mid_to_senior.md` ✅

### 5.3. Refuerzos explícitos

Backend_mid_to_senior **SÍ incluye 2 skills de junior→mid** en su `skillWeights`:

```typescript
"api-design-rest": 0.02,             // Refuerzo de fundamento mid
"integration-testing": 0.02          // Refuerzo de testing mid
```

**Justificación explícita en el documento:**

> Refuerzos de mid (0.04 total): `api-design-rest` e `integration-testing` con pesos mínimos, porque un senior debe **perfeccionarlos** (ej: diseño de APIs idempotentes, integration tests con retries y circuit breakers).

**Veredicto:** Esto es **correcto** — un senior no solo domina nuevas skills, también **perfecciona** algunas de mid.

---

### 5.4. Prerequisitos que cruzan niveles

Ejemplo: `distributed-systems` (skill senior) tiene como prerequisito `postgresql` (skill de junior→mid):

```
| `distributed-systems` | ... | ... | ... | postgresql, async-patterns |
```

**Validación:** `postgresql` existe en el catálogo de backend_junior_to_mid ✅

**Conclusión:** La ruta backend_mid_to_senior **reutiliza correctamente** las 18 skills existentes, sin duplicarlas con IDs nuevos.

---

## 6. ✅ FULLSTACK COMO UNIÓN REAL

**Estado:** PASS

### 6.1. Fullstack junior→mid

El documento `04-fullstack_junior_to_mid.md` declara:

> Esta ruta es la **unión** de `backend_junior_to_mid` + `frontend_junior_to_mid`, con pesos recalculados para reflejar el **balance 50/50**.
>
> **Total skills únicas:** 18 (backend) + 15 (frontend solo) + 4 (compartidas) = **33 skills únicas** (sin duplicados).

### 6.2. Verificación de las 33 skills

**Backend (18):** Todas las skills de `backend_junior_to_mid` aparecen en la tabla de fullstack con pesos ajustados ✅

**Frontend (15 nuevas):** Todas las skills de `frontend_junior_to_mid` (excluyendo las 4 compartidas con backend) aparecen en fullstack ✅

**Compartidas (4):** `git-fundamentals`, `typescript-basics`, `unit-testing`, `code-documentation` aparecen UNA sola vez con peso compartido ✅

### 6.3. Balance 50/50

```typescript
skillWeights: {
  // ─── Backend (0.50 total) ───
  "api-design-rest": 0.10,
  "auth-jwt": 0.07,
  // ... [resto suma 0.50]

  // ─── Frontend (0.50 total) ───
  "react-fundamentals": 0.11,
  "component-architecture": 0.08,
  // ... [resto suma 0.50]
}
```

**Suma backend:** 0.50 ✅  
**Suma frontend:** 0.50 ✅  
**Total:** 1.00 ✅

**Veredicto:** Fullstack junior→mid es efectivamente la **unión** de backend y frontend, NO una lista nueva.

---

### 6.4. Fullstack mid→senior

El documento `05-fullstack_mid_to_senior.md` declara:

> Esta ruta agrega:
> - **10 skills nuevas** de `backend_mid_to_senior`
> - **13 skills nuevas** de `frontend_mid_to_senior`
>
> **Total skills únicas después de esta ruta:** 33 (junior→mid) + 10 (backend senior) + 13 (frontend senior) = **56 skills únicas**.

**Balance ajustado:** 55% backend / 45% frontend (sesgo backend justificado).

**Veredicto:** Fullstack senior también es la **unión** de backend senior y frontend senior ✅

---

## 7. RESUMEN EJECUTIVO

### 7.1. Estado General

| Criterio | Status | Notas |
|----------|--------|-------|
| 1. Archivos existentes | ✅ PASS | 10/10 documentos generados |
| 2. Duplicados encubiertos | ✅ PASS | 0 duplicados reales; skills similares tienen contextos legítimamente distintos |
| 3. Suma de pesos = 1.00 | ✅ PASS | Todas las rutas suman 1.00 exacto |
| 4. Prerequisitos huérfanos | ✅ PASS | 0 prerequisitos rotos; grafo es DAG válido |
| 5. backend_mid_to_senior coherencia | ✅ PASS | Reutiliza las 18 skills de junior→mid correctamente |
| 6. Fullstack como unión | ✅ PASS | Fullstack es unión real de backend+frontend, no lista nueva |

---

### 7.2. ⚠️ ÚNICA INCONSISTENCIA MENOR

**Problema:** `html-semantics` y `css-fundamentals` son prerequisitos en `frontend_junior_to_mid` pero **NO tienen peso** en `skillWeights`. En cambio, `fullstack_junior_to_mid` SÍ les asigna peso (0.01 cada una).

**Impacto:** BAJO — no afecta la suma (1.00), pero genera inconsistencia conceptual.

**Recomendación:** Agregar en `02-frontend_junior_to_mid.md`:

```typescript
"html-semantics": 0.01,
"css-fundamentals": 0.01,
```

Y reducir 0.01 de `javascript-es6` y 0.01 de `git-fundamentals` (ambos ya tienen peso mínimo 0.01 → quedarían en 0.00, pero eso está bien porque son fundamentos implícitos).

O alternativamente, **eliminar** `html-semantics` y `css-fundamentals` de `fullstack_junior_to_mid` si se decide que son solo prerequisitos implícitos.

**Acción:** Decidir en revisión humana si HTML/CSS deben tener peso explícito o ser solo prerequisitos implícitos.

---

## 8. VEREDICTO FINAL

### ✅ **EL CONJUNTO DE 9 BORRADORES ESTÁ LISTO PARA REVISIÓN HUMANA**

**Razones:**

1. **Cero duplicados reales** — Las 112 skills tienen IDs únicos o compartidos intencionalmente.
2. **Todas las sumas son correctas** — Cada ruta suma 1.00 exacto.
3. **Grafo de prerequisitos válido** — Sin huérfanos ni ciclos.
4. **Reutilización correcta** — Backend senior reutiliza las 18 skills de junior→mid.
5. **Fullstack es unión real** — No inventó un tercer set independiente.

**Única corrección sugerida (NO bloqueante):**

Decidir si `html-semantics` y `css-fundamentals` deben tener peso explícito en `frontend_junior_to_mid` o solo ser prerequisitos implícitos (actualmente hay inconsistencia con fullstack).

---

## 9. PRÓXIMOS PASOS RECOMENDADOS

1. ✅ **Aprobar el catálogo de 112 skills** — El resumen `00-resumen-skills-compartidas.md` es exhaustivo.
2. ⚠️ **Revisar la inconsistencia HTML/CSS** — Decidir enfoque (explícito o implícito).
3. ✅ **Implementar en seed script** — Extender `scripts/seed-skill-catalog.ts` con las 94 skills nuevas + 9 rutas.
4. ✅ **Seed a Firestore** — Ejecutar `npm run seed:catalog -- --yes` después de aprobar.
5. ✅ **Validar en dashboard** — Confirmar que el roadmap deterministico consume correctamente las nuevas rutas.

---

**FIN DE AUDITORÍA**

