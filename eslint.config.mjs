import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
  }),
  {
    rules: {
      // El código existente usa `any` en varios sitios (estado de listas de Firestore).
      // Se marcan como aviso (no error) para no bloquear el build; ir reduciéndolos.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Las comillas en el copy de marca (p.ej. "The LINE") son intencionales; escaparlas
      // ensuciaría el texto sin aportar. La regla no aplica a nuestro caso.
      "react/no-unescaped-entities": "off",
      // `require()` es el patrón estándar en la config de Tailwind (tailwind.config.ts).
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts", "**/*.tsbuildinfo"],
  },
];

export default eslintConfig;
