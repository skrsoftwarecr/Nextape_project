import { describe, it, expect } from "vitest";
import {
  examSizeFor,
  EXAM_SIZE_MAX,
  EXAM_SIZE_MIN,
  EXAM_SIZE_WITH_GITHUB,
  EXAM_SIZE_WITHOUT_GITHUB,
} from "./assessment";
import { hasGithubEvidence } from "./github-evidence";

describe("examSizeFor", () => {
  it("10 preguntas con GitHub analizado y 20 sin él", () => {
    expect(EXAM_SIZE_WITH_GITHUB).toBe(10);
    expect(EXAM_SIZE_WITHOUT_GITHUB).toBe(20);
    expect(examSizeFor({ hasGithubEvidence: true })).toBe(10);
    expect(examSizeFor({ hasGithubEvidence: false })).toBe(20);
  });

  it("respeta el tamaño fijado por el reclutador dentro de 10–30", () => {
    expect(examSizeFor({ hasGithubEvidence: true, override: 15 })).toBe(15);
    expect(examSizeFor({ hasGithubEvidence: false, override: 15 })).toBe(15);
  });

  it("recorta overrides fuera de rango, incluidos valores heredados de 3–9", () => {
    expect(examSizeFor({ hasGithubEvidence: false, override: 5 })).toBe(EXAM_SIZE_MIN);
    expect(examSizeFor({ hasGithubEvidence: false, override: 500 })).toBe(EXAM_SIZE_MAX);
    expect(examSizeFor({ hasGithubEvidence: false, override: -3 })).toBe(EXAM_SIZE_MIN);
  });

  it("ignora overrides que no son enteros (automático)", () => {
    expect(examSizeFor({ hasGithubEvidence: false, override: null })).toBe(20);
    expect(examSizeFor({ hasGithubEvidence: false, override: "15" })).toBe(20);
    expect(examSizeFor({ hasGithubEvidence: true, override: 12.5 })).toBe(10);
    expect(examSizeFor({ hasGithubEvidence: true, override: Number.NaN })).toBe(10);
  });
});

describe("hasGithubEvidence", () => {
  const verified = { identity: { verified: true, method: "github_oauth" } };

  it("es falso sin documento o sin código analizado", () => {
    expect(hasGithubEvidence(undefined)).toBe(false);
    expect(hasGithubEvidence({ ...verified })).toBe(false);
    expect(hasGithubEvidence({ ...verified, reposWithCode: 0, skillScores: { hasASTData: false } })).toBe(false);
  });

  it("es verdadero con código analizado de la cuenta verificada", () => {
    expect(hasGithubEvidence({ ...verified, reposWithCode: 3 })).toBe(true);
    expect(hasGithubEvidence({ ...verified, skillScores: { hasASTData: true } })).toBe(true);
  });

  it("no compensa con la cuenta de otra persona ni con perfiles antiguos sin identidad", () => {
    expect(hasGithubEvidence({ reposWithCode: 3, identity: { verified: false, method: null } })).toBe(false);
    expect(hasGithubEvidence({ reposWithCode: 3, identity: { verified: false, method: "github_oauth" } })).toBe(false);
    expect(hasGithubEvidence({ reposWithCode: 3 })).toBe(false);
    expect(hasGithubEvidence({ skillScores: { hasASTData: true } })).toBe(false);
  });
});
