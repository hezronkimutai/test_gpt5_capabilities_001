/* eslint-env node */
// Root ESLint config for monorepo
module.exports = {
  root: true,
  env: { node: true, es2022: true, browser: true },
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 2022, sourceType: "module" },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  ignorePatterns: [
    "**/node_modules/**",
    "**/dist/**",
    "**/coverage/**",
    "**/*.d.ts"
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": ["warn", { allowExpressions: true }],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-console": ["warn", { allow: ["warn", "error"] }]
  },
  overrides: [
    {
      files: ["**/*.tsx"],
      env: { browser: true },
      parserOptions: { ecmaFeatures: { jsx: true } },
      rules: {}
    },
    {
      files: ["**/*.test.ts", "**/*.spec.ts", "**/*.test.tsx"],
      env: { jest: true, node: true },
      rules: { "no-console": "off" }
    }
  ]
};
