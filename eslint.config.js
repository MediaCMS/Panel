import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        FormData: "readonly",
        structuredClone: "readonly",
        console: "readonly",
        localStorage: "readonly",
        document: "readonly",
        window: "readonly",
        length: "readonly",
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "react/react-in-jsx-scope": "off", // If using React 17+
    },
  },
];