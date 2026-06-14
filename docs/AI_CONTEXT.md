# NEXTAPE — AI Context (fuente de verdad)

> Lee este archivo completo antes de generar cualquier código o arquitectura.
> Todas las decisiones deben respetar las reglas aquí definidas sin excepción.

---

## Qué es NEXTAPE

Plataforma de evaluación técnica y matching laboral para desarrolladores de software.

**Tres pilares:**
1. **THE LINE** — Motor de evaluación de criterio profesional generado por IA. Preguntas con escenarios reales, respuestas predefinidas (mala / aceptable / excelente). No se escribe código.
2. **CORE** — Núcleo de identidad del developer. Skill Scores verificables, evidencia GitHub opcional, compatibilidad con vacantes.
3. **Compatibility Engine** — Motor determinístico que calcula el match entre un developer y una vacante.

---

## Arquitectura

**Patrón:** Modular Monolith con Next.js 15 App Router + Firebase.

```
src/
├── app/              # Rutas únicamente (page.tsx, layout.tsx)
│   └── dashboard/    # Todas las rutas protegidas aquí
├── features/         # Lógica de negocio por módulo
│   ├── auth/
│   ├── assessments/
│   ├── skills/
│   ├── jobs/
│   ├── compatibility/
│   ├── roadmap/
│   ├── github/
│   └── core/         # Antes llamado digital-twin
├── components/       # UI atómica global (sin lógica de negocio)
├── lib/firebase/     # Clientes Firebase tipados
├── services/         # Acceso a datos (solo llaman a Firebase)
├── hooks/            # Custom hooks globales
└── types/            # TypeScript interfaces
```

**Reglas de capas:**
- `app/` nunca contiene lógica de negocio
- `components/` nunca consulta Firestore directamente
- `features/*/services/` es la única capa que accede a datos
- `features/` no importa entre módulos (solo a través de hooks globales)

---

## Base de datos — Firestore

**Colecciones principales:**

| Colección | ID | Fuente de verdad para |
|---|---|---|
| `users/{uid}` | Firebase Auth UID | Identidad |
| `user_skill_scores/{uid}` | Firebase Auth UID | Skills — fuente de verdad del sistema |
| `assessments/{id}` | Auto | Evaluaciones completadas |
| `assessment_attempts/{id}` | Auto | Intentos por evaluación |
| `questions/{id}` | Auto | Banco de preguntas curado |
| `jobs/{id}` | Auto | Vacantes publicadas por empresas |
| `job_skills/{jobId_skill}` | Compuesto | Skills requeridas por vacante |
| `companies/{id}` | Auto | Empresas que publican vacantes |
| `candidate_matches/{uid_jobId}` | Compuesto | Resultados del Compatibility Engine |
| `github_profiles/{uid}` | Firebase Auth UID | Evidencia GitHub (solo lectura) |
| `github_evidence/{uid}` | Firebase Auth UID | Evidencia procesada GitHub |

**Esquema crítico — user_skill_scores/{uid}:**
```json
{
  "scores": {
    "solid": { "junior": 80, "mid": 65, "senior": 0 },
    "testing": { "junior": 90, "mid": 70, "senior": 40 },
    "api-design": { "junior": 85, "mid": 60, "senior": 0 }
  },
  "lastUpdated": "Timestamp",
  "totalAssessments": 5
}
```

---

## Reglas de negocio — NUNCA violar

### Skill Scores
- `user_skill_scores` es la **única fuente de verdad** del sistema
- Los scores se calculan **únicamente** mediante evaluaciones completadas
- **GitHub NUNCA modifica user_skill_scores**
- **La IA NUNCA asigna puntuaciones directamente**

### Compatibility Engine
- Es **determinístico**: mismos inputs → mismo output siempre
- **No usa IA** para calcular compatibilidad
- Fórmula: `70% Skill Match + 20% Evidence Match + 10% Experience Match`
- Lee `user_skill_scores` y `job_skills`, nunca datos de GitHub para el score principal

### GitHub
- Es **evidencia complementaria**, nunca modifica Skill Scores
- Un developer sin GitHub tiene acceso completo a todas las funciones
- GitHub mejora el Evidence Match (20%) pero nunca el Skill Match (70%)

### THE LINE (evaluaciones)
- Preguntas con 3 opciones: mala (0pts) / aceptable (50pts) / excelente (100pts)
- Las preguntas son revisadas por humanos antes de publicarse (`approved: true`)
- Un developer puede reintentar una evaluación (assessment_attempts guarda el historial)
- El score final de un skill es el **promedio de los últimos 3 intentos aprobados**

### Roadmaps
- Leen **únicamente** `user_skill_scores`
- No leen GitHub ni datos de evaluaciones directamente

---

## Restricciones para la IA generadora de código

1. No crear `page.tsx` fuera de `src/app/dashboard/` o `src/app/auth/`
2. No usar route groups `(carpeta)` que causen colisión de rutas en Next.js
3. No poner lógica de negocio en componentes — va en `features/*/services/`
4. No consultar Firestore desde `components/` — solo desde `features/*/services/`
5. No usar `localStorage` ni `sessionStorage` — Firebase Auth maneja la sesión
6. No modificar `user_skill_scores` desde ningún módulo que no sea `features/assessments/`
7. No usar `any` en TypeScript
8. Exports: siempre `export default` al final del archivo para componentes
9. Naming: componentes en PascalCase, hooks con prefijo `use`, servicios con sufijo `.service.ts`
10. La carpeta del módulo CORE es `features/core/`, la ruta es `/dashboard/core`

---

## Stack tecnológico

- **Framework:** Next.js 15, App Router, TypeScript strict
- **Auth:** Firebase Authentication (GitHub OAuth + Google OAuth)
- **Base de datos:** Firebase Firestore
- **Storage:** Firebase Storage
- **IA:** Genkit + Vertex AI (solo para generar preguntas del banco, offline)
- **Estilos:** Tailwind CSS
- **3D (CORE):** Three.js r128

---

*Versión: 1.0 — Junio 2025 — Equipo Antigravity*
