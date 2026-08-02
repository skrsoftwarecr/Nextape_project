import { describe, it, expect } from "vitest";
import {
  TECHNOLOGIES,
  TECH_CATEGORIES,
  CATEGORY_LABELS,
  findTechnology,
  technologiesByCategory,
} from "./technologies";
import { resolveSourcesForSkill, UNIVERSAL_SOURCES } from "./server/sources";

describe("catálogo de tecnologías", () => {
  it("no tiene ids repetidos", () => {
    const ids = TECHNOLOGIES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("todos los ids están en minúsculas (invariante del DNA)", () => {
    for (const t of TECHNOLOGIES) {
      expect(t.id).toBe(t.id.toLowerCase());
    }
  });

  it("toda tecnología pertenece a una categoría declarada y etiquetada", () => {
    for (const t of TECHNOLOGIES) {
      expect(TECH_CATEGORIES).toContain(t.category);
      expect(CATEGORY_LABELS[t.category]).toBeTruthy();
    }
  });

  it("toda tecnología tiene etiqueta legible", () => {
    for (const t of TECHNOLOGIES) {
      expect(t.label.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("findTechnology", () => {
  it("encuentra por id exacto y normaliza entrada", () => {
    expect(findTechnology("react")?.label).toBe("React");
    expect(findTechnology("  POSTGRESQL ")?.id).toBe("postgresql");
  });

  it("devuelve undefined para lo desconocido", () => {
    expect(findTechnology("cobol")).toBeUndefined();
    expect(findTechnology("")).toBeUndefined();
    expect(findTechnology(null)).toBeUndefined();
  });
});

describe("technologiesByCategory", () => {
  it("agrupa sin perder ninguna tecnología", () => {
    const total = technologiesByCategory().reduce((n, g) => n + g.items.length, 0);
    expect(total).toBe(TECHNOLOGIES.length);
  });

  it("no devuelve grupos vacíos", () => {
    for (const group of technologiesByCategory()) {
      expect(group.items.length).toBeGreaterThan(0);
    }
  });
});

describe("integración catálogo ↔ fuentes", () => {
  it("toda tecnología resuelve fuentes de referencia", () => {
    for (const t of TECHNOLOGIES) {
      expect(resolveSourcesForSkill(t.id).length).toBeGreaterThan(0);
    }
  });

  it("la mayoría resuelve documentación ESPECÍFICA, no solo el respaldo transversal", () => {
    const universal = new Set(UNIVERSAL_SOURCES);
    const specific = TECHNOLOGIES.filter((t) =>
      resolveSourcesForSkill(t.id).some((url) => !universal.has(url))
    );
    // Si esto baja, es que se añadieron tecnologías al catálogo sin darles fuentes en sources.ts.
    expect(specific.length).toBe(TECHNOLOGIES.length);
  });
});
