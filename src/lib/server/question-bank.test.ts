import { describe, it, expect } from "vitest";
import { sampleBankQuestions, INITIAL_QUESTION_BANK } from "./question-bank";

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
