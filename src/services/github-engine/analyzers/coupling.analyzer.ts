/**
 * @fileOverview Analizador de Acoplamiento y Dependencias (Función Pura).
 * Evalúa la cantidad de imports externos y el acoplamiento entre módulos por archivo.
 * Devuelve un score de 0 a 100 donde 100 indica diseño modular desacoplado.
 */

import type { EngineeringIR } from '../ir/types';

export interface CouplingAnalysisResult {
  score: number | null;
  avgImportsPerFile: number;
  externalImportsCount: number;
  highCouplingFilesCount: number;
}

export function analyzeCoupling(ir: EngineeringIR): CouplingAnalysisResult {
  if (ir.files.length === 0) {
    return {
      score: null,
      avgImportsPerFile: 0,
      externalImportsCount: 0,
      highCouplingFilesCount: 0,
    };
  }

  let totalImports = 0;
  const externalSources = new Set<string>();
  let highCouplingFilesCount = 0;

  for (const file of ir.files) {
    const importCount = file.imports.length;
    totalImports += importCount;

    if (importCount > 12) {
      highCouplingFilesCount++;
    }

    for (const imp of file.imports) {
      if (imp.isExternal) {
        externalSources.add(imp.source);
      }
    }
  }

  const avgImportsPerFile = totalImports / ir.files.length;

  // Ideal: 3-8 imports por archivo.
  // Penalizamos si el promedio excede 8 o si hay archivos con > 12 imports ("God modules")
  let rawScore = 100;
  if (avgImportsPerFile > 8) {
    rawScore -= (avgImportsPerFile - 8) * 5;
  }

  rawScore -= highCouplingFilesCount * 10;

  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  return {
    score,
    avgImportsPerFile: Math.round(avgImportsPerFile * 10) / 10,
    externalImportsCount: externalSources.size,
    highCouplingFilesCount,
  };
}
