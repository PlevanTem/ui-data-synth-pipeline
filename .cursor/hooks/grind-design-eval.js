#!/usr/bin/env node
/**
 * Web Design Pipeline v2 — stop hook grind
 * Reads JSON from stdin (Cursor stop hook payload; fields may vary by Cursor version).
 * Writes JSON to stdout: {} or { "followup_message": "..." }
 *
 * Completion signal: artifacts/wdp-v2/{case_id}/03-eval/loop-state.json with pipeline_status === "pass"
 * Optional: set WDP_CASE_ID to a valid case_id slug; otherwise picks newest loop-state.json under artifacts/wdp-v2.
 */
const fs = require("fs");
const path = require("path");

const MAX_ITERATIONS = 3;
const ARTIFACTS = ["artifacts", "wdp-v2"];

function readStdinJson() {
  return new Promise((resolve) => {
    const chunks = [];
    process.stdin.on("data", (c) => chunks.push(c));
    process.stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
  });
}

function isValidCaseId(id) {
  return typeof id === "string" && /^[a-z0-9][a-z0-9-]{0,62}$/.test(id);
}

function findLatestLoopState(repoRoot) {
  const base = path.join(repoRoot, ...ARTIFACTS);
  if (!fs.existsSync(base)) return null;
  let best = null;
  let bestMtime = 0;
  for (const name of fs.readdirSync(base, { withFileTypes: true })) {
    if (!name.isDirectory()) continue;
    const p = path.join(base, name.name, "03-eval", "loop-state.json");
    if (!fs.existsSync(p)) continue;
    const st = fs.statSync(p);
    if (st.mtimeMs >= bestMtime) {
      bestMtime = st.mtimeMs;
      best = p;
    }
  }
  return best;
}

function readLoopState(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

async function main() {
  const input = await readStdinJson();
  const loopCount =
    typeof input.loop_count === "number"
      ? input.loop_count
      : typeof input.loopCount === "number"
        ? input.loopCount
        : 0;
  const status = input.status ?? "";

  if (status !== "completed" || loopCount >= MAX_ITERATIONS) {
    process.stdout.write("{}\n");
    return;
  }

  const repoRoot = process.cwd();
  const envId = process.env.WDP_CASE_ID;
  let loopStatePath = null;
  if (isValidCaseId(envId)) {
    loopStatePath = path.join(repoRoot, ...ARTIFACTS, envId, "03-eval", "loop-state.json");
    if (!fs.existsSync(loopStatePath)) loopStatePath = null;
  }
  if (!loopStatePath) loopStatePath = findLatestLoopState(repoRoot);

  if (!loopStatePath) {
    process.stdout.write("{}\n");
    return;
  }

  const state = readLoopState(loopStatePath);
  if (!state || state.pipeline_status === "pass") {
    process.stdout.write("{}\n");
    return;
  }

  const caseRoot = path.dirname(path.dirname(loopStatePath));
  const relCase = path.relative(repoRoot, caseRoot).split(path.sep).join("/");
  const nextIter = loopCount + 1;
  const msg = [
    `[Web design pipeline grind ${nextIter}/${MAX_ITERATIONS}]`,
    `Active case (relative): ${relCase}`,
    `loop-state: pipeline_status="${state.pipeline_status ?? "unknown"}" round=${state.round ?? "?"}.`,
    "Follow skill: .agents/skills/web-design-pipeline-v2/SKILL.md",
    "1) Evaluator (.cursor/agents/wdp-v2-evaluator.md): Playwright against 02-build/, write 03-eval/eval-round-{nn}.json, update 03-eval/loop-state.json.",
    "2) Designer (.cursor/agents/wdp-v2-designer.md): consume latest eval; refine or pivot (max 3 rounds total per case).",
    "Set WDP_CASE_ID if multiple cases exist.",
  ].join(" ");

  process.stdout.write(JSON.stringify({ followup_message: msg }) + "\n");
}

main().catch(() => process.stdout.write("{}\n"));
