import { describe, it, expect } from "vitest";
import { getTechnicalGrade, calculateAverageScore } from "./grading";

describe("calculateAverageScore", () => {
  it("devuelve null sin datos", () => {
    expect(calculateAverageScore(undefined)).toBeNull();
    expect(calculateAverageScore(null)).toBeNull();
    expect(calculateAverageScore({})).toBeNull();
  });

  it("promedia varias skills", () => {
    expect(calculateAverageScore({ a: 80, b: 100 })).toBe(90);
    expect(calculateAverageScore({ a: 50 })).toBe(50);
  });
});

describe("getTechnicalGrade", () => {
  it("devuelve N/A sin datos", () => {
    expect(getTechnicalGrade(undefined)).toBe("N/A");
    expect(getTechnicalGrade({})).toBe("N/A");
  });

  it("aplica los umbrales unificados", () => {
    expect(getTechnicalGrade({ a: 100 })).toBe("S"); // > 95
    expect(getTechnicalGrade({ a: 92 })).toBe("A+"); // > 90
    expect(getTechnicalGrade({ a: 85 })).toBe("A"); // > 80
    expect(getTechnicalGrade({ a: 70 })).toBe("B"); // > 60
    expect(getTechnicalGrade({ a: 40 })).toBe("C");
  });

  it("usa el promedio, no un único valor", () => {
    // avg 90 → no es > 90 → A
    expect(getTechnicalGrade({ a: 80, b: 100 })).toBe("A");
  });
});
