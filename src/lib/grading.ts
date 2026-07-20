/**
 * Cálculo unificado del "Technical Grade" a partir de los scores del DNA técnico.
 *
 * Fuente ÚNICA de verdad. Antes la lógica estaba duplicada y divergía entre CORE
 * (S/A+/A/B/C con umbral >95) y Perfil (S/A/B/C con umbral >90), y el Perfil producía
 * `NaN` con scores vacíos. Usa siempre estas funciones.
 */
export type TechnicalGrade = "S" | "A+" | "A" | "B" | "C" | "N/A";

/** Promedio de todos los scores. Devuelve `null` si no hay datos. */
export function calculateAverageScore(
  scores: Record<string, number> | undefined | null
): number | null {
  if (!scores) return null;
  const values = Object.values(scores);
  if (values.length === 0) return null;
  return values.reduce((acc, v) => acc + v, 0) / values.length;
}

/** Grado técnico derivado del promedio de scores. `"N/A"` cuando no hay datos. */
export function getTechnicalGrade(
  scores: Record<string, number> | undefined | null
): TechnicalGrade {
  const avg = calculateAverageScore(scores);
  if (avg === null) return "N/A";
  if (avg > 95) return "S";
  if (avg > 90) return "A+";
  if (avg > 80) return "A";
  if (avg > 60) return "B";
  return "C";
}
