// Turns a captured job log into something readable without opening the raw log:
// GitHub annotations (shown on the commit, in the PR "Checks" tab, and in the
// API) plus a collapsible block in the run summary.
//
// Why this exists: when a stage fails, the useful output is buried in a log file
// only people with repository access can open. Emitting it as an annotation puts
// the failing assertion or lint rule right next to the red X.
//
// GitHub truncates a single annotation at 4 KB, so the tail is emitted in
// ordered chunks rather than one oversized message.
//
// Usage:
//   node .github/scripts/annotate-log.mjs <logfile> "<title>" <error|notice> [lines]

import fs from "node:fs";

const [file, title = "Job output", level = "error", count = "200"] = process.argv.slice(2);

const CHUNK = 3500; // stay under GitHub's 4 KB per-annotation limit
const MAX_CHUNKS = 6;

if (!file || !fs.existsSync(file)) {
  console.log("::warning::annotate-log — no log file at " + String(file));
  process.exit(0);
}

const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
const tail = lines.slice(-Number(count)).join("\n").trim();

if (!tail) {
  console.log("::warning::annotate-log — " + file + " was empty.");
  process.exit(0);
}

// Workflow-command escaping: newlines and % must be encoded or the annotation
// stops at the first line break.
const escape = (s) => s.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");

const chunks = [];
for (let i = 0; i < tail.length; i += CHUNK) chunks.push(tail.slice(i, i + CHUNK));

// Keep the END of the output: that is where the failure summary lives.
const kept = chunks.slice(-MAX_CHUNKS);
kept.forEach((chunk, i) => {
  const label = kept.length > 1 ? `${title} (${i + 1}/${kept.length})` : title;
  console.log("::" + level + " title=" + label + "::" + escape(chunk));
});

const summaryFile = process.env.GITHUB_STEP_SUMMARY;
if (summaryFile) {
  const escaped = tail.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  fs.appendFileSync(
    summaryFile,
    `<details open><summary>${title}</summary>\n\n<pre>${escaped}</pre>\n\n</details>\n\n`,
  );
}
