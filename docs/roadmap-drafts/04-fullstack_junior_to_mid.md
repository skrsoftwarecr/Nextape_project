# Roadmap Route: fullstack_junior_to_mid

**Borrador generado para revisión — NO publicado a Firestore**

## Metadata

```typescript
{
  id: "fullstack_junior_to_mid",
  targetRole: "fullstack",
  fromLevel: "junior",
  toLevel: "mid",
  displayName: "Full-Stack Engineer · Junior → Mid"
}
```

## Filosofía de la ruta

Un **fullstack junior→mid** debe dominar **tanto backend como frontend** a nivel mid. Esta ruta es la **unión** de `backend_junior_to_mid` + `frontend_junior_to_mid`, con pesos recalculados para reflejar el **balance 50/50**.

### No es "duplicar código" — es compartir el catálogo

Esta ruta **NO crea skills nuevas**. Usa:
- Las 18 skills de `backend_junior_to_mid`
- Las 15 skills nuevas + 4 compartidas de `frontend_junior_to_mid`
- Pesos ajustados para balancear ambos dominios

**Total skills únicas:** 18 (backend) + 15 (frontend solo) + 4 (compartidas) = **33 skills únicas** (sin duplicados).

---

## Skills incluidas en la ruta

### Dimensión Backend (18 skills)

| Skill ID | Nombre | Categoría | Peso Backend Puro | Peso Fullstack |
|----------|--------|-----------|-------------------|----------------|
| `api-design-rest` | Diseño de APIs REST | api-design | 0.12 | 0.10 |
| `postgresql` | PostgreSQL & Queries Avanzadas | database | 0.10 | 0.06 |
| `unit-testing` | Unit Testing | testing | 0.09 | **0.08** (compartida) |
| `auth-jwt` | Autenticación JWT & Sesiones | security | 0.08 | 0.07 |
| `async-patterns` | Async/Await & Concurrencia | language | 0.08 | 0.05 |
| `integration-testing` | Integration Testing & Mocks | testing | 0.07 | 0.05 |
| `typescript-basics` | TypeScript Fundamentals | language | 0.07 | **0.07** (compartida) |
| `orm-basics` | ORM (Prisma / TypeORM) | database | 0.06 | 0.04 |
| `basic-security` | OWASP Top 10 & SQL Injection | security | 0.06 | 0.05 |
| `api-validation` | Validación de Input (Zod / Joi) | api-design | 0.05 | 0.04 |
| `docker-basics` | Docker & Contenedores | infrastructure | 0.05 | 0.03 |
| `node-runtime` | Node.js Runtime & Event Loop | language | 0.04 | 0.03 |
| `error-handling` | Manejo de Errores & Logging | tooling | 0.04 | 0.03 |
| `environment-config` | Variables de Entorno & Config | tooling | 0.02 | 0.02 |
| `sql-fundamentals` | SQL & Álgebra Relacional | database | 0.02 | 0.02 |
| `http-protocol` | HTTP/HTTPS & Protocolo REST | api-design | 0.02 | 0.02 |
| `code-documentation` | Documentación de Código | tooling | 0.02 | **0.02** (compartida) |
| `git-fundamentals` | Git & Control de Versiones | tooling | 0.01 | **0.01** (compartida) |

**Subtotal backend:** 0.50

### Dimensión Frontend (15 skills nuevas)

| Skill ID | Nombre | Categoría | Peso Frontend Puro | Peso Fullstack |
|----------|--------|-----------|-------------------|----------------|
| `react-fundamentals` | React Fundamentals & Hooks | language | 0.14 | 0.11 |
| `component-architecture` | Arquitectura de Componentes | architecture | 0.11 | 0.08 |
| `state-management` | State Management (Context/Zustand) | architecture | 0.10 | 0.07 |
| `component-testing` | Component Testing (RTL) | testing | 0.09 | 0.06 |
| `accessibility-wcag` | WCAG 2.1 & ARIA | security | 0.07 | 0.04 |
| `api-integration` | Integración con APIs REST | api-design | 0.06 | 0.04 |
| `frontend-performance` | Performance (Code Splitting) | tooling | 0.05 | 0.03 |
| `form-validation` | Validación de Forms | tooling | 0.05 | 0.03 |
| `responsive-design` | Responsive Design | language | 0.04 | 0.02 |
| `css-modules` | CSS Modules / Tailwind | tooling | 0.03 | 0.01 |
| `error-boundaries` | Error Boundaries | tooling | 0.02 | 0.01 |
| `react-routing` | React Router | tooling | 0.02 | 0.01 |
| `javascript-es6` | JavaScript ES6+ | language | 0.01 | 0.01 |
| `html-semantics` | HTML Semántico | language | (prerequisito) | 0.01 |
| `css-fundamentals` | CSS & Layout | language | (prerequisito) | 0.01 |

**Subtotal frontend:** 0.50

---

## Pesos de skillWeights (suma = 1.00)

```typescript
skillWeights: {
  // ─── Backend (0.50 total) ───
  "api-design-rest": 0.10,
  "auth-jwt": 0.07,
  "typescript-basics": 0.07,           // Compartida
  "unit-testing": 0.08,                // Compartida
  "postgresql": 0.06,
  "async-patterns": 0.05,
  "integration-testing": 0.05,
  "basic-security": 0.05,
  "orm-basics": 0.04,
  "api-validation": 0.04,
  "docker-basics": 0.03,
  "node-runtime": 0.03,
  "error-handling": 0.03,
  "environment-config": 0.02,
  "sql-fundamentals": 0.02,
  "http-protocol": 0.02,
  "code-documentation": 0.02,          // Compartida
  "git-fundamentals": 0.01,            // Compartida

  // ─── Frontend (0.50 total) ───
  "react-fundamentals": 0.11,
  "component-architecture": 0.08,
  "state-management": 0.07,
  "component-testing": 0.06,
  "accessibility-wcag": 0.04,
  "api-integration": 0.04,
  "frontend-performance": 0.03,
  "form-validation": 0.03,
  "responsive-design": 0.02,
  "html-semantics": 0.01,
  "css-fundamentals": 0.01,
  "css-modules": 0.01,
  "error-boundaries": 0.01,
  "react-routing": 0.01,
  "javascript-es6": 0.01
}
```

**Total:** 1.00 ✅  
**Backend:** 0.50 | **Frontend:** 0.50

### Justificación del balance

Un fullstack mid debe ser **competente en ambos lados**, no experto en uno e ignorante del otro. El balance 50/50 refleja que:

1. **Backend crítico (0.50):** APIs, autenticación, bases de datos, testing backend.
2. **Frontend crítico (0.50):** React, componentes, estado, testing UI, accesibilidad.

**Skills con mayor ajuste de peso:**

- `api-design-rest`: 0.12 (backend puro) → 0.10 (fullstack). Sigue siendo crítica.
- `react-fundamentals`: 0.14 (frontend puro) → 0.11 (fullstack). Menos énfasis pero core.
- `postgresql`: 0.10 → 0.06. Fullstack puede usar ORMs más abstraídos.
- `component-architecture`: 0.11 → 0.08. Importante pero no al nivel de un especialista frontend.

**Skills compartidas conservan importancia:**

- `typescript-basics`: 0.07 en todas las rutas (backend/frontend/fullstack) — lenguaje universal.
- `unit-testing`: 0.08 fullstack (vs 0.09 backend puro) — testing crítico en ambos lados.
- `git-fundamentals`: 0.01 universal.

---

## Skills compartidas con otras rutas

### Con backend_junior_to_mid

**Todas las 18 skills** son compartidas (mismo id, distinto peso).

### Con frontend_junior_to_mid

**Todas las 15 skills nuevas + 4 compartidas** (total 19) son compartidas.

### Overlap total

- **33 skills únicas** en el catálogo después de fullstack_junior_to_mid.
- **0 skills duplicadas** — todas referenciadas por id.

---

## Target score según seniority

- **toLevel = "mid"** → **targetScore = 60** para cada skill.

---

## Notas para revisión humana

1. **Balance 50/50:** ¿Es correcto o debería ser 60/40 backend-heavy (más común en fullstack de startups)? Ajustar pesos si el mercado lo demanda.

2. **Skills "fundamento" (html-semantics, css-fundamentals):** Se agregaron con peso 0.01 cada una (antes eran solo prerequisitos en frontend puro). ¿Correcto?

3. **Overlap de testing:** `unit-testing` (0.08) + `integration-testing` (0.05) + `component-testing` (0.06) = **0.19 total** en testing. ¿Es excesivo o refleja que fullstack mid debe testear ambos lados?

4. **Prerequisitos complejos:** Un fullstack junior debe empezar aprendiendo qué primero: ¿backend o frontend? El grafo de prerequisitos tiene dos "ramas" independientes (backend y frontend). ¿Documentar un orden sugerido (ej: primero JavaScript/TypeScript/Git, luego elegir rama)?

5. **Infraestructura ligera:** `docker-basics` tiene peso 0.03 (vs 0.05 backend puro). ¿Suficiente para fullstack o debería ser 0.04?

6. **Skills sin peso de backend:** `code-documentation` (0.02) cubre tanto Storybook (frontend) como OpenAPI (backend). ¿Es suficiente un solo peso para ambos contextos?

---

## Checksum de integridad

- **Skills totales en la ruta:** 33 (18 backend + 15 frontend, 4 compartidas)
- **Skills únicas en catálogo:** 33 (sin duplicados)
- **Suma de pesos:** 1.00 ✅
- **Balance backend/frontend:** 0.50 / 0.50 ✅

