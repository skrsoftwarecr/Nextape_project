import { describe, it, expect } from "vitest";
import {
  SOURCE_CATALOG,
  UNIVERSAL_SOURCES,
  resolveSourcesForSkill,
  allSources,
} from "./sources";

describe("SOURCE_CATALOG", () => {
  it("solo contiene URLs https", () => {
    const bad = allSources().filter((u) => !u.startsWith("https://"));
    expect(bad).toEqual([]);
  });

  it("cubre las categorías declaradas por el equipo", () => {
    for (const key of ["frontend", "backend", "databases", "devops", "security", "testing"] as const) {
      expect(SOURCE_CATALOG[key].length).toBeGreaterThan(0);
    }
  });
});

describe("resolveSourcesForSkill", () => {
  it("resuelve la documentación oficial de una tecnología conocida", () => {
    expect(resolveSourcesForSkill("react")).toContain("https://react.dev");
    expect(resolveSourcesForSkill("postgresql")).toContain("https://www.postgresql.org/docs");
    expect(resolveSourcesForSkill("kubernetes")).toContain("https://kubernetes.io/docs");
  });

  it("acepta alias y mayúsculas", () => {
    expect(resolveSourcesForSkill("Next.js")).toContain("https://nextjs.org/docs");
    expect(resolveSourcesForSkill("K8S")).toContain("https://kubernetes.io/docs");
    expect(resolveSourcesForSkill("golang")).toContain("https://go.dev/doc");
  });

  it("resuelve por coincidencia parcial ('react hooks' → react)", () => {
    expect(resolveSourcesForSkill("react hooks")).toContain("https://react.dev");
  });

  it("cae en fuentes transversales ante una skill desconocida", () => {
    const out = resolveSourcesForSkill("brainfuck");
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((u) => UNIVERSAL_SOURCES.includes(u))).toBe(true);
  });

  it("nunca devuelve una lista vacía ni repetidos", () => {
    for (const skill of ["react", "", "   ", "cobol", "docker"]) {
      const out = resolveSourcesForSkill(skill);
      expect(out.length).toBeGreaterThan(0);
      expect(new Set(out).size).toBe(out.length);
    }
  });

  it("respeta el máximo pedido", () => {
    expect(resolveSourcesForSkill("react", 2)).toHaveLength(2);
  });
});
