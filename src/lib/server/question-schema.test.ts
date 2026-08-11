import { describe, it, expect } from "vitest";
import type { BankQuestion } from "@/types/question.types";
import { stripAnswerKey } from "@/lib/server/assessment";
import { toQuestion } from "@/lib/server/question-bank";

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
      createdAt: { seconds: 1735689600, nanoseconds: 0 },
    };

    // `toQuestion` es la conversión oficial banco → tipo canónico (añade `type` y baraja opciones).
    const stripped = stripAnswerKey([toQuestion(mockQuestion)]);

    expect(stripped).toHaveLength(1);
    const [publicQuestion] = stripped;
    expect(publicQuestion).not.toHaveProperty("correctIndex");
    expect(publicQuestion.id).toBe("q-test-101");
    expect(publicQuestion.briefing).toContain("Next.js");
    expect(publicQuestion.type).toBe("multiple_choice");
    expect("options" in publicQuestion && publicQuestion.options).toHaveLength(4);
  });

  it("toQuestion baraja las opciones pero conserva cuál es la correcta", () => {
    const bank: BankQuestion = {
      id: "q-shuffle",
      skill: "react",
      level: "senior",
      category: "architecture",
      tag: "react",
      briefing: "b",
      text: "t",
      options: ["CORRECTA", "b", "c", "d"],
      correctIndex: 0,
      difficultyScore: 0.5,
      version: "1.0.0",
    };

    // En el banco la correcta está casi siempre en la posición 0. Si no se barajara, marcar
    // siempre la primera opción aprobaría el examen entero.
    const positions = new Set<number>();
    for (let i = 0; i < 40; i++) {
      const q = toQuestion(bank);
      expect(q.options[q.correctIndex]).toBe("CORRECTA");
      positions.add(q.correctIndex);
    }
    expect(positions.size).toBeGreaterThan(1);
  });
});
