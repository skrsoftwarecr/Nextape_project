import { describe, it, expect } from "vitest";
import { gradeAnswers, stripAnswerKey, SPECIALTY_STACKS } from "./assessment";
import type { Question } from "@/types/job.types";

const q = (id: string, tag: string, correctIndex: number): Question => ({
  id,
  tag,
  correctIndex,
  briefing: "b",
  text: "t",
  options: ["0", "1", "2", "3"],
  difficulty: "senior",
});

describe("gradeAnswers", () => {
  it("puntúa por tag y global", () => {
    const questions = [q("1", "react", 0), q("2", "react", 1), q("3", "docker", 2)];
    // react: acierta la 1 (0==0), falla la 2 (0!=1) → 50; docker: acierta (2==2) → 100
    const { skillScores, overall } = gradeAnswers(questions, [0, 0, 2]);
    expect(skillScores.react).toBe(50);
    expect(skillScores.docker).toBe(100);
    expect(overall).toBe(67); // 2/3 = 66.6 → 67
  });

  it("maneja examen vacío", () => {
    expect(gradeAnswers([], []).overall).toBe(0);
  });

  it("normaliza el tag a minúsculas", () => {
    const { skillScores } = gradeAnswers([q("1", "React", 0)], [0]);
    expect(skillScores.react).toBe(100);
  });
});

describe("stripAnswerKey", () => {
  it("elimina correctIndex antes de enviar al cliente", () => {
    const stripped = stripAnswerKey([q("1", "react", 2)]);
    expect("correctIndex" in stripped[0]).toBe(false);
    expect(stripped[0].tag).toBe("react");
    expect(stripped[0].options).toHaveLength(4);
  });
});

describe("SPECIALTY_STACKS", () => {
  it("define los stacks esperados", () => {
    expect(SPECIALTY_STACKS.frontend).toContain("react");
    expect(SPECIALTY_STACKS.backend).toContain("postgresql");
    expect(SPECIALTY_STACKS.devops).toContain("kubernetes");
  });
});
