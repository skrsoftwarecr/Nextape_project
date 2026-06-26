# NEXTAPE — Estándares de Código

---

## Naming

| Tipo | Convención | Ejemplo |
|---|---|---|
| Componente React | PascalCase.tsx | JobCard.tsx |
| Hook | camelCase con `use` | useCompatibility.ts |
| Servicio | camelCase.service.ts | jobs.service.ts |
| Tipos | camelCase.types.ts | user.types.ts |
| Página Next.js | page.tsx | page.tsx |
| Layout Next.js | layout.tsx | layout.tsx |

---

## Estructura de un componente

```typescript
// 1. Imports externos
import { useState } from 'react';
// 2. Imports internos
import { useAuth } from '@/hooks/useAuth';
// 3. Tipos
import type { User } from '@/types/user.types';

// 4. Props
interface Props { user: User; }

// 5. Componente
function ProfileCard({ user }: Props) { ... }

// 6. Export al final
export default ProfileCard;
```

---

## Restricciones absolutas

- No usar `any` en TypeScript.
- No consultar Firestore desde `components/`.
- No poner lógica de negocio en `page.tsx`.
- No crear `page.tsx` fuera de `src/app/dashboard/` o `src/app/auth/`.
- No usar route groups `(carpeta)` que generen colisión de rutas.
- No usar `localStorage` — Firebase Auth maneja la sesión.
- No modificar `user_skill_scores` fuera de `features/assessments/services/`.

---

## Commits

```
feat: descripción del feature
fix: descripción del bug
refactor: mejora sin cambio de comportamiento
docs: cambios en documentación
chore: dependencias, config
```

---

*Versión: 1.0 — Junio 2025*
