import { describe, it, expect } from "vitest";
import { calculateMatch } from "./match";

describe("calculateMatch", () => {
  it("devuelve 0 sin skills o sin scores", () => {
    expect(calculateMatch([], { react: 100 })).toBe(0);
    expect(calculateMatch(["react"], {})).toBe(0);
  });

  it("devuelve 0 si no coincide ninguna skill", () => {
    expect(calculateMatch(["go"], { react: 100 })).toBe(0);
  });

  it("normaliza a minúsculas y divide entre TODAS las requeridas", () => {
    // 1 de 2 skills presente (100) → 100/2 = 50
    expect(calculateMatch(["React", "Docker"], { react: 100 })).toBe(50);
    expect(calculateMatch(["react"], { react: 80 })).toBe(80);
  });

  it("suma varias skills presentes", () => {
    // (100 + 60) / 2 = 80
    expect(calculateMatch(["react", "docker"], { react: 100, docker: 60 })).toBe(80);
  });
});
