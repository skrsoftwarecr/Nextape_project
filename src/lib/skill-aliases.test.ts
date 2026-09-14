import { describe, it, expect } from "vitest";
import { canonicalSkillKey, resolveTechnologyId } from "./technologies";
import { calculateMatch } from "./match";

describe("resolveTechnologyId", () => {
  it("acepta el id exacto sin distinguir mayúsculas ni espacios", () => {
    expect(resolveTechnologyId("react")).toBe("react");
    expect(resolveTechnologyId("  React ")).toBe("react");
  });

  it("resuelve alias habituales al id del catálogo", () => {
    expect(resolveTechnologyId("React.js")).toBe("react");
    expect(resolveTechnologyId("NodeJS")).toBe("node.js");
    expect(resolveTechnologyId("node")).toBe("node.js");
  });

  it("devuelve null para vacíos o tecnologías desconocidas", () => {
    expect(resolveTechnologyId("")).toBeNull();
    expect(resolveTechnologyId(null)).toBeNull();
    expect(resolveTechnologyId(undefined)).toBeNull();
    expect(resolveTechnologyId("cobol-85")).toBeNull();
  });
});

describe("canonicalSkillKey", () => {
  it("usa el id canónico cuando existe y minúsculas si no", () => {
    expect(canonicalSkillKey("React.js")).toBe("react");
    expect(canonicalSkillKey("  COBOL-85 ")).toBe("cobol-85");
  });
});

describe("calculateMatch con alias", () => {
  it("encuentra el score aunque la vacante escriba la skill con otra grafía", () => {
    expect(calculateMatch(["React.js", "NodeJS"], { react: 80, "node.js": 60 })).toBe(70);
  });

  it("sigue aceptando DNA antiguo guardado con el texto en minúsculas", () => {
    expect(calculateMatch(["COBOL-85"], { "cobol-85": 90 })).toBe(90);
  });
});
