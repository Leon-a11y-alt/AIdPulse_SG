// Reads ESLint's JSON report and turns it into three things:
//
//   1. a per-rule table in the run summary (what is failing, and how often)
//   2. inline annotations on the offending lines, so a reviewer sees the problem
//      in the PR diff instead of having to open the raw log
//   3. the job's exit code — non-zero if ESLint reported any error
//
// ESLint itself is run with `|| true` in the workflow so that this script owns
// the pass/fail decision and always gets a chance to publish the report.
//
// Usage: node .github/scripts/eslint-summary.mjs <eslint-report.json>

import fs from "node:fs";
import path from "node:path";

const reportPath = process.argv[2] || "eslint-report.json";

if (!fs.existsSync(reportPath)) {
  console.log(`::error::ESLint produced no report at ${reportPath} — the lint run itself failed.`);
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const root = process.cwd();

const byRule = new Map();
const errors = [];
let errorCount = 0;
let warningCount = 0;

for (const file of results) {
  const rel = path.relative(root, file.filePath).split(path.sep).join("/");
  for (const m of file.messages) {
    const rule = m.ruleId || "(parse error)";
    const bucket = byRule.get(rule) || { error: 0, warning: 0 };
    if (m.severity === 2) {
      bucket.error++;
      errorCount++;
      errors.push({ rel, line: m.line || 1, col: m.column || 1, rule, message: m.message });
    } else {
      bucket.warning++;
      warningCount++;
    }
    byRule.set(rule, bucket);
  }
}

// ── Annotations: the first 20 errors, on their exact lines ──────────────────
for (const e of errors.slice(0, 20)) {
  const oneLine = String(e.message).split("\n")[0].slice(0, 400);
  console.log(
    `::error file=${e.rel},line=${e.line},col=${e.col},title=${e.rule}::${oneLine}`,
  );
}

// ── Run summary: the per-rule breakdown ─────────────────────────────────────
const rows = [...byRule.entries()]
  .sort((a, b) => b[1].error - a[1].error || b[1].warning - a[1].warning)
  .map(([rule, c]) => `| \`${rule}\` | ${c.error} | ${c.warning} |`)
  .join("\n");

const filesWithProblems = results.filter((f) => f.messages.length).length;
const summary = process.env.GITHUB_STEP_SUMMARY;
if (summary) {
  fs.appendFileSync(
    summary,
    `### 2 · Lint\n\n**${errorCount} error(s), ${warningCount} warning(s)** across ` +
      `${filesWithProblems} file(s).\n\n` +
      (rows ? `| Rule | Errors | Warnings |\n| --- | --- | --- |\n${rows}\n` : "Clean.\n"),
  );
}

console.log(`ESLint: ${errorCount} error(s), ${warningCount} warning(s).`);
for (const [rule, c] of byRule) console.log(`  ${rule} — ${c.error} error, ${c.warning} warning`);

if (errorCount > 0) {
  console.log(
    `::error::ESLint reported ${errorCount} error(s). See the run summary for the per-rule breakdown.`,
  );
  process.exit(1);
}
