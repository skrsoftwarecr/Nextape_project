import { describe, it, expect } from "vitest";
import { EXTENSION_MAP, universalParser } from "./universal-parser";

// La gramática se carga del language pack nativo; sin él (p. ej. un entorno sin binarios) se salta.
const grammarAvailable = (() => {
  try {
    return universalParser.canParse("probe.ts");
  } catch {
    return false;
  }
})();

describe.skipIf(!grammarAvailable)("universalParser con archivos grandes", () => {
  it("parsea archivos de más de 32 KiB (antes tree-sitter lanzaba 'Invalid argument')", () => {
    const fn = (i: number) =>
      `export function handler${i}(input: number): number {\n  const doubled = input * 2;\n  return doubled + ${i};\n}\n`;
    const source = Array.from({ length: 900 }, (_, i) => fn(i)).join("\n");
    expect(source.length).toBeGreaterThan(64 * 1024);

    const ast = universalParser.parse(source, "big-module.ts");

    expect(ast.language).toBe(EXTENSION_MAP[".ts"]);
    expect(ast.hasParseErrors).toBe(false);
  });
});
