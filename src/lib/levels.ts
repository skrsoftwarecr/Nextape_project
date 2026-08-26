/**
 * Niveles de dificultad, en orden. `senior` es el techo (se retiró `master`).
 *
 * Duplica `LEVELS` de `src/lib/server/assessment.ts` a propósito: ese módulo es server-only
 * —arrastra el Admin SDK y el motor— y la UI no puede importarlo.
 */
export const LEVELS = ["junior", "mid", "senior"] as const;

export const LEVEL_LABELS: Record<string, string> = {
  junior: "Junior",
  mid: "Mid",
  senior: "Senior",
};
