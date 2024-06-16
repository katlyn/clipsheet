// @ts-check

import eslint from "@eslint/js";
// No clue why the below fails
// eslint-disable-next-line import/no-unresolved
import tseslint from "typescript-eslint";
import { FlatCompat } from "@eslint/eslintrc";

import path from "path";
import { fileURLToPath } from "url";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.extends("plugin:import/recommended"),
  ...compat.extends("plugin:import/typescript"),
  {
    rules: {
      "import/extensions": ["error", "always"],
    },
  },
  {
    ignores: ["dist/*"],
  },
);
