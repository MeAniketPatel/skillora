import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaryRules from "./eslint-boundary-rules.cjs";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Architecture boundary rules (ADR-004).
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["@/data/*", "@/actions/*", "@/validations/*", "@/hooks/*", "@/stores/*"],
              message:
                "Legacy import path. Use the feature barrel @/features/<feature> or the matching shared module.",
            },
            {
              group: ["@/features/*/repositories/*", "@/features/*/services/*", "@/features/*/components/*", "@/features/*/permissions/*", "@/features/*/contracts/*", "@/features/*/hooks/*"],
              message: "Cross-feature deep import is forbidden. Use @/features/<feature> barrel only.",
            },
          ],
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react/no-unescaped-entities": "off",
      "prefer-const": "warn"
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "**/*.js",
    "**/*.cjs"
  ]),
]);

export default eslintConfig;
