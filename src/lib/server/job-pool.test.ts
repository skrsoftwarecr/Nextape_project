import { describe, it, expect } from "vitest";
import { buildJobPoolFromBank, levelFallbackOrder, JOB_POOL_MAX_SKILLS } from "./job-pool";
import type { MultipleChoiceQuestion, Question } from "@/types/question.types";

const mc = (tag: string, i: number): MultipleChoiceQuestion => ({
  id: String(i),
  tag,
  text: `pregunta ${tag} ${i}`,
  briefing: "b",
  difficulty: "mid",
  type: "multiple_choice",
  options: ["0", "1", "2", "3"],
  correctIndex: i % 4,
});

const bankDoc = (tag: string, n: number): Question[] => Array.from({ length: n }, (_, i) => mc(tag, i));

describe("levelFallbackOrder", () => {
  it("empieza por el nivel de la vacante y sigue por cercanía", () => {
    expect(levelFallbackOrder("junior")).toEqual(["junior", "mid", "senior"]);
    expect(levelFallbackOrder("mid")).toEqual(["mid", "senior", "junior"]);
    expect(levelFallbackOrder("senior")).toEqual(["senior", "mid", "junior"]);
  });

  it("trata niveles heredados o desconocidos como senior", () => {
    expect(levelFallbackOrder("master")[0]).toBe("senior");
    expect(levelFallbackOrder("")[0]).toBe("senior");
  });
});

describe("buildJobPoolFromBank", () => {
  it("compone desde el nivel de la vacante con tags canónicos e ids únicos", () => {
    const result = buildJobPoolFromBank({
      skills: ["react", "node.js"],
      level: "mid",
      bank: { react_mid: bankDoc("react", 12), "node.js_mid": bankDoc("node.js", 12) },
    });

    expect(result.missing).toEqual([]);
    expect(result.covered.map((c) => [c.key, c.level, c.questions])).toEqual([
      ["react", "mid", 12],
      ["node.js", "mid", 12],
    ]);
    expect(result.questions).toHaveLength(24);
    expect(new Set(result.questions.map((q) => q.id)).size).toBe(24);
    expect(new Set(result.questions.map((q) => q.tag))).toEqual(new Set(["react", "node.js"]));
  });

  it("resuelve alias y no duplica la misma skill escrita de dos formas", () => {
    const result = buildJobPoolFromBank({
      skills: ["React.js", "react", "NodeJS"],
      level: "mid",
      bank: { react_mid: bankDoc("react", 10), "node.js_mid": bankDoc("node.js", 10) },
    });

    expect(result.covered.map((c) => c.key)).toEqual(["react", "node.js"]);
    // El tag del banco se sustituye por la clave canónica, bajo la que se acredita el DNA.
    expect(result.questions.every((q) => q.tag === "react" || q.tag === "node.js")).toBe(true);
  });

  it("usa el nivel más cercano cuando no hay banco para el de la vacante", () => {
    const result = buildJobPoolFromBank({
      skills: ["react"],
      level: "mid",
      bank: { react_junior: bankDoc("react", 10), react_senior: bankDoc("react", 10) },
    });

    expect(result.covered[0].level).toBe("senior");
  });

  it("separa las skills desconocidas o sin banco en `missing`", () => {
    const result = buildJobPoolFromBank({
      skills: ["react", "cobol-85", "node.js"],
      level: "senior",
      bank: { react_senior: bankDoc("react", 10) },
    });

    expect(result.covered.map((c) => c.key)).toEqual(["react"]);
    expect(result.missing).toEqual(["cobol-85", "node.js"]);
  });

  it("limita las preguntas por skill", () => {
    const result = buildJobPoolFromBank({
      skills: ["react"],
      level: "senior",
      bank: { react_senior: bankDoc("react", 40) },
      perSkill: 15,
    });

    expect(result.questions).toHaveLength(15);
  });

  it(`solo compone las primeras ${JOB_POOL_MAX_SKILLS} skills`, () => {
    const skills = Array.from({ length: JOB_POOL_MAX_SKILLS + 3 }, () => "cobol-85");
    const result = buildJobPoolFromBank({ skills, level: "senior", bank: {} });

    expect(result.missing).toHaveLength(JOB_POOL_MAX_SKILLS);
  });

  it("devuelve un repertorio vacío si ninguna skill tiene banco", () => {
    const result = buildJobPoolFromBank({ skills: ["react"], level: "senior", bank: {} });

    expect(result.questions).toEqual([]);
    expect(result.missing).toEqual(["react"]);
  });
});
