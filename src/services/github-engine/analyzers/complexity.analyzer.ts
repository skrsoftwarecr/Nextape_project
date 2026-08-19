/**
 * @fileOverview Analizador de Complejidad Ciclomática (Función Pura).
 * Evalúa la complejidad ciclomática promedio de las funciones presentes en el IR.
 * Devuelve un score de 0 a 100 donde 100 es mínima complejidad (código muy mantenible)
 * y 0 es complejidad extrema (spaghetti code / funciones monolíticas).
 */

import type { EngineeringIR } from '../ir/types';

export interface ComplexityAnalysisResult {
  score: number | null;
  avgCyclomaticComplexity: number;
  maxCyclomaticComplexity: number;
  complexFunctionsCount: number;
}

/**
 * Analiza la complejidad ciclomática del IR.
 * Escala de evaluación por función:
 * - 1 a 5: Excelente (baja complejidad)
 * - 6 a 10: Moderada
 * - 11 a 20: Alta (refactorización recomendada)
 * - > 20: Crítica (código propenso a bugs)
 */
export function analyzeComplexity(ir: EngineeringIR): ComplexityAnalysisResult {
  const allFunctions = ir.files.flatMap((f) => f.functions);
  if (ir.files.length === 0 || allFunctions.length === 0) {
    return {
      score: null,
      avgCyclomaticComplexity: 0,
      maxCyclomaticComplexity: 0,
      complexFunctionsCount: 0,
    };
  }

  let totalComplexity = 0;
  let maxComplexity = 1;
  let complexFunctionsCount = 0;

  for (const fn of allFunctions) {
    totalComplexity += fn.cyclomaticComplexity;
    if (fn.cyclomaticComplexity > maxComplexity) {
      maxComplexity = fn.cyclomaticComplexity;
    }
    if (fn.cyclomaticComplexity > 10) {
      complexFunctionsCount++;
    }
  }

  const avgCyclomaticComplexity = totalComplexity / allFunctions.length;

  // Penalización por complejidad alta:
  // Complejidad ideal <= 4 -> score 100
  // Por cada punto por encima de 4, restamos 8 puntos del score
  // Penalización adicional por funciones de complejidad > 10
  let rawScore = 100 - Math.max(0, avgCyclomaticComplexity - 4) * 8;
  rawScore -= complexFunctionsCount * 5;

  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  return {
    score,
    avgCyclomaticComplexity: Math.round(avgCyclomaticComplexity * 10) / 10,
    maxCyclomaticComplexity: maxComplexity,
    complexFunctionsCount,
  };
}
