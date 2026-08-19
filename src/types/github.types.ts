/**
 * @fileOverview Tipos canónicos del GitHub Evaluation Engine.
 * Fuente de verdad para las tres capas: Signals (API), Engine (AST/IR) y Feedback (Mistral).
 * Ver docs/DATABASE.md (colección `github_evidence`) y docs/ARCHITECTURE.md §GitHub Engine.
 */

// ─────────────────────────────────────────────────────────
// CAPA 1 — Señales crudas de la GitHub API
// ─────────────────────────────────────────────────────────

/** Repositorio simplificado devuelto por GET /users/{username}/repos */
export interface GithubRepo {
  name: string;
  fullName: string;        // "owner/repo"
  owner: string;
  isForked: boolean;
  pushedAt: string | null; // ISO 8601
  stargazersCount: number;
  sizeKB: number;
  language: string | null;
}

/** Señales brutas extraídas de la GitHub API para un repositorio concreto */
export interface RepoSignals {
  owner: string;
  repo: string;
  lastCommitSHA: string;
  /** Commits propios en los últimos 90 días */
  commitFrequency90d: number;
  /** Mapa de lenguajes → bytes de código */
  languages: Record<string, number>;
  hasTests: boolean;
  hasCI: boolean;
  hasReadme: boolean;
  readmeLength: number;
  sizeKB: number;
  stargazersCount: number;
}

// ─────────────────────────────────────────────────────────
// CAPA 2 — IR Universal + Métricas del motor determinístico
// ─────────────────────────────────────────────────────────

/** Métricas calculadas por los analyzers (valores numéricos 0–100 o razones) */
export interface EngineMetrics {
  /** Complejidad ciclomática media (null si no hay archivos AST analizados) */
  complexityScore: number | null;
  /** Acoplamiento entre módulos (null si no hay archivos AST analizados) */
  couplingScore: number | null;
  /** Proporción de código muerto detectado (null si no hay archivos AST analizados) */
  deadCodeScore: number | null;
  /** Cobertura de tests detectada (score 0-100) */
  testingScore: number;
  /** Presencia y calidad de documentación inline (score 0-100) */
  documentationScore: number;
}

/** Scores finales por skill, calculados por el skill-mapper a partir de EngineMetrics */
export interface GithubSkillScores {
  /** Arquitectura y estructura del código (null si no hay parsers AST para el lenguaje) */
  architecture: number | null;
  /** Calidad y cobertura de tests */
  testing: number;
  /** Seguridad básica detectada en patrones (null si no hay parsers AST para el lenguaje) */
  security: number | null;
  /** Mantenibilidad general (null si no hay parsers AST para el lenguaje) */
  maintainability: number | null;
  /** Documentación del código */
  documentation: number;
  /** Puntuación global ponderada (0-100), calculada dinámicamente sobre métricas disponibles */
  overall: number;
  /** Top debilidades o advertencias para la IA */
  topWeaknesses: string[];
  /** Indica si se pudieron parsear archivos fuente AST */
  hasASTData: boolean;
}

// ─────────────────────────────────────────────────────────
// CAPA 3 — Feedback de Mistral
// ─────────────────────────────────────────────────────────

/** Feedback generado por Mistral a partir de GithubSkillScores (nunca código fuente) */
export interface GithubAIFeedback {
  feedback: string;
  strengths: string[];
  improvements: string[];
}

// ─────────────────────────────────────────────────────────
// Resultado completo — lo que se guarda en github_evidence/{uid}
// ─────────────────────────────────────────────────────────

/**
 * Documento guardado en `github_evidence/{uid}` (server-only, Admin SDK).
 * Cache por SHA: si `lastCommitSHA` no cambia, se devuelve el resultado existente.
 */
export interface GithubEvidence {
  uid: string;
  githubUsername: string;
  analyzedRepo: string;        // "owner/repo"
  lastCommitSHA: string;       // clave de cache
  repoSignals: RepoSignals;
  metrics: EngineMetrics;
  skillScores: GithubSkillScores;
  aiFeedback: GithubAIFeedback | null;
  analyzedAt: FirebaseFirestore.Timestamp | { _seconds: number; _nanoseconds: number };
  /** Versión del motor, para invalidar cache si el algoritmo cambia */
  engineVersion: string;
}

/** Respuesta pública del route handler POST /api/github/evaluate */
export interface GithubEvaluateResponse {
  cached: boolean;
  analyzedRepo: string;
  skillScores: GithubSkillScores;
  aiFeedback: GithubAIFeedback | null;
  analyzedAt: string; // ISO 8601
}
