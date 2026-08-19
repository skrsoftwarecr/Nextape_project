/**
 * @fileOverview IR (Intermediate Representation) Universal del GitHub Engine.
 *
 * El IR es el formato canónico que producen los parsers y consumen los analyzers.
 * Es independiente del lenguaje: un parser de Python, Go o Rust debe producir
 * el mismo IR que el parser de TypeScript.
 *
 * Diseño: la estructura es deliberadamente simple y serializable — no contiene
 * referencias circulares ni objetos de Tree-sitter; solo datos planos.
 */

// ─────────────────────────────────────────────────────────
// Elementos del IR
// ─────────────────────────────────────────────────────────

/** Una función o método detectado en el código */
export interface IRFunction {
  name: string;
  startLine: number;
  endLine: number;
  /** Número de puntos de decisión internos (if, for, while, &&, ||, ?) */
  cyclomaticComplexity: number;
  /** Número de parámetros */
  paramCount: number;
  /** true si tiene documentación (JSDoc / comentarios antes de la definición) */
  hasDoc: boolean;
  /** true si el nombre o cuerpo sugiere que es un test */
  isTest: boolean;
}

/** Una clase detectada en el código */
export interface IRClass {
  name: string;
  startLine: number;
  endLine: number;
  methodCount: number;
  hasDoc: boolean;
}

/** Un módulo importado */
export interface IRImport {
  source: string;      // Ruta o paquete importado, ej: "./foo", "react"
  isExternal: boolean; // true si no empieza con "." o "/"
  isTypeOnly: boolean; // true si es "import type"
}

/** Un export detectado en el archivo */
export interface IRExport {
  name: string;
  kind: 'function' | 'class' | 'variable' | 'type' | 'unknown';
}

// ─────────────────────────────────────────────────────────
// IR Universal por archivo
// ─────────────────────────────────────────────────────────

/** IR de un único archivo de código fuente */
export interface FileIR {
  filename: string;
  language: string;
  linesOfCode: number;
  functions: IRFunction[];
  classes: IRClass[];
  imports: IRImport[];
  exports: IRExport[];
  /** Número de funciones/métodos que son tests */
  testCount: number;
  /** true si el archivo tiene errores de parseo */
  hasParseErrors: boolean;
}

// ─────────────────────────────────────────────────────────
// IR de repositorio completo (agregado de archivos)
// ─────────────────────────────────────────────────────────

/**
 * EngineeringIR: representación universal del repositorio analizado.
 * Es el input de todos los analyzers.
 */
export interface EngineeringIR {
  /** IRs de cada archivo analizado (máx 5-8 archivos centrales) */
  files: FileIR[];
  /** Número total de funciones en todos los archivos */
  totalFunctions: number;
  /** Número total de clases */
  totalClasses: number;
  /** Número total de imports únicos externos */
  totalExternalImports: number;
  /** Número total de funciones de test */
  totalTests: number;
  /** Complejidad ciclomática promedio entre todas las funciones */
  avgCyclomaticComplexity: number;
  /** Proporción de funciones documentadas (0.0 - 1.0) */
  docCoverageRatio: number;
}
