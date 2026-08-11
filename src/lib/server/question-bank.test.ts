import { describe, it, expect } from "vitest";
import { sampleBankQuestions, INITIAL_QUESTION_BANK } from "./question-bank";
import { LEVELS } from "./assessment";
import { findTechnology } from "@/lib/technologies";

describe("Question Bank Sampler (Zero-LLM Runtime)", () => {
  it("should return the requested number of questions for a valid skill stack", async () => {
    const questions = await sampleBankQuestions(["react", "typescript"], "senior", 5);
    expect(questions).toHaveLength(5);
    questions.forEach((q) => {
      expect(q).toHaveProperty("id");
      expect(q).toHaveProperty("briefing");
      expect(q).toHaveProperty("text");
      expect(q).toHaveProperty("options");
      expect(q.options).toHaveLength(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThanOrEqual(3);
    });
  });

  it("should contain non-empty initial fallback question bank", () => {
    expect(INITIAL_QUESTION_BANK.length).toBeGreaterThanOrEqual(10);
  });
});

describe("Integridad del banco curado", () => {
  it("no tiene ids repetidos", () => {
    const ids = INITIAL_QUESTION_BANK.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("no tiene enunciados repetidos", () => {
    const texts = INITIAL_QUESTION_BANK.map((q) => q.text.trim().toLowerCase());
    expect(new Set(texts).size).toBe(texts.length);
  });

  it("usa solo niveles válidos: 'master' ya no existe", () => {
    for (const q of INITIAL_QUESTION_BANK) {
      expect(LEVELS).toContain(q.level);
    }
  });

  it("tiene 4 opciones y un correctIndex dentro de rango", () => {
    for (const q of INITIAL_QUESTION_BANK) {
      expect(q.options).toHaveLength(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
      expect(new Set(q.options).size).toBe(q.options.length);
    }
  });

  it("cada `skill` y `tag` existe en el catálogo de tecnologías", () => {
    // Si esto falla, la pregunta acreditaría el score bajo una clave que el match nunca casa.
    for (const q of INITIAL_QUESTION_BANK) {
      expect(findTechnology(q.skill), `skill desconocida: ${q.skill}`).toBeDefined();
      expect(findTechnology(q.tag), `tag desconocido: ${q.tag}`).toBeDefined();
    }
  });

  it("usa `tag` en minúsculas y `difficultyScore` normalizado", () => {
    for (const q of INITIAL_QUESTION_BANK) {
      expect(q.tag).toBe(q.tag.toLowerCase());
      expect(q.difficultyScore).toBeGreaterThan(0);
      expect(q.difficultyScore).toBeLessThanOrEqual(1);
    }
  });

  it("cubre backend, bases de datos y seguridad además de frontend", () => {
    const skills = new Set(INITIAL_QUESTION_BANK.map((q) => q.skill));
    for (const expected of ["node.js", "postgresql", "security", "microservices", "testing"]) {
      expect(skills, `falta cobertura de ${expected}`).toContain(expected);
    }
  });

  it("cubre los tres niveles", () => {
    const levels = new Set(INITIAL_QUESTION_BANK.map((q) => q.level));
    expect(levels).toContain("junior");
    expect(levels).toContain("mid");
    expect(levels).toContain("senior");
  });
});
