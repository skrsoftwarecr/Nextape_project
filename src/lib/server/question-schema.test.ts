import { describe, it, expect } from "vitest";
import type { BankQuestion } from "@/types/question.types";
import { stripAnswerKey } from "@/lib/server/assessment";
import type { Question } from "@/types/job.types";

describe("BankQuestion Schema & Helpers", () => {
  it("should format a valid BankQuestion and correctly strip the answer key for public exposure", () => {
    const mockQuestion: BankQuestion = {
      id: "q-test-101",
      skill: "react",
      level: "senior",
      category: "architecture",
      tag: "react",
      briefing: "Un sistema de Next.js experimenta re-renders masivos en componentes hijos.",
      text: "¿Cuál es la causa raíz estructural y la técnica de optimización recomendada?",
      options: [
        "Usar React.memo con una función de comparación customizada en la frontera de render",
        "Reemplazar todo el estado local con variables globales mutables",
        "Desactivar el modo estricto en next.config.js",
        "Mover la lógica del servidor a un hook en el cliente"
      ],
      correctIndex: 0,
      difficultyScore: 0.8,
      version: "1.0.0",
      createdAt: { seconds: 1735689600, nanoseconds: 0 } as any,
    };

    // Adapt to Question type for stripAnswerKey helper
    const questionsList: Question[] = [mockQuestion as unknown as Question];
    const stripped = stripAnswerKey(questionsList);

    expect(stripped).toHaveLength(1);
    expect(stripped[0]).not.toHaveProperty("correctIndex");
    expect(stripped[0].id).toBe("q-test-101");
    expect(stripped[0].briefing).toContain("Next.js");
    expect(stripped[0].options).toHaveLength(4);
  });
});
