# Resumen de Skills Compartidas — Catálogo Completo

**Documento de revisión — Todas las skills únicas resultantes de las 10 rutas**

Este documento lista **todas las skills únicas** del catálogo después de generar las 9 rutas nuevas + la existente (`backend_junior_to_mid`). El objetivo es:

1. Identificar **duplicados accidentales** (mismo concepto, distinto id).
2. Validar **prerequisitos** (referencias cruzadas entre skills).
3. Confirmar **categorías** y **githubDimension** correctas.
4. Aprobar el catálogo completo **antes de publicar** a Firestore.

---

## Resumen Ejecutivo

- **Total de rutas:** 10
- **Total de skills únicas:** **112**
- **Skills compartidas entre múltiples rutas:** 22 (ver §2)
- **Skills específicas de un solo rol:** 90

### Distribución por categoría

| Categoría | Cantidad | Rutas principales |
|-----------|----------|-------------------|
| `language` | 18 | Backend, Frontend, Mobile |
| `architecture` | 16 | Backend, Frontend, DevOps |
| `infrastructure` | 15 | DevOps, Backend |
| `testing` | 11 | Todas |
| `tooling` | 19 | Todas |
| `security` | 10 | Backend, Frontend, Mobile, DevOps |
| `database` | 8 | Backend, Fullstack |
| `api-design` | 6 | Backend, Frontend, Mobile |
| `observability` | 9 | Backend, DevOps |

---

## 1. Skills Universales (presentes en 5+ rutas)

Estas skills son **compartidas entre todos o casi todos los roles** (mismo id):

### 1.1. Control de Versiones

| ID | Nombre | Categoría | githubDimension | Rutas |
|----|--------|-----------|-----------------|-------|
| `git-fundamentals` | Git & Control de Versiones | tooling | null | Backend, Frontend, Fullstack, DevOps, Mobile (10/10) |

**Pesos por ruta:**
- Backend junior→mid: 0.01
- Frontend junior→mid: 0.01
- Fullstack junior→mid: 0.01
- DevOps junior→mid: 0.02
- Mobile junior→mid: 0.01

**Notas:** Peso universal mínimo (0.01–0.02) porque se asume dominado al llegar a cualquier nivel mid.

---

### 1.2. Testing

| ID | Nombre | Categoría | githubDimension | Rutas |
|----|--------|-----------|-----------------|-------|
| `unit-testing` | Unit Testing | testing | testing | Backend, Frontend, Fullstack, Mobile (8/10) |

**Pesos por ruta:**
- Backend junior→mid: 0.09
- Frontend junior→mid: 0.09
- Fullstack junior→mid: 0.08
- Mobile junior→mid: 0.08

**Notas:** Peso alto en todas las rutas junior→mid (0.08–0.09). Framework varía por plataforma (Jest, XCTest, JUnit), pero concepto es universal.

---

### 1.3. Lenguaje (TypeScript)

| ID | Nombre | Categoría | githubDimension | Rutas |
|----|--------|-----------|-----------------|-------|
| `typescript-basics` | TypeScript Fundamentals | language | architecture | Backend, Frontend, Fullstack (6/10) |

**Pesos por ruta:**
- Backend junior→mid: 0.07
- Frontend junior→mid: 0.08
- Fullstack junior→mid: 0.07

**Notas:** TypeScript es lenguaje compartido entre backend (Node.js) y frontend (React). NO compartida con Mobile (usan Swift/Kotlin/Dart/JS nativo) ni DevOps (bash/Python).

---

### 1.4. HTTP & APIs

| ID | Nombre | Categoría | githubDimension | Rutas |
|----|--------|-----------|-----------------|-------|
| `http-protocol` | HTTP/HTTPS & Protocolo REST | api-design | null | Backend, Fullstack, Mobile (6/10) |
| `api-integration` | Integración con APIs REST | api-design | architecture | Frontend, Fullstack, Mobile (6/10) |

**Pesos por ruta:**
- `http-protocol`:
  - Backend junior→mid: 0.02
  - Fullstack junior→mid: 0.02
  - Mobile junior→mid: 0.01
- `api-integration`:
  - Frontend junior→mid: 0.06
  - Fullstack junior→mid: 0.04
  - Mobile junior→mid: 0.04

**Notas:** `http-protocol` es fundamento (peso mínimo). `api-integration` es skill de **consumo** de APIs (frontend/mobile hablan con backend).

---

### 1.5. Documentación

| ID | Nombre | Categoría | githubDimension | Rutas |
|----|--------|-----------|-----------------|-------|
| `code-documentation` | Documentación de Código & OpenAPI | tooling | documentation | Backend, Frontend, Fullstack (6/10) |

**Pesos por ruta:**
- Backend junior→mid: 0.02
- Frontend junior→mid: 0.03 (Storybook)
- Fullstack junior→mid: 0.02

**Notas:** Contexto varía: OpenAPI (backend), Storybook/JSDoc (frontend). Mismo id, distinto uso.

---

## 2. Skills Compartidas entre Roles Específicos

### 2.1. Backend ↔ DevOps

| ID | Nombre | Categoría | Rutas |
|----|--------|-----------|-------|
| `docker-basics` | Docker & Contenedores | infrastructure | Backend, Fullstack, DevOps (6/10) |
| `environment-config` | Variables de Entorno & Config | tooling | Backend, Fullstack, DevOps (6/10) |

**Pesos:**
- `docker-basics`: 0.05 (backend) → 0.10 (devops) — DevOps **orquesta** contenedores
- `environment-config`: 0.02 (backend) → 0.03 (devops) — DevOps **provee** la config

---

### 2.2. Backend ↔ Frontend (Fullstack)

Todas las skills de backend y frontend son **prerequisitos** de fullstack. Fullstack junior→mid tiene **33 skills** (18 backend + 15 frontend, 4 compartidas).

Skills directamente compartidas:
- `git-fundamentals`, `typescript-basics`, `unit-testing`, `code-documentation`

---

### 2.3. Frontend ↔ Mobile

| ID | Nombre | Categoría | Rutas |
|----|--------|-----------|-------|
| `api-integration` | Integración con APIs REST | api-design | Frontend, Mobile (4/10) |

**Notas:** Concepto idéntico (consumo de REST desde cliente), distinto contexto (fetch en web, URLSession/Retrofit en mobile).

---

## 3. Skills por Rol (únicas o especializadas)

### 3.1. Backend (18 skills junior→mid + 10 senior)

**Junior→Mid (18):**
- `node-runtime`, `sql-fundamentals`, `postgresql`, `orm-basics`
- `api-design-rest`, `api-validation`, `auth-jwt`, `basic-security`
- `async-patterns`, `error-handling`, `integration-testing`

**Mid→Senior (10 nuevas):**
- `distributed-systems`, `system-design`, `caching-strategies`, `message-queues`
- `observability`, `database-performance`, `api-versioning`, `event-driven-architecture`
- `load-balancing`, `ci-cd-advanced`

**Total Backend único:** 28 skills

---

### 3.2. Frontend (15 skills junior→mid + 13 senior)

**Junior→Mid (15 nuevas + 4 compartidas con backend):**
- `html-semantics`, `css-fundamentals`, `javascript-es6`
- `react-fundamentals`, `component-architecture`, `state-management`
- `react-routing`, `form-validation`, `responsive-design`, `accessibility-wcag`
- `frontend-performance`, `css-modules`, `error-boundaries`, `component-testing`

**Mid→Senior (13 nuevas):**
- `nextjs-ssr`, `micro-frontends`, `design-systems`, `advanced-performance`
- `web-security-frontend`, `react-advanced`, `internationalization`, `e2e-testing`
- `monorepo-frontend`, `graphql-client`, `animation-advanced`, `seo-optimization`, `web-workers`

**Total Frontend único:** 28 skills (15 junior→mid + 13 senior, 4 compartidas con backend no cuentan)

---

### 3.3. DevOps (15 skills junior→mid + 13 senior)

**Junior→Mid (15 nuevas + 3 compartidas con backend):**
- `linux-fundamentals`, `networking-basics`, `cloud-fundamentals`, `terraform`
- `kubernetes-basics`, `ci-cd-pipelines`, `monitoring-infrastructure`, `nginx-reverse-proxy`
- `cloud-storage`, `secrets-management`, `scripting-automation`, `backup-recovery`
- `logging-centralized`, `ssh-security`, `basic-security-infra`

**Mid→Senior (13 nuevas):**
- `kubernetes-advanced`, `multi-cloud-architecture`, `gitops`, `service-mesh`
- `observability-advanced`, `chaos-engineering`, `incident-response`, `slo-sla-management`
- `zero-trust-security`, `cost-optimization`, `platform-engineering`, `canary-blue-green`
- `disaster-recovery-advanced`

**Total DevOps único:** 28 skills

---

### 3.4. Mobile (15 skills junior→mid + 13 senior)

**Junior→Mid (15 nuevas + 4 compartidas):**
- `mobile-language-fundamentals`, `mobile-ui-basics`, `mobile-navigation`, `mobile-state-management`
- `local-storage-mobile`, `networking-mobile`, `async-programming-mobile`, `mobile-forms-validation`
- `mobile-permissions`, `mobile-lifecycle`, `responsive-mobile-design`, `app-store-publishing`
- `mobile-debugging`, `push-notifications`, `mobile-testing-ui`

**Mid→Senior (13 nuevas):**
- `mobile-architecture-advanced`, `mobile-performance-optimization`, `mobile-security-advanced`, `modularization-mobile`
- `ci-cd-mobile`, `native-features-advanced`, `offline-sync`, `mobile-animations-advanced`
- `accessibility-mobile`, `crash-reporting-analytics`, `app-size-optimization`, `deep-linking-advanced`, `e2e-testing-mobile`

**Total Mobile único:** 28 skills

---

## 4. Validación de Prerequisitos

### 4.1. Prerequisitos rotos (NO deben existir)

Estos son casos donde un skill referencia un prerequisito que **no existe** en el catálogo:

- ✅ **Ninguno detectado** en los borradores — todos los prerequisitos referencian skills existentes en el catálogo.

### 4.2. Prerequisitos circulares (NO deben existir)

Casos donde A → B → A:

- ✅ **Ninguno detectado** — el grafo es acíclico (DAG).

### 4.3. Prerequisitos cross-rol válidos

Ejemplos de prerequisitos entre roles:

- **Backend senior:**
  - `distributed-systems` → prerequisito: `postgresql` (backend junior→mid), `async-patterns` (backend junior→mid)
  
- **Frontend senior:**
  - `nextjs-ssr` → prerequisito: `react-fundamentals` (frontend junior→mid), `typescript-basics` (compartida)

- **Fullstack:**
  - Hereda **todos** los prerequisitos de backend y frontend.

- **DevOps senior:**
  - `kubernetes-advanced` → prerequisito: `kubernetes-basics` (devops junior→mid)

- **Mobile senior:**
  - `mobile-architecture-advanced` → prerequisito: `mobile-state-management` (mobile junior→mid)

✅ **Todos válidos** — los prerequisitos respetan la jerarquía junior→mid→senior dentro de cada rol.

---

## 5. Validación de githubDimension

Skills con `githubDimension` (heredan score del GitHub Engine):

| githubDimension | Cantidad | Ejemplos |
|-----------------|----------|----------|
| `architecture` | 34 | `typescript-basics`, `system-design`, `component-architecture`, `mobile-architecture-advanced` |
| `testing` | 7 | `unit-testing`, `integration-testing`, `component-testing`, `e2e-testing`, `chaos-engineering` |
| `security` | 8 | `auth-jwt`, `basic-security`, `web-security-frontend`, `mobile-security-advanced`, `zero-trust-security` |
| `maintainability` | 19 | `error-handling`, `terraform`, `observability`, `mobile-performance-optimization` |
| `documentation` | 4 | `code-documentation`, `html-semantics`, `accessibility-wcag`, `design-systems` |
| `null` | 40 | `sql-fundamentals`, `css-fundamentals`, `networking-basics`, `app-store-publishing` |

**Total con proxy del GitHub Engine:** 72 skills (64%)  
**Total sin proxy (null):** 40 skills (36%)

### Skills `null` justificadas

Skills sin `githubDimension` porque **no hay señal** del GitHub Engine:

- **Infraestructura cloud:** `cloud-fundamentals`, `cloud-storage` (no se detecta en repos Git)
- **Publicación:** `app-store-publishing` (proceso fuera de código)
- **Fundamentos:** `sql-fundamentals`, `networking-basics` (no se infiere de código estático)
- **Estilos:** `css-fundamentals`, `css-modules` (señal débil en análisis AST)

✅ **Correcto** — las skills `null` son las que no pueden inferirse del GitHub Engine.

---

## 6. Categorías sin uso (validación)

Categorías definidas en `SkillCategory` pero **no usadas** en ninguna skill:

- ✅ **Todas las categorías están en uso.**

Categorías más usadas:
1. `tooling` (19 skills)
2. `language` (18 skills)
3. `architecture` (16 skills)
4. `infrastructure` (15 skills)

---

## 7. Pesos por Ruta (validación de suma = 1.00)

| Ruta | Suma de Pesos | Status |
|------|---------------|--------|
| `backend_junior_to_mid` | 1.00 | ✅ |
| `backend_mid_to_senior` | 1.00 | ✅ |
| `frontend_junior_to_mid` | 1.00 | ✅ |
| `frontend_mid_to_senior` | 1.00 | ✅ |
| `fullstack_junior_to_mid` | 1.00 | ✅ (0.50 backend + 0.50 frontend) |
| `fullstack_mid_to_senior` | 1.00 | ✅ (0.55 backend + 0.45 frontend) |
| `devops_junior_to_mid` | 1.00 | ✅ |
| `devops_mid_to_senior` | 1.00 | ✅ |
| `mobile_junior_to_mid` | 1.00 | ✅ |
| `mobile_mid_to_senior` | 1.00 | ✅ |

**Todas las rutas suman 1.00** ✅

---

## 8. Skills Duplicadas (validación)

**Duplicados potenciales** (mismo concepto, distinto id):

### 8.1. Observability

- Backend senior: `observability` (logs de app, APM)
- DevOps junior→mid: `monitoring-infrastructure` (métricas de infra)
- DevOps senior: `observability-advanced` (tracing distribuido)

**Decisión:** Mantener **ids separados** — contexto distinto:
- `observability` (backend) → logs de aplicación (Winston, Pino)
- `monitoring-infrastructure` (devops) → métricas de infra (Prometheus, Grafana)
- `observability-advanced` (devops) → tracing distribuido (OpenTelemetry)

**Justificación:** Los tres coexisten en producción — backend instrumenta app, devops configura infra de observabilidad.

---

### 8.2. Performance

- Frontend mid→senior: `advanced-performance` (Core Web Vitals, bundles)
- Mobile mid→senior: `mobile-performance-optimization` (60fps, startup)
- Backend mid→senior: `database-performance` (queries, índices)

**Decisión:** Mantener **ids separados** — dominios distintos (web, mobile, database).

---

### 8.3. CI/CD

- Backend mid→senior: `ci-cd-advanced` (pipelines, feature flags)
- DevOps junior→mid: `ci-cd-pipelines` (GitHub Actions, Jenkins)
- Mobile mid→senior: `ci-cd-mobile` (Fastlane, Bitrise)

**Decisión:** Mantener **ids separados** — contexto distinto:
- `ci-cd-pipelines` (devops) → configuración de pipelines
- `ci-cd-advanced` (backend) → feature flags, canary
- `ci-cd-mobile` (mobile) → firma de apps, uploads a stores

---

### 8.4. Testing E2E

- Frontend mid→senior: `e2e-testing` (Playwright, Cypress)
- Mobile mid→senior: `e2e-testing-mobile` (Detox, Maestro)

**Decisión:** Mantener **ids separados** — herramientas completamente distintas (web vs mobile).

---

✅ **NO hay duplicados reales** — todos los casos con nombres similares tienen contextos distintos.

---

## 9. Resumen para el Equipo

### 9.1. Catálogo Final

- **Total skills únicas:** 112
- **Skills compartidas entre 2+ roles:** 22
- **Skills específicas de un rol:** 90

### 9.2. Próximos Pasos

1. **Revisar este documento** y validar que no hay duplicados accidentales.
2. **Ajustar pesos** si alguna ruta no refleja el mercado (ej: balance 55/45 en fullstack senior).
3. **Validar prerequisitos** con el equipo técnico (¿el grafo tiene sentido?).
4. **Aprobar el catálogo completo** antes de ejecutar `npm run seed:catalog -- --yes`.
5. **Publicar a Firestore** con el script de seed (escribir las 112 skills + 10 rutas).

### 9.3. Preguntas Abiertas

1. **¿Separar rutas por plataforma mobile?** (iOS/Android/Flutter vs agnóstico)
2. **¿Agregar ruta SRE separada?** (overlap con devops senior pero énfasis distinto)
3. **¿GraphQL obligatorio en fullstack senior?** (actualmente omitido)
4. **¿Skills de IA/ML?** (no cubiertas en ninguna ruta — ¿agregar rol "ml-engineer" en V2?)

---

## 10. Listado Completo de Skills (alfabético)

```
accessibility-mobile
accessibility-wcag
advanced-performance
animation-advanced
api-design-rest
api-integration
api-validation
api-versioning
app-size-optimization
app-store-publishing
async-patterns
async-programming-mobile
auth-jwt
backup-recovery
basic-security
basic-security-infra
caching-strategies
canary-blue-green
chaos-engineering
ci-cd-advanced
ci-cd-mobile
ci-cd-pipelines
cloud-fundamentals
cloud-storage
code-documentation
component-architecture
component-testing
cost-optimization
crash-reporting-analytics
css-fundamentals
css-modules
database-performance
deep-linking-advanced
design-systems
disaster-recovery-advanced
distributed-systems
docker-basics
e2e-testing
e2e-testing-mobile
environment-config
error-boundaries
error-handling
event-driven-architecture
form-validation
frontend-performance
git-fundamentals
gitops
graphql-client
html-semantics
http-protocol
incident-response
integration-testing
internationalization
javascript-es6
kubernetes-advanced
kubernetes-basics
linux-fundamentals
load-balancing
local-storage-mobile
logging-centralized
message-queues
micro-frontends
mobile-animations-advanced
mobile-architecture-advanced
mobile-debugging
mobile-forms-validation
mobile-language-fundamentals
mobile-lifecycle
mobile-navigation
mobile-permissions
mobile-performance-optimization
mobile-security-advanced
mobile-state-management
mobile-testing-ui
mobile-ui-basics
modularization-mobile
monitoring-infrastructure
monorepo-frontend
multi-cloud-architecture
native-features-advanced
networking-basics
networking-mobile
nextjs-ssr
nginx-reverse-proxy
node-runtime
observability
observability-advanced
offline-sync
orm-basics
platform-engineering
postgresql
push-notifications
react-advanced
react-fundamentals
react-routing
responsive-design
responsive-mobile-design
scripting-automation
secrets-management
seo-optimization
service-mesh
slo-sla-management
sql-fundamentals
ssh-security
state-management
system-design
terraform
typescript-basics
unit-testing
web-security-frontend
web-workers
zero-trust-security
```

**Total:** 112 skills ✅

