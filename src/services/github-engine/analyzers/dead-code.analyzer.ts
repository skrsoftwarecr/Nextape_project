/**
 * @fileOverview Analizador de Código Muerto y Exportaciones Sin Uso (Función Pura).
 * Determina qué funciones/clases/variables exportadas o internas parecen no tener referencias
 * o usos detectados dentro de los archivos analizados.
 * Devuelve un score 0 a 100 (100 = 0% código muerto).
 */

import type { EngineeringIR } from '../ir/types';

export interface DeadCodeAnalysisResult {
  score: number | null;
  unusedExportsCount: number;
  totalExportsCount: number;
}

export function analyzeDeadCode(ir: EngineeringIR): DeadCodeAnalysisResult {
  const allExports = ir.files.flatMap((f) => f.exports);
  if (ir.files.length === 0) {
    return {
      score: null,
      unusedExportsCount: 0,
      totalExportsCount: 0,
    };
  }

  // ⚠️ SIN IMPLEMENTAR. El IR solo guarda el `source` del import (la ruta del módulo), no los
  // identificadores importados, así que no se puede saber qué exports quedan sin referenciar.
  //
  // Antes esto devolvía SIEMPRE 100 ("0 % de código muerto") para cualquier repositorio, y ese
  // 100 falso se propagaba con peso a `security` y `maintainability`, que se enseñan al usuario
  // como análisis determinístico de su código. Devolver `null` es la respuesta honesta: no se ha
  // medido. El mismo patrón que ya usa el resto del motor para "no analizable".
  const score = null;
  const unusedCount = 0;

  return {
    score,
    unusedExportsCount: unusedCount,
    totalExportsCount: allExports.length,
  };
}
