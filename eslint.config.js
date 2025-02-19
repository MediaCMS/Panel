import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["./src/**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {...globals.browser, ...globals.node}
    },
    settings: {
      react: {
        version: "detect",
      }
    },
    rules: {
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    },
    globals: {
      structuredClone: 'readonly',
      FormData: 'readonly',
      document: 'readonly',
      window: 'readonly'
    }
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];