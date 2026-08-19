/**
 * @fileOverview Universal Language Parser usando Tree-sitter y @kreuzberg/tree-sitter-language-pack.
 *
 * ⚠️ RUNTIME RESTRICTION & ENVIRONMENT NOTE:
 * Este módulo depende del binding nativo de @kreuzberg/tree-sitter-language-pack, que
 * requiere Linux x64. La validación de ejecución real debe hacerse en Firebase Functions
 * (producción) o WSL/Docker (desarrollo), nunca en Windows nativo.
 *
 * Mapea extensiones de archivo a las 20 gramáticas universales soportadas.
 */

import type Parser from 'tree-sitter';
import type { LanguageParser, ParsedAST, ASTNode } from './language-parser.interface';

export const EXTENSION_MAP: Record<string, string> = {
  // TypeScript / JavaScript
  '.ts': 'typescript',
  '.tsx': 'tsx',
  '.mts': 'typescript',
  '.cts': 'typescript',
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',
  // C / C++
  '.cpp': 'cpp',
  '.cc': 'cpp',
  '.cxx': 'cpp',
  '.hpp': 'cpp',
  '.hh': 'cpp',
  '.c': 'c',
  '.h': 'c',
  // Python
  '.py': 'python',
  '.pyw': 'python',
  // Java / Kotlin / Scala
  '.java': 'java',
  '.kt': 'kotlin',
  '.kts': 'kotlin',
  '.scala': 'scala',
  // C#
  '.cs': 'c_sharp',
  // Go
  '.go': 'go',
  '.golang': 'go',
  // PHP
  '.php': 'php',
  // Rust
  '.rs': 'rust',
  // Ruby
  '.rb': 'ruby',
  // Swift
  '.swift': 'swift',
  // Dart
  '.dart': 'dart',
  // Shell / Bash
  '.sh': 'bash',
  '.bash': 'bash',
  // HCL / Terraform
  '.tf': 'hcl',
  '.hcl': 'hcl',
  // Elixir
  '.ex': 'elixir',
  '.exs': 'elixir',
  // Lua
  '.lua': 'lua',
  // Solidity
  '.sol': 'solidity',
};

function convertNode(tsNode: Parser.SyntaxNode, maxDepth = 30, currentDepth = 0): ASTNode {
  const children: ASTNode[] =
    currentDepth < maxDepth
      ? Array.from({ length: tsNode.childCount }, (_, i) => {
          const child = tsNode.child(i);
          return child
            ? convertNode(child, maxDepth, currentDepth + 1)
            : { type: 'null', text: '', startLine: 0, endLine: 0, children: [] };
        })
      : [];

  return {
    type: tsNode.type,
    text: tsNode.text,
    startLine: tsNode.startPosition.row + 1,
    endLine: tsNode.endPosition.row + 1,
    children,
  };
}

class UniversalParserImpl implements LanguageParser {
  readonly language = 'universal';

  private readonly ParserClass: typeof Parser = require('tree-sitter');
  private readonly grammarCache: Map<string, unknown> = new Map();
  private readonly parserCache: Map<string, Parser> = new Map();

  /** Carga la gramática dinámicamente vía @kreuzberg/tree-sitter-language-pack */
  private loadLanguageGrammar(langKey: string): unknown | null {
    if (this.grammarCache.has(langKey)) {
      return this.grammarCache.get(langKey);
    }

    try {
      // ÚNICO mecanismo de carga: resolución unificada de gramáticas
      const langPack = require('@kreuzberg/tree-sitter-language-pack');
      const grammar = typeof langPack.getLanguage === 'function'
        ? langPack.getLanguage(langKey)
        : null;

      if (grammar) {
        this.grammarCache.set(langKey, grammar);
      }
      return grammar;
    } catch (err) {
      console.error(
        `[universal-parser] Falló cargar gramática para "${langKey}":`,
        err instanceof Error ? err.message : err,
      );
      return null;
    }
  }

  private getParserForLang(langKey: string): Parser | null {
    if (this.parserCache.has(langKey)) {
      return this.parserCache.get(langKey)!;
    }

    const grammar = this.loadLanguageGrammar(langKey);
    if (!grammar) return null;

    const parser = new this.ParserClass();
    parser.setLanguage(grammar);
    this.parserCache.set(langKey, parser);
    return parser;
  }

  canParse(filename: string): boolean {
    const lower = filename.toLowerCase();
    const ext = Object.keys(EXTENSION_MAP).find((e) => lower.endsWith(e));
    if (!ext) return false;
    const langKey = EXTENSION_MAP[ext];
    return this.loadLanguageGrammar(langKey) !== null;
  }

  parse(source: string, filename: string): ParsedAST {
    const lower = filename.toLowerCase();
    const ext = Object.keys(EXTENSION_MAP).find((e) => lower.endsWith(e));
    const langKey = ext ? EXTENSION_MAP[ext] : 'typescript';

    const parser = this.getParserForLang(langKey);
    if (!parser) {
      throw new Error(`Gramática no disponible para ${langKey} (archivo: ${filename})`);
    }

    const tree: Parser.Tree = parser.parse(source);
    const rootNode: Parser.SyntaxNode = tree.rootNode;

    return {
      language: langKey,
      filename,
      root: convertNode(rootNode),
      hasParseErrors: rootNode.hasError,
    };
  }
}

export const universalParser: LanguageParser = new UniversalParserImpl();

