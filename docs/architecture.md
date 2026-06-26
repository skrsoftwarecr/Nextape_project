# NEXTAPE — Arquitectura

> Modular Monolith con Next.js 15 App Router + Firebase.

---

## Módulos

| Módulo | Carpeta | Responsabilidad |
|---|---|---|
| auth | features/auth/ | Login, sesión, guard de rutas |
| assessments | features/assessments/ | Evaluaciones y scoring |
| skills | features/skills/ | Lectura de user_skill_scores |
| jobs | features/jobs/ | Vacantes y búsqueda |
| compatibility | features/compatibility/ | Compatibility Engine |
| roadmap | features/roadmap/ | Roadmaps personalizados |
| github | features/github/ | Sync de evidencia GitHub |
| core | features/core/ | Perfil público del developer (antes: digital-twin) |

---

## Reglas de capas

```
app/page.tsx
    ↓ importa
features/*/components/
    ↓ importa
features/*/hooks/
    ↓ importa
features/*/services/        ← único punto de acceso a Firestore
    ↓ importa
lib/firebase/
```

- `app/` solo contiene `page.tsx` y `layout.tsx`. Cero lógica.
- `components/` es UI atómica. No consulta Firestore. No contiene reglas de negocio.
- `features/` no importa entre módulos salvo a través de `hooks/` globales.
- `services/` es la única capa que escribe o lee Firestore.
- `user_skill_scores` solo puede ser escrito desde `features/assessments/services/`.

---

## Rutas

```
/                          → Landing
/auth                      → Login / Signup
/dashboard                 → Hub principal (requiere auth)
/dashboard/line            → THE LINE — evaluaciones
/dashboard/core            → CORE — perfil del developer
/dashboard/jobs            → Vacantes
/dashboard/compatibility   → Match con vacantes
/dashboard/roadmap         → Roadmap personalizado
/dashboard/profile         → Configuración de perfil
```

**Regla:** Ninguna ruta de funcionalidad existe fuera de `/dashboard/`.

---

## Stack

- Next.js 15, App Router, TypeScript strict
- Firebase Auth (GitHub OAuth + Google OAuth)
- Firestore como base de datos principal
- Firebase Storage para assets
- Genkit + Vertex AI (generación offline de preguntas)
- Tailwind CSS
- Three.js r128 (módulo CORE)

---

*Versión: 1.0 — Junio 2025*
