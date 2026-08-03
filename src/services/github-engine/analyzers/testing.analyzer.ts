/**
 * @fileOverview Analizador de Testing y Cobertura Detectada (Función Pura).
 * Revisa la cantidad de tests en el IR y combina las señales de GitHub (hasTests, hasCI).
 * Devuelve un score 0 a 100.
 */

import type { EngineeringIR } from '../ir/types';
import type { RepoSignals } from '../../../types/github.types';

export interface TestingAnalysisResult {
  score: number;
  testCount: number;
  hasTestsSignal: boolean;
  hasCISignal: boolean;
}

export function analyzeTesting(
  ir: EngineeringIR,
  signals?: RepoSignals,
): TestingAnalysisResult {
  const testCount = ir.totalTests;
  const hasTestsSignal = signals?.hasTests ?? (testCount > 0);
  const hasCISignal = signals?.hasCI ?? false;

  let score = 0;

  if (hasTestsSignal) {
    score += 50;
  }
  if (hasCISignal) {
    score += 30;
  }
  if (testCount > 0) {
    score += Math.min(20, testCount * 4);
  }

  return {
    score: Math.min(100, score),
    testCount,
    hasTestsSignal,
    hasCISignal,
  };
}
