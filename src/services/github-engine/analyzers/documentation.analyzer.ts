/**
 * @fileOverview Analizador de Documentación (Función Pura).
 * Mide el ratio de funciones/clases documentadas en el IR y presencia de README en el repo.
 * Devuelve un score 0 a 100.
 */

import type { EngineeringIR } from '../ir/types';
import type { RepoSignals } from '../../../types/github.types';

export interface DocumentationAnalysisResult {
  score: number;
  docCoverageRatio: number;
  hasReadme: boolean;
  readmeLength: number;
}

export function analyzeDocumentation(
  ir: EngineeringIR,
  signals?: RepoSignals,
): DocumentationAnalysisResult {
  const docCoverageRatio = ir.docCoverageRatio;
  const hasReadme = signals?.hasReadme ?? false;
  const readmeLength = signals?.readmeLength ?? 0;

  let score = docCoverageRatio * 50; // 50 pts por JSDoc/comentarios en código

  if (hasReadme) {
    score += 30; // 30 pts por existir README
    if (readmeLength > 500) {
      score += 20; // 20 pts por README detallado
    } else {
      score += Math.round((readmeLength / 500) * 20);
    }
  }

  return {
    score: Math.min(100, Math.round(score)),
    docCoverageRatio,
    hasReadme,
    readmeLength,
  };
}
