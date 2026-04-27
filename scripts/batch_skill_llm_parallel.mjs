/**
 * Parallel batch for OpenAI-compatible /v1/chat/completions (Node 18+).
 * Used when PowerShell -Workers > 1 but no real python.exe is available.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const o = {};
  for (let i = 2; i < argv.length; i += 2) {
    const k = argv[i]?.replace(/^--/, "");
    const v = argv[i + 1];
    if (!k || v === undefined) break;
    o[k] = v;
  }
  return o;
}

function parseSkillBody(text) {
  const lines = text.split(/\r?\n/);
  if (lines.length < 2 || lines[0].trim() !== "---") return text;
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      end = i;
      break;
    }
  }
  if (end < 0) return text;
  return lines.slice(end + 1).join("\n").replace(/^\n+/, "");
}

function pickQuery(item, field) {
  if (typeof item === "string") return item;
  if (field && item[field] != null) return String(item[field]);
  for (const k of ["question", "query", "message", "text", "prompt", "user_query"]) {
    const v = item[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  throw new Error("No query field");
}

function pickId(item, field, lineNo) {
  if (typeof item === "string") return lineNo;
  if (field && item[field] != null) return item[field];
  for (const k of ["index", "id", "uuid", "key"]) {
    if (item[k] != null) return item[k];
  }
  return lineNo;
}

function buildMessages(body, userQuery) {
  let messages;
  if (body.includes("{query}")) {
    const system = body.replaceAll("{query}", userQuery);
    messages = [
      { role: "system", content: system },
      { role: "user", content: "Follow the system instructions; output the complete result." },
    ];
  } else {
    messages = [
      { role: "system", content: body },
      { role: "user", content: userQuery },
    ];
  }
  // Bust bad prompt-cache shards on some LiteLLM + Anthropic routes (stale 19-token completions).
  const uid = crypto.randomUUID();
  messages[0].content = `[request_id:${uid}]\n${messages[0].content}`;
  const last = messages.length - 1;
  messages[last].content = `${messages[last].content}\n\nnonce=${uid}`;
  return messages;
}

function extractAssistant(msg) {
  if (!msg) return "";
  let c = msg.content;
  if (typeof c === "string" && c.trim()) return c.trim();
  if (Array.isArray(c)) {
    const parts = [];
    for (const b of c) {
      if (!b || typeof b !== "object") continue;
      if (b.type === "text" && b.text) parts.push(String(b.text));
      else if (b.type === "output_text" && b.text) parts.push(String(b.text));
      else if (typeof b.content === "string") parts.push(b.content);
    }
    const t = parts.join("").trim();
    if (t) return t;
  }
  const rc = msg.reasoning_content;
  if (typeof rc === "string" && rc.trim()) return rc.trim();
  return "";
}

async function oneRequest(args, skillBody, item, lineNo) {
  const qid = pickId(item, args["id-field"] || "", lineNo);
  const q = pickQuery(item, args["query-field"] || "");
  const messages = buildMessages(skillBody, q);
  const lit = Number(args["litellm-timeout"] || 600) || 0;
  const payload = {
    model: args.model,
    messages,
    stream: false,
    tool_choice: "none",
    tools: [],
    ...(lit > 0 ? { timeout: lit } : {}),
  };
  const clientTimeout = (Number(args.timeout) || 600) * 1000;
  const t0 = Date.now();
  try {
    const ac = new AbortController();
    const tid = setTimeout(() => ac.abort(), clientTimeout);
    const res = await fetch(args.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json; charset=utf-8",
        Authorization: `Bearer ${args["api-key"]}`,
      },
      body: JSON.stringify(payload),
      signal: ac.signal,
    });
    clearTimeout(tid);
    const raw = await res.text();
    const elapsed = Math.round((Date.now() - t0) / 10) / 100;
    if (!res.ok) {
      return { id: qid, ok: false, error: `HTTP ${res.status}`, detail: raw.slice(0, 8000) };
    }
    const j = JSON.parse(raw);
    const choice = j.choices?.[0];
    const msg = choice?.message || {};
    const finish = choice?.finish_reason || "";
    const toolCalls = msg.tool_calls;
    let text = extractAssistant(msg);
    if (!text && (finish === "tool_calls" || (Array.isArray(toolCalls) && toolCalls.length > 0))) {
      return {
        id: qid,
        ok: false,
        error: "tool_calls",
        detail: JSON.stringify(toolCalls || finish).slice(0, 8000),
      };
    }
    if (!String(text).trim()) {
      return {
        id: qid,
        ok: false,
        error: "empty_assistant",
        detail: String(finish).slice(0, 4000),
      };
    }
    return {
      id: qid,
      ok: true,
      elapsed_sec: elapsed,
      model: j.model,
      usage: j.usage,
      assistant: text,
    };
  } catch (e) {
    return { id: qid, ok: false, error: e.name, detail: String(e).slice(0, 4000) };
  }
}

async function runPool(work, workers, fn) {
  const results = new Array(work.length);
  let cursor = 0;
  async function worker() {
    while (true) {
      const my = cursor++;
      if (my >= work.length) break;
      const { item, lineNo } = work[my];
      results[my] = await fn(item, lineNo);
    }
  }
  await Promise.all(Array.from({ length: workers }, () => worker()));
  return results;
}

/** Last JSON object per id (string key). */
function loadJsonlLastById(outPath) {
  const last = new Map();
  if (!fs.existsSync(outPath)) return last;
  for (const line of fs.readFileSync(outPath, "utf8").split(/\n/)) {
    const s = line.trim();
    if (!s) continue;
    try {
      const o = JSON.parse(s);
      if (o && typeof o === "object" && o.id != null) last.set(String(o.id), o);
    } catch {
      /* skip */
    }
  }
  return last;
}

function writeMergedJsonl(outPath, items, idField, merged, updates) {
  const rows = [];
  for (let i = 0; i < items.length; i++) {
    const lineNo = i + 1;
    const id = String(pickId(items[i], idField, lineNo));
    const row = updates.get(id) ?? merged.get(id);
    if (!row) throw new Error(`Missing row for id=${id}`);
    rows.push(row);
  }
  rows.sort((a, b) => {
    const na = Number(a.id);
    const nb = Number(b.id);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    return String(a.id).localeCompare(String(b.id));
  });
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, rows.map((r) => JSON.stringify(r)).join("\n") + "\n", "utf8");
}

const args = parseArgs(process.argv);
const resumeSuccessOnly = process.argv.includes("--resume-success-only");

args.url =
  args.url || "http://7.242.104.218:4000/v1/chat/completions";
args["api-key"] = args["api-key"] || "sk-1234567";
args.model = args.model || "gemini-3.1-pro-preview";

const skillPath = path.resolve(args.skill || "");
const queriesPath = path.resolve(args.queries || "");
const outPath = path.resolve(args.out || "");
const workers = Math.max(1, parseInt(args.workers || "1", 10) || 1);
const idField = args["id-field"] || "";

const skillBody = parseSkillBody(fs.readFileSync(skillPath, "utf8"));
let items = JSON.parse(fs.readFileSync(queriesPath, "utf8"));
if (!Array.isArray(items)) throw new Error("queries must be JSON array");
const lim = parseInt(args.limit || "0", 10) || 0;
if (lim > 0) items = items.slice(0, lim);

const merged = resumeSuccessOnly ? loadJsonlLastById(outPath) : new Map();

let work = items.map((item, i) => ({ item, lineNo: i + 1 }));
if (resumeSuccessOnly) {
  work = work.filter(({ item, lineNo }) => {
    const id = String(pickId(item, idField, lineNo));
    const prev = merged.get(id);
    return !(prev && prev.ok === true);
  });
}

if (resumeSuccessOnly && work.length === 0) {
  writeMergedJsonl(outPath, items, idField, merged, new Map());
  console.log("Nothing to run; rewrote JSONL (all ok).", outPath);
  process.exit(0);
}

const apiRows = await runPool(work, workers, (item, lineNo) =>
  oneRequest(args, skillBody, item, lineNo),
);

if (resumeSuccessOnly) {
  const updates = new Map();
  for (const r of apiRows) updates.set(String(r.id), r);
  writeMergedJsonl(outPath, items, idField, merged, updates);
  console.log("Wrote merged", outPath, `(${apiRows.length} refreshed)`);
} else {
  const rows = [...apiRows];
  rows.sort((a, b) => {
    const na = Number(a.id);
    const nb = Number(b.id);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    return String(a.id).localeCompare(String(b.id));
  });
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, rows.map((r) => JSON.stringify(r)).join("\n") + "\n", "utf8");
  console.log("Wrote", outPath);
}
