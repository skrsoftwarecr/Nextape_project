# NEXTAPE — Reglas de Negocio

> Estas reglas no se negocian. Ningún código puede violarlas.

---

## Skill Scores

- `user_skill_scores` es la **única fuente de verdad** del sistema.
- Los scores se calculan **únicamente** mediante evaluaciones completadas.
- **GitHub NUNCA modifica user_skill_scores.**
- **La IA NUNCA asigna puntuaciones directamente.**
- Un developer sin GitHub tiene acceso completo a todas las funciones.
- El score de un skill es el promedio ponderado de los últimos 3 intentos aprobados.
- Rango de scores: 0–100 por skill y por nivel (junior / mid / senior).

---

## Evaluaciones (THE LINE)

- Preguntas con 3 opciones: **mala (0 pts) / aceptable (50 pts) / excelente (100 pts)**.
- Toda pregunta debe tener `approved: true` para mostrarse en evaluaciones.
- Un developer puede reintentar evaluaciones; el historial se guarda en `assessment_attempts`.
- Máximo **3 intentos cuentan** para el score activo de un skill+nivel.
- Las preguntas son generadas por IA pero **revisadas por humanos** antes de publicarse.

---

## GitHub

- GitHub es **evidencia complementaria**, nunca requisito.
- Alimenta únicamente `github_evidence.evidenceScore`.
- `evidenceScore` impacta solo el **Evidence Match (20%)** del Compatibility Engine.
- Un developer sin GitHub tiene `evidenceMatch = 0` — no es penalización, es ausencia de señal.

---

## Compatibility Engine

- Es **determinístico**: mismos inputs siempre producen el mismo output.
- **No usa IA** para calcular compatibilidad.
- Fórmula fija:

```
totalScore = (skillMatch × 0.70) + (evidenceMatch × 0.20) + (experienceMatch × 0.10)
```

- Lee `user_skill_scores` y `job_skills` — nunca datos crudos de GitHub.
- Los resultados se cachean en `candidate_matches`.
- Se recalcula automáticamente cuando cambia `user_skill_scores` o `job_skills`.

---

## Roadmaps

- Leen **únicamente** `user_skill_scores`.
- Sugieren el siguiente nivel a estudiar basándose en gaps de score.
- No leen `github_evidence` ni datos de assessments directamente.

---

## Vacantes y Empresas

- Solo usuarios con `role: 'recruiter'` pueden publicar vacantes.
- Cada vacante define skills requeridas en `job_skills` con peso y score mínimo.
- La suma de weights en `job_skills` por vacante debe ser exactamente 1.0.
- Una vacante en `status: 'draft'` no aparece en búsquedas públicas.

---

*Versión: 1.0 — Junio 2025*
