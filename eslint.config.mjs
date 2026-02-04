import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Utility scripts (Node.js, not part of Next.js app):
    "scripts/**",
    // Agent system scripts (run with tsx, not Next.js):
    ".agent/**",
    // Test files (have looser typing requirements):
    "__tests__/**",
    // Generated data files:
    "lib/datos_completos_aisa.ts",
    // Service Worker files (generated):
    "public/service-worker.js",
    "public/workbox-*.js",
  ]),
  // Custom rule overrides for valid patterns
  {
    rules: {
      // Allow setState in useEffect for valid patterns (initialization, data loading, sync with external state)
      "react-hooks/set-state-in-effect": "off",
      // Allow <img> for dynamic content (base64 photos, signatures)
      "@next/next/no-img-element": "warn",
    },
  },
]);

export default eslintConfig;
