# Roadmap Route: frontend_mid_to_senior

**Borrador generado para revisión — NO publicado a Firestore**

## Metadata

```typescript
{
  id: "frontend_mid_to_senior",
  targetRole: "frontend",
  fromLevel: "mid",
  toLevel: "senior",
  displayName: "Frontend Engineer · Mid → Senior"
}
```

## Filosofía de la ruta

Un **frontend mid** domina React, estado complejo, testing y accesibilidad. Un **frontend senior** diseña arquitecturas de **micro-frontends**, optimiza rendering a escala (SSR, streaming, edge), implementa design systems, y domina performance avanzada (Core Web Vitals, hydration, prefetching).

### Diferencias con Mid→Junior

- **Junior→Mid:** Fundamentos de React, componentes, estado, testing básico.
- **Mid→Senior:** Arquitectura de aplicaciones complejas, rendering avanzado, performance crítica, design systems, internacionalización, y seguridad frontend.

### Nuevas skills de nivel senior

| Skill ID | Nombre | Categoría | githubDimension | Prerequisitos |
|----------|--------|-----------|-----------------|---------------|
| `nextjs-ssr` | Next.js & Server-Side Rendering | architecture | architecture | react-fundamentals, typescript-basics |
| `micro-frontends` | Arquitectura Micro-Frontends | architecture | architecture | component-architecture, react-routing |
| `design-systems` | Design Systems & Component Libraries | architecture | documentation | component-architecture, css-modules |
| `advanced-performance` | Core Web Vitals & Optimización Avanzada | tooling | maintainability | frontend-performance, react-fundamentals |
| `web-security-frontend` | Seguridad Frontend (XSS, CSRF, CSP) | security | security | api-integration, form-validation |
| `react-advanced` | React Avanzado (Suspense, Transitions, Server Components) | language | architecture | react-fundamentals, state-management |
| `internationalization` | i18n & Localización | tooling | null | react-fundamentals |
| `e2e-testing` | E2E Testing (Playwright/Cypress) | testing | testing | component-testing |
| `monorepo-frontend` | Monorepos & Tooling (Turborepo/Nx) | tooling | maintainability | component-architecture |
| `graphql-client` | GraphQL Client (Apollo/urql) | api-design | architecture | api-integration, typescript-basics |
| `animation-advanced` | Animaciones Avanzadas (Framer Motion, GSAP) | language | null | css-fundamentals, react-fundamentals |
| `seo-optimization` | SEO & Meta Tags | tooling | documentation | nextjs-ssr, html-semantics |
| `web-workers` | Web Workers & Service Workers (PWA) | infrastructure | architecture | javascript-es6 |

---

## Skills incluidas en la ruta

### Skills reutilizadas de frontend_junior_to_mid

Todas las 15 skills nuevas + 4 compartidas de junior→mid son prerequisitos implícitos. Se asume dominio de:

- React, componentes, estado, routing, forms, accesibilidad
- Testing (unit + component), TypeScript, HTML/CSS
- API integration, error handling, responsive design

Algunas se **refuerzan** con peso mínimo en esta ruta (ej: `component-testing`, `accessibility-wcag`).

---

## Pesos de skillWeights (suma = 1.00)

```typescript
skillWeights: {
  "nextjs-ssr": 0.15,                  // SSR/SSG/ISR — skill definitoria senior
  "advanced-performance": 0.13,        // Core Web Vitals, hydration, prefetching
  "design-systems": 0.11,              // Component libraries reusables
  "react-advanced": 0.10,              // Suspense, Server Components, Concurrent Mode
  "web-security-frontend": 0.09,       // XSS, CSRF, CSP headers
  "micro-frontends": 0.08,             // Arquitectura modular
  "e2e-testing": 0.07,                 // Playwright/Cypress
  "monorepo-frontend": 0.06,           // Turborepo/Nx para escalabilidad
  "graphql-client": 0.05,              // Apollo vs REST
  "seo-optimization": 0.04,            // Meta tags, structured data
  "internationalization": 0.03,        // i18n para mercados globales
  "web-workers": 0.03,                 // PWA, background processing
  "animation-advanced": 0.02,          // UX premium
  "component-testing": 0.02,           // Refuerzo de mid
  "accessibility-wcag": 0.02           // Refuerzo de mid (obligatorio en senior)
}
```

**Total:** 1.00 ✅

### Justificación de pesos

- **`nextjs-ssr` (0.15):** Next.js (o similar: Remix, Astro) es el **salto** de SPA pura a rendering híbrido (SSR/SSG/ISR). Un senior debe dominar hydration, data fetching server-side, y edge rendering.

- **`advanced-performance` (0.13):** Core Web Vitals (LCP, FID, CLS) son métricas de negocio (SEO, conversión). Un senior optimiza bundle splitting, lazy loading, preloading, y mide con Lighthouse/WebPageTest.

- **`design-systems` (0.11):** Crear component libraries reusables (Storybook, Chromatic, semantic versioning). Un senior **escala** la UI a múltiples productos.

- **`react-advanced` (0.10):** Suspense, Concurrent Mode, Server Components (React 18+). Un senior entiende el **modelo mental** de React a nivel profundo, no solo la API.

- **`web-security-frontend` (0.09):** XSS (sanitización), CSRF (tokens), CSP headers, subresource integrity. Frontend senior **no confía en el navegador** sin validación.

- **`micro-frontends` (0.08):** Module Federation (Webpack 5), single-spa. Arquitectura para equipos independientes con deploys aislados.

- **`e2e-testing` (0.07):** Playwright/Cypress para flujos críticos (login, checkout). Un senior **previene** regresiones con E2E en CI.

- **`monorepo-frontend` (0.06):** Turborepo, Nx, pnpm workspaces. Shared code entre múltiples apps (design system + apps).

- **`graphql-client` (0.05):** Apollo, urql, normalized cache. GraphQL vs REST es decisión arquitectónica que un senior debe dominar.

- **`seo-optimization` (0.04):** Meta tags, structured data (JSON-LD), sitemaps, Open Graph. SEO es **negocio**, no bonus.

- **`internationalization` (0.03):** i18next, formato de fechas/números, RTL. Apps globales requieren i18n desde el diseño.

- **`web-workers` (0.03):** Service Workers (offline-first), background sync. PWA es estándar en apps móviles web.

- **`animation-advanced` (0.02):** Framer Motion, GSAP, physics-based animations. UX premium que diferencia productos.

- **Refuerzos de mid (0.04 total):** `component-testing` (0.02) + `accessibility-wcag` (0.02) porque un senior **perfecciona** testing y a11y (ej: testing con screen readers en CI, auditorías WCAG 2.2 AAA).

---

## Skills compartidas con otras rutas

### Con frontend_junior_to_mid

- **Refuerzos:** `component-testing`, `accessibility-wcag`

### Con backend_mid_to_senior

- **Overlap conceptual (pero distinto id):**
  - Frontend: `advanced-performance` (bundle, rendering)
  - Backend: `database-performance` (queries, índices)
  
  **NO compartir id** — son dominios distintos.

### Con fullstack_mid_to_senior (futuro)

- `nextjs-ssr`, `web-security-frontend`, `graphql-client`, `monorepo-frontend`, `seo-optimization` serán compartidas.

### Con devops (futuro)

- `web-workers` (Service Workers), `monorepo-frontend` (CI/CD de monorepos).

---

## Target score según seniority

- **toLevel = "senior"** → **targetScore = 80** para cada skill.

---

## Notas para revisión humana

1. **Framework lock-in:** La ruta usa "Next.js" explícitamente. ¿Renombrar a "SSR/SSG Frameworks" para ser agnóstico (incluir Remix, Astro, SvelteKit)?

2. **React Server Components:** `react-advanced` incluye RSC (React 18+). ¿Separar en skill propia o mantener bajo "React Avanzado"?

3. **GraphQL obligatorio:** `graphql-client` tiene peso (0.05). ¿Todos los frontend senior deben dominar GraphQL o debería ser opcional (V2: rutas condicionales)?

4. **Micro-frontends:** Es arquitectura **controversial** (complejidad vs beneficios). ¿Peso correcto (0.08) o reducir a 0.05?

5. **Testing senior:** E2E (0.07) + refuerzo de component testing (0.02) = 0.09 total. ¿Suficiente? ¿Agregar visual regression testing (Chromatic/Percy)?

6. **githubDimension:** La mayoría usa `architecture`, `testing`, `security`. ¿`design-systems` debería ser `architecture` o `documentation`? (Actual: `documentation`)

7. **Animaciones:** `animation-advanced` tiene peso mínimo (0.02). ¿Es skill senior o "nice-to-have"? (Recomendación: mantener 0.02 — no todos los productos priorizan animaciones.)

---

## Checksum de integridad

- **Skills nuevas senior frontend:** 13
- **Skills reutilizadas de mid (con refuerzo):** 2
- **Total skills en catálogo después de esta ruta:** 43 + 13 = 56
- **Suma de pesos:** 1.00 ✅

