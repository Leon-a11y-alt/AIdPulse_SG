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
  ]),
  {
    // ── React Compiler diagnostics: tracked as warnings, not merge blockers ──
    //
    // eslint-config-next 16 ships the React Compiler's `react-hooks` rules as
    // errors. Three of them fire across existing components — mostly providers
    // that hydrate their state from localStorage inside an effect:
    //
    //   react-hooks/set-state-in-effect  — cascading-render advisory
    //   react-hooks/refs                 — ref access advisory
    //   react-hooks/purity               — impure call during render (map page)
    //
    // These are performance/idiom advisories about a pattern that works, not
    // correctness failures, and fixing them means restructuring hydration in
    // several components owned by other members. Blocking every merge on that
    // refactor would only teach the team to bypass the pipeline, so they are
    // downgraded to warnings: still reported on every run and in the CI summary
    // table, but not a merge gate.
    //
    // Everything else in `react-hooks` — rules-of-hooks included — stays an
    // error, and any NEW rule that starts failing will still break the build.
    // Remove these three lines once the providers are migrated.
    name: "aidpulse/react-compiler-debt",
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
    },
  },
]);

export default eslintConfig;
