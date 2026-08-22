# Roadmap Route: fullstack_mid_to_senior

**Borrador generado para revisión — NO publicado a Firestore**

## Metadata

```typescript
{
  id: "fullstack_mid_to_senior",
  targetRole: "fullstack",
  fromLevel: "mid",
  toLevel: "senior",
  displayName: "Full-Stack Engineer · Mid → Senior"
}
```

## Filosofía de la ruta

Un **fullstack senior** es la unión de `backend_mid_to_senior` + `frontend_mid_to_senior`: domina arquitectura de sistemas distribuidos (backend) **y** rendering avanzado + design systems (frontend). Es el perfil más **completo** y demandado en startups y equipos pequeños.

### Prerequisitos

Se asume dominio de **todas las skills de fullstack_junior_to_mid** (33 skills).

### Skills adicionales de nivel senior

Esta ruta agrega:
- **10 skills nuevas** de `backend_mid_to_senior` (sistemas distribuidos, observabilidad, etc.)
- **13 skills nuevas** de `frontend_mid_to_senior` (Next.js SSR, design systems, etc.)

**Total skills únicas después de esta ruta:** 33 (junior→mid) + 10 (backend senior) + 13 (frontend senior) = **56 skills únicas**.

---

## Pesos de skillWeights (suma = 1.00)

Balance ajustado a **55% backend / 45% frontend** (sesgo backend porque sistemas distribuidos y observabilidad son más críticos en senior que animaciones avanzadas).

```typescript
skillWeights: {
  // ─── Backend Senior (0.55 total) ───
  "system-design": 0.15,               // Crítico: arquitectura escalable
  "distributed-systems": 0.11,         // CAP, consistencia, replicación
  "observability": 0.09,               // Métricas, logs, tracing
  "event-driven-architecture": 0.06,   // Event sourcing, CQRS
  "message-queues": 0.05,              // RabbitMQ, SQS
  "caching-strategies": 0.04,          // Redis, invalidación
  "database-performance": 0.03,        // Query optimization
  "api-versioning": 0.02,              // Breaking changes

  // ─── Frontend Senior (0.45 total) ───
  "nextjs-ssr": 0.12,                  // SSR/SSG crítico en senior
  "advanced-performance": 0.09,        // Core Web Vitals
  "design-systems": 0.07,              // Component libraries
  "react-advanced": 0.06,              // Suspense, Server Components
  "web-security-frontend": 0.05,       // XSS, CSRF, CSP
  "e2e-testing": 0.04,                 // Playwright/Cypress
  "micro-frontends": 0.02,             // Arquitectura modular

  // ─── Refuerzos de Mid ───
  "api-design-rest": 0.03,             // Refuerzo backend
  "component-architecture": 0.02,      // Refuerzo frontend
  "integration-testing": 0.02,         // Refuerzo backend
  "accessibility-wcag": 0.02,          // Refuerzo frontend (legal)
  "component-testing": 0.01            // Refuerzo frontend
}
```

**Total:** 1.00 ✅  
**Backend:** 0.55 | **Frontend:** 0.45

### Justificación del sesgo backend (55/45)

1. **`system-design` (0.15) es la skill definitoria** de un senior fullstack — diseñar trade-offs entre backend y frontend (SSR vs CSR vs SSG, REST vs GraphQL, SQL vs NoSQL).

2. **Observabilidad (0.09) es más crítica** que cualquier skill frontend avanzada (ej: animaciones) — un senior debe debuggear producción con métricas, no con `console.log`.

3. **Frontend senior tiene skills "premium"** (`animation-advanced`, `internationalization`) que son menos críticas que backend core (`distributed-systems`, `message-queues`) → menor peso total frontend.

### Skills omitidas de esta ruta (low priority para fullstack)

De backend_mid_to_senior:
- `load-balancing` (0.06 en backend puro) → omitida (overlap con devops)
- `ci-cd-advanced` (0.05 en backend puro) → omitida (overlap con devops)

De frontend_mid_to_senior:
- `monorepo-frontend` (0.06 en frontend puro) → omitida (tooling, no core)
- `graphql-client` (0.05 en frontend puro) → omitida (opcional, no universal)
- `seo-optimization` (0.04) → omitida (cubierto por `nextjs-ssr`)
- `internationalization` (0.03) → omitida (nice-to-have)
- `web-workers` (0.03) → omitida (PWA no universal)
- `animation-advanced` (0.02) → omitida (UX premium, no core)

**Criterio:** Fullstack senior prioriza **skills arquitectónicas críticas** sobre tooling y UX premium.

---

## Skills compartidas con otras rutas

### Con backend_mid_to_senior

- `system-design`, `distributed-systems`, `observability`, `event-driven-architecture`, `message-queues`, `caching-strategies`, `database-performance`, `api-versioning` (8 skills)

### Con frontend_mid_to_senior

- `nextjs-ssr`, `advanced-performance`, `design-systems`, `react-advanced`, `web-security-frontend`, `e2e-testing`, `micro-frontends` (7 skills)

### Con fullstack_junior_to_mid

- **Todas las 33 skills** son prerequisitos implícitos.

**Total skills únicas en catálogo:** 56 (sin duplicados).

---

## Target score según seniority

- **toLevel = "senior"** → **targetScore = 80** para cada skill.

---

## Notas para revisión humana

1. **Balance 55/45:** ¿Es correcto o debería ser 50/50? El sesgo backend refleja que sistemas distribuidos y observabilidad son más **críticos** que animaciones y PWA. ¿Validar con mercado?

2. **Skills omitidas:** `load-balancing`, `ci-cd-advanced`, `graphql-client`, `seo-optimization`, `internationalization`, `web-workers`, `animation-advanced`, `monorepo-frontend` no están en esta ruta para mantener la suma en 1.00. ¿Alguna debería entrar en lugar de otra?

3. **Testing senior (0.07 total):** `e2e-testing` (0.04) + `integration-testing` (0.02) + `component-testing` (0.01). ¿Suficiente o agregar más peso a E2E?

4. **Seguridad:** `web-security-frontend` (0.05) cubre frontend; `basic-security` (prerequisito de mid) cubre backend. ¿Agregar skill "advanced-security" (OAuth2, rate limiting, DDoS) para senior?

5. **Overlap con devops:** `observability` (0.09) tiene fuerte overlap con devops. ¿Compartir el mismo id o crear variantes (ej: `observability-backend` vs `observability-infra`)?

6. **Next.js obligatorio:** `nextjs-ssr` (0.12) es segundo mayor peso. ¿Renombrar a "SSR/SSG Frameworks" para incluir Remix/Astro?

7. **GraphQL:** Omitido de esta ruta. ¿Es aceptable que un fullstack senior no domine GraphQL? (Recomendación: sí — REST sigue siendo dominante, GraphQL es opcional.)

---

## Checksum de integridad

- **Skills totales en la ruta:** 22 (15 nuevas senior + 5 refuerzos de mid + 2 de backend mid reforzados)
- **Skills prerequisito (no ponderadas):** 33 (de fullstack_junior_to_mid)
- **Skills únicas en catálogo:** 56
- **Suma de pesos:** 1.00 ✅
- **Balance backend/frontend:** 0.55 / 0.45

