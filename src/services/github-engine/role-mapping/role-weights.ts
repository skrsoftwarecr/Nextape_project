/**
 * @fileOverview Pesos de evaluación por Rol y Nivel Seniority.
 * Define la ponderación técnica según el objetivo profesional del desarrollador.
 */

export const TARGET_ROLES = ['frontend', 'backend', 'fullstack', 'devops', 'mobile'] as const;
export type TargetRole = (typeof TARGET_ROLES)[number];

export const SENIORITY_LEVELS = ['junior', 'mid', 'senior'] as const;
export type SeniorityLevel = (typeof SENIORITY_LEVELS)[number];

export interface SkillWeights {
  architecture: number;
  testing: number;
  security: number;
  maintainability: number;
  documentation: number;
}

export const ROLE_WEIGHTS: Record<TargetRole, SkillWeights> = {
  frontend: { architecture: 0.2, testing: 0.25, security: 0.1, maintainability: 0.25, documentation: 0.2 },
  backend: { architecture: 0.3, testing: 0.25, security: 0.2, maintainability: 0.15, documentation: 0.1 },
  fullstack: { architecture: 0.25, testing: 0.25, security: 0.15, maintainability: 0.2, documentation: 0.15 },
  devops: { architecture: 0.2, testing: 0.3, security: 0.3, maintainability: 0.1, documentation: 0.1 },
  mobile: { architecture: 0.25, testing: 0.2, security: 0.15, maintainability: 0.25, documentation: 0.15 },
};

export const SENIORITY_THRESHOLDS: Record<SeniorityLevel, number> = {
  junior: 50,
  mid: 70,
  senior: 85,
};
