# Roadmap Route: frontend_junior_to_mid

**Borrador generado para revisión — NO publicado a Firestore**

## Metadata

```typescript
{
  id: "frontend_junior_to_mid",
  targetRole: "frontend",
  fromLevel: "junior",
  toLevel: "mid",
  displayName: "Frontend Engineer · Junior → Mid"
}
```

## Filosofía de la ruta

Un **frontend junior** sabe HTML/CSS/JS y puede construir interfaces siguiendo diseños. Un **frontend mid** domina React/frameworks modernos, estado complejo, testing, performance, y accesibilidad — puede **diseñar** sistemas de componentes y tomar decisiones arquitectónicas en la capa de presentación.

### Diferencias con backend_junior_to_mid

- Backend enfatiza APIs, bases de datos, autenticación server-side.
- Frontend enfatiza UX, estado reactivo, rendering, accesibilidad, y optimización de bundles.

### Overlap real con backend

**Skills compartidas** (MISMO id, distinto peso por ruta):

- `git-fundamentals` — Control de versiones universal
- `typescript-basics` — TypeScript es lenguaje compartido
- `unit-testing` — Jest/Vitest son comunes en frontend y backend
- `code-documentation` — JSDoc, Storybook para frontend; OpenAPI para backend

Estas 4 skills **NO se duplican** en el catálogo — se reutilizan con pesos ajustados.

---

## Skills incluidas en la ruta

### Skills compartidas con backend (reutilizadas)

| Skill ID | Nombre | Categoría | githubDimension | Notas |
|----------|--------|-----------|-----------------|-------|
| `git-fundamentals` | Git & Control de Versiones | tooling | null | Peso menor en frontend (0.01) |
| `typescript-basics` | TypeScript Fundamentals | language | architecture | Crítico también en frontend (0.08) |
| `unit-testing` | Unit Testing | testing | testing | Jest/Vitest para componentes (0.09) |
| `code-documentation` | Documentación de Código | tooling | documentation | Storybook, prop types (0.03) |

### Skills nuevas específicas de frontend

| Skill ID | Nombre | Categoría | githubDimension | Prerequisitos |
|----------|--------|-----------|-----------------|---------------|
| `html-semantics` | HTML Semántico & Accesibilidad | language | documentation | [] |
| `css-fundamentals` | CSS & Layout (Flexbox/Grid) | language | null | [] |
| `javascript-es6` | JavaScript ES6+ & DOM API | language | architecture | [] |
| `react-fundamentals` | React Fundamentals & Hooks | language | architecture | javascript-es6, typescript-basics |
| `component-architecture` | Arquitectura de Componentes | architecture | architecture | react-fundamentals |
| `state-management` | State Management (Context/Zustand) | architecture | architecture | react-fundamentals |
| `react-routing` | React Router & Navegación | tooling | null | react-fundamentals |
| `form-validation` | Validación de Forms (React Hook Form/Zod) | tooling | security | react-fundamentals, typescript-basics |
| `responsive-design` | Responsive Design & Mobile-first | language | null | css-fundamentals |
| `accessibility-wcag` | WCAG 2.1 & ARIA | security | documentation | html-semantics, react-fundamentals |
| `frontend-performance` | Performance (Code Splitting, Lazy Loading) | tooling | maintainability | react-fundamentals |
| `css-modules` | CSS Modules / Tailwind / Styled Components | tooling | null | css-fundamentals |
| `api-integration` | Integración con APIs REST (fetch/axios) | api-design | architecture | javascript-es6, typescript-basics |
| `error-boundaries` | Error Boundaries & Manejo de Errores | tooling | maintainability | react-fundamentals |
| `component-testing` | Component Testing (React Testing Library) | testing | testing | unit-testing, react-fundamentals |

---

## Pesos de skillWeights (suma = 1.00)

```typescript
skillWeights: {
  "react-fundamentals": 0.14,          // Core del stack moderno
  "component-architecture": 0.11,      // Diseño de sistemas UI
  "state-management": 0.10,            // Estado complejo
  "component-testing": 0.09,           // Testing de UI
  "unit-testing": 0.09,                // Fundamento compartido
  "typescript-basics": 0.08,           // Tipado estático
  "accessibility-wcag": 0.07,          // WCAG crítico para mid
  "api-integration": 0.06,             // Hablar con backend
  "frontend-performance": 0.05,        // Optimización de bundles
  "form-validation": 0.05,             // UX crítica en apps
  "responsive-design": 0.04,           // Mobile-first
  "css-modules": 0.03,                 // Estilos organizados
  "code-documentation": 0.03,          // Storybook
  "error-boundaries": 0.02,            // Resilencia UI
  "react-routing": 0.02,               // Navegación SPA
  "html-semantics": 0.01,              // HTML semántico, accesibilidad base
  "css-fundamentals": 0.01             // Flexbox, Grid, layout
}
```

**Total:** 1.00 ✅

### Justificación de pesos

- **`react-fundamentals` (0.14):** Hooks, lifecycle, reconciliation. La skill definitoria del frontend moderno. Un mid debe dominar `useEffect`, `useMemo`, `useCallback`, y custom hooks.

- **`component-architecture` (0.11):** Diseñar **sistemas de componentes reusables** (atomic design, compound components, render props). Separa un mid de un junior que solo consume componentes.

- **`state-management` (0.10):** Context, Zustand, Redux. Manejar estado compartido sin prop drilling. Un mid debe saber cuándo usar Context vs librería externa.

- **`component-testing` (0.09) + `unit-testing` (0.09) = 0.18 total:** Testing es **crítico** en frontend mid. React Testing Library para componentes, Jest para lógica pura. Igual peso combinado que backend da a testing.

- **`typescript-basics` (0.08):** TypeScript es estándar en frontend moderno. Props tipadas, generics, utility types. Mismo peso relativo que en backend.

- **`accessibility-wcag` (0.07):** WCAG 2.1 AA es **requisito legal** en muchos mercados. Un mid debe dominar ARIA, focus management, y usar screen readers para testear.

- **`api-integration` (0.06):** fetch/axios, manejo de loading/error, retry logic. El frontend habla con backend — debe hacerlo bien.

- **`frontend-performance` (0.05):** Code splitting, lazy loading, memoization. Un mid optimiza bundles y evita re-renders innecesarios.

- **`form-validation` (0.05):** React Hook Form + Zod son estándar. Validación del lado del cliente antes de enviar al backend.

- **`responsive-design` (0.04):** Mobile-first, media queries, breakpoints. Un mid diseña UIs que funcionan en cualquier pantalla.

- **`css-modules` (0.03):** Tailwind, CSS Modules, o Styled Components. Organización de estilos a escala (evitar conflictos de nombres).

- **`code-documentation` (0.03):** Storybook para componentes, JSDoc para utils. Documentar contratos de componentes.

- **`error-boundaries` (0.02):** Capturar errores de rendering sin tumbar toda la app. Patrón resiliente.

- **`react-routing` (0.02):** React Router v6, navegación programática, protected routes. SPA navigation.

- **`html-semantics` (0.01):** HTML semántico (`<header>`, `<nav>`, `<main>`, `<article>`) y atributos ARIA básicos. Fundamento de accesibilidad — sin peso explícito, el motor nunca lo priorizaría (rawPriority = deficit × 0 = 0).

- **`css-fundamentals` (0.01):** Flexbox, Grid, box model, cascada. Fundamento de layout moderno — peso mínimo pero explícito para que el motor lo detecte como gap si el usuario no lo domina.

**Nota:** `javascript-es6` y `git-fundamentals` se consideran prerequisitos implícitos ya dominados al llegar a mid (peso 0 — no aparecen en skillWeights).

---

## Skills compartidas con otras rutas

### Con backend_junior_to_mid

- `git-fundamentals` — Universal
- `typescript-basics` — Lenguaje compartido
- `unit-testing` — Testing compartido (Jest/Vitest)
- `code-documentation` — Documentación (distinto contexto: Storybook vs OpenAPI)

**Total: 4 skills compartidas** (no duplicadas en catálogo).

### Con fullstack_junior_to_mid (futuro)

- **Todas las 15 skills nuevas** de frontend + **overlap con backend** (TypeScript, testing, Git, documentación).
- Fullstack junior→mid será la **unión** de ambas rutas con pesos recalculados (balance 50/50 backend/frontend).

---

## Target score según seniority

- **toLevel = "mid"** → **targetScore = 60** para cada skill.

---

## Notas para revisión humana

1. **Framework-agnostic:** La ruta usa "React" en los nombres porque es el framework dominante (roadmap.sh/react), pero las skills conceptuales (`component-architecture`, `state-management`) son framework-agnostic. ¿Renombrar a nombres más genéricos o mantener React como referencia?

2. **CSS-in-JS vs Tailwind:** `css-modules` cubre múltiples enfoques (Tailwind, Styled Components, CSS Modules). ¿Separar en skills distintas o mantener como categoría única?

3. **Testing E2E:** No se incluyó Cypress/Playwright (eso sería frontend senior). ¿Correcto dejar E2E para senior?

4. **NextJS/SSR:** No se incluyó rendering server-side (Next.js, Remix). ¿Es skill de mid o de senior? (Recomendación: senior, porque requiere entender SEO, hydration, y edge rendering.)

5. **githubDimension:** `accessibility-wcag` usa `documentation` como proxy (porque repos con buen README suelen tener mejor a11y). ¿Es correcto o debería ser `null`?

6. **HTML/CSS fundamentos:** `html-semantics` y `css-fundamentals` ahora tienen peso explícito (0.01 cada una) para que el motor las detecte como gaps si un usuario no las domina. `javascript-es6` y `git-fundamentals` se consideran prerequisitos implícitos sin peso explícito.

---

## Checksum de integridad

- **Skills nuevas frontend:** 15
- **Skills reutilizadas de backend:** 4
- **Total skills en catálogo después de esta ruta:** 28 + 15 = 43
- **Suma de pesos:** 1.00 ✅

