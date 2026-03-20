import React, { useEffect, useMemo, useRef, useState } from "react";

import { FlowFieldCanvas } from "./generative/FlowFieldCanvas";
import { useReducedMotion } from "./hooks/useReducedMotion";

import { defaultFilter, initialWorkflow, points, trendByFilter } from "./data/mock";
import type { FilterState, ResourcePoint, WorkflowNode } from "./types";

import "./App.css";

type Toast = { id: string; kind: "success" | "error" | "info"; title: string; message?: string };
type WorkflowEditorNode = WorkflowNode & { x: number; y: number };
type WorkflowEdge = { from: string; to: string };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function uid() {
  return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
}

function hasCycle(nodes: WorkflowEditorNode[], edges: WorkflowEdge[]) {
  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n.id, []);
  for (const e of edges) adj.set(e.from, [...(adj.get(e.from) ?? []), e.to]);

  const visited = new Set<string>();
  const inStack = new Set<string>();

  const dfs = (u: string): boolean => {
    if (inStack.has(u)) return true;
    if (visited.has(u)) return false;
    visited.add(u);
    inStack.add(u);
    for (const v of adj.get(u) ?? []) {
      if (dfs(v)) return true;
    }
    inStack.delete(u);
    return false;
  };

  for (const n of nodes) if (dfs(n.id)) return true;
  return false;
}

function buildPathD(series: number[], w: number, h: number, pad: number) {
  if (series.length < 2) return "";
  const min = Math.min(...series);
  const max = Math.max(...series);
  const denom = Math.max(1e-6, max - min);
  return series
    .map((v, i) => {
      const x = pad + (i / (series.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (v - min) / denom) * (h - pad * 2);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function LineChart({
  title,
  series,
  accent,
  onHover,
}: {
  title: string;
  series: number[];
  accent: string;
  onHover?: (v: number | null) => void;
}) {
  const w = 520;
  const h = 160;
  const pad = 18;
  const d = useMemo(() => buildPathD(series, w, h, pad), [series]);
  const min = Math.min(...series);
  const max = Math.max(...series);
  const denom = Math.max(1e-6, max - min);

  return (
    <div className="panel chartPanel">
      <div className="panelHeader">
        <div className="panelTitle">{title}</div>
        <div className="panelMeta muted">
          <span className="muted">min</span> {min.toFixed(0)} <span className="muted">max</span> {max.toFixed(0)}
        </div>
      </div>

      <svg
        className="chartSvg"
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label={title}
        onMouseLeave={() => onHover?.(null)}
      >
        <defs>
          <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accent} stopOpacity="0.12" />
            <stop offset="50%" stopColor={accent} stopOpacity="0.6" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.12" />
          </linearGradient>
        </defs>

        <path d={d} stroke="url(#lineGlow)" strokeWidth={8} fill="none" opacity={0.5} />
        <path className="chartLine" d={d} stroke={accent} strokeWidth={2.2} fill="none" />

        {series.map((v, i) => {
          const x = pad + (i / (series.length - 1)) * (w - pad * 2);
          const y = pad + (1 - (v - min) / denom) * (h - pad * 2);
          return (
            <g key={i} onMouseEnter={() => onHover?.(v)}>
              <circle cx={x} cy={y} r={4.1} fill={accent} opacity={0.18} className="chartPoint" />
              <circle cx={x} cy={y} r={2.2} fill={accent} opacity={0.95} className="chartPointCore" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function BarsChart({
  title,
  values,
  labels,
  accent,
}: {
  title: string;
  values: number[];
  labels: string[];
  accent: string;
}) {
  const w = 520;
  const h = 160;
  const pad = 18;
  const maxV = Math.max(1, ...values);
  return (
    <div className="panel chartPanel">
      <div className="panelHeader">
        <div className="panelTitle">{title}</div>
        <div className="panelMeta muted">{labels.join(" / ")}</div>
      </div>
      <svg className="chartSvg" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={title}>
        {values.map((v, i) => {
          const x = pad + i * ((w - pad * 2) / values.length) + 8;
          const barW = (w - pad * 2) / values.length - 16;
          const barH = ((h - pad * 2 - 10) * v) / maxV;
          const y = h - pad - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} rx={10} fill={accent} opacity={0.22} />
              <rect x={x} y={y} width={barW} height={barH} rx={10} fill={accent} opacity={0.6} className="barFill" />
              <text x={x + barW / 2} y={h - 6} textAnchor="middle" fill="rgba(225,238,255,0.8)" fontSize="10">
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ToastCenter({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
  return (
    <div className="toastCenter" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.kind}`}>
          <div className="toastTop">
            <div className="toastTitle">{t.title}</div>
            <button className="iconBtn" onClick={() => onClose(t.id)} aria-label="close toast">
              ×
            </button>
          </div>
          {t.message ? <div className="toastMsg">{t.message}</div> : null}
        </div>
      ))}
    </div>
  );
}

function ResourceHeatMap({
  points,
  filter,
  reducedMotion,
  selectedId,
  onSelect,
  dispatchBoost,
}: {
  points: ResourcePoint[];
  filter: FilterState;
  reducedMotion: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  dispatchBoost: number;
}) {
  const [simPoints, setSimPoints] = useState<ResourcePoint[]>(points);
  const [history, setHistory] = useState<Record<string, { x: number; y: number }[]>>({});
  const tick = useRef(0);

  useEffect(() => {
    setSimPoints(points);
    const init: Record<string, { x: number; y: number }[]> = {};
    for (const p of points) init[p.id] = [{ x: p.x, y: p.y }];
    setHistory(init);
    tick.current = 0;
  }, [points]);

  useEffect(() => {
    if (reducedMotion) return;
    const t = window.setInterval(() => {
      tick.current += 1;
      const speed = filter.timeRange === "24h" ? 0.7 : filter.timeRange === "7d" ? 0.45 : 0.25;
      setSimPoints((prev) =>
        prev.map((p, i) => {
          const drift = (0.7 + i * 0.06) * speed;
          const dx = (Math.sin((tick.current + i) * 0.55) * 0.6 + (Math.random() - 0.5) * 0.35) * drift;
          const dy = (Math.cos((tick.current + i) * 0.47) * 0.6 + (Math.random() - 0.5) * 0.35) * drift;
          return { ...p, x: clamp(p.x + dx, 6, 94), y: clamp(p.y + dy, 6, 94) };
        })
      );
    }, 520);
    return () => window.clearInterval(t);
  }, [filter.timeRange, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    setHistory((prev) => {
      const next = { ...prev };
      for (const p of simPoints) {
        const arr = next[p.id] ? [...next[p.id]] : [];
        arr.push({ x: p.x, y: p.y });
        while (arr.length > 18) arr.shift();
        next[p.id] = arr;
      }
      return next;
    });
  }, [simPoints, reducedMotion]);

  const selectedPoint = useMemo(() => (selectedId ? simPoints.find((p) => p.id === selectedId) ?? null : null), [
    selectedId,
    simPoints,
  ]);

  const heat = (p: ResourcePoint) => {
    const base = clamp(p.load / 100, 0, 1);
    const boost = selectedId === p.id ? dispatchBoost : dispatchBoost * 0.25;
    return clamp(base + boost, 0, 1);
  };

  return (
    <div className="panel mapPanel">
      <div className="panelHeader">
        <div className="panelTitle">Geo Heat Map</div>
        <div className="panelMeta muted">
          {filter.region} · {filter.resourceType}
        </div>
      </div>

      <svg className="mapSvg" viewBox="0 0 100 100" role="img" aria-label="Geo heat map">
        <defs>
          <radialGradient id="heatGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#1EE3CF" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#1EE3CF" stopOpacity="0" />
          </radialGradient>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(159,179,217,0.14)" strokeWidth="0.2" />
          </pattern>
        </defs>

        <rect x={0} y={0} width={100} height={100} fill="url(#grid)" />

        {selectedId && history[selectedId]?.length ? (
          <polyline
            points={history[selectedId].map((pt) => `${pt.x},${pt.y}`).join(" ")}
            fill="none"
            stroke="#22D3EE"
            strokeWidth={1.2}
            strokeDasharray="2 3"
            className="pathDash"
            strokeLinecap="round"
          />
        ) : null}

        {simPoints.map((p) => {
          const t = heat(p);
          const isSel = selectedId === p.id;
          const r = 3 + t * 7 + (isSel ? dispatchBoost * 10 : 0);
          return (
            <g
              key={p.id}
              className={`marker ${isSel ? "selected" : ""}`}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(p.id)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? onSelect(p.id) : null)}
              aria-label={`select ${p.name}`}
            >
              <circle cx={p.x} cy={p.y} r={r} fill="url(#heatGlow)" opacity={0.35 + t * 0.35} />
              <circle cx={p.x} cy={p.y} r={2.2} fill="#22D3EE" opacity={0.95} />
              {isSel ? <circle cx={p.x} cy={p.y} r={r + 3} fill="none" stroke="#1EE3CF" strokeWidth={0.8} className="ringPulse" /> : null}
            </g>
          );
        })}
      </svg>

      {selectedPoint ? (
        <div className="mapDetail">
          <div className="mapDetailTitle">
            Selected: <span className="emph">{selectedPoint.name}</span>
          </div>
          <div className="mapDetailMeta muted">
            {selectedPoint.type} · {selectedPoint.region} · load {Math.round(selectedPoint.load)} / 100
          </div>
        </div>
      ) : (
        <div className="mapDetail muted">Click a point to sync charts & workflow.</div>
      )}
    </div>
  );
}

function SparkStats({ selectedPoint }: { selectedPoint: ResourcePoint | null }) {
  const load = selectedPoint?.load ?? 0;
  const risk = clamp((100 - load) / 100, 0, 1);
  const score = selectedPoint ? clamp(load / 100 + (1 - risk) * 0.25, 0, 1) : 0.2;
  return (
    <div className="panel statsPanel">
      <div className="panelHeader">
        <div className="panelTitle">Tactical Brief</div>
        <div className="panelMeta muted">{selectedPoint ? selectedPoint.type : "—"}</div>
      </div>
      <div className="statsGrid">
        <div className="statCard">
          <div className="statLabel">Load Index</div>
          <div className="statValue">{Math.round(load)}%</div>
          <div className="statBar">
            <div className="statBarFill" style={{ width: `${load}%` }} />
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Risk (lower)</div>
          <div className="statValue">{Math.round(risk * 100)}%</div>
          <div className="statBar">
            <div className="statBarFill risk" style={{ width: `${Math.round(risk * 100)}%` }} />
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Command Score</div>
          <div className="statValue">{Math.round(score * 100)}%</div>
          <div className="statBar">
            <div className="statBarFill score" style={{ width: `${Math.round(score * 100)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowEditor({
  reducedMotion,
  nodes,
  edges,
  setNodes,
  setEdges,
  onToast,
  onPublishBoost,
}: {
  reducedMotion: boolean;
  nodes: WorkflowEditorNode[];
  edges: WorkflowEdge[];
  setNodes: (n: WorkflowEditorNode[]) => void;
  setEdges: (e: WorkflowEdge[]) => void;
  onToast: (t: Omit<Toast, "id">) => void;
  onPublishBoost: (boost: number) => void;
}) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id ?? null);
  const [connectMode, setConnectMode] = useState<{ from: string | null }>({ from: null });

  useEffect(() => {
    if (selectedNodeId && nodes.some((n) => n.id === selectedNodeId)) return;
    setSelectedNodeId(nodes[0]?.id ?? null);
    setConnectMode({ from: null });
  }, [nodes, selectedNodeId]);

  const selected = nodes.find((n) => n.id === selectedNodeId) ?? null;

  const reset = () => {
    const seeded: WorkflowEditorNode[] = initialWorkflow.map((n, i) => ({
      ...n,
      x: 48 + (i % 3) * 190,
      y: 32 + i * 80,
    }));
    setNodes(seeded);
    setEdges([]);
    setSelectedNodeId(seeded[0]?.id ?? null);
    setConnectMode({ from: null });
    onToast({ kind: "info", title: "Workflow rolled back", message: "Back to default orchestration." });
  };

  const beginConnect = (nodeId: string) => {
    setConnectMode({ from: nodeId });
    onToast({ kind: "info", title: "Connect mode enabled", message: "Click another node to create dependency." });
  };

  const tryConnect = (from: string, to: string) => {
    if (from === to) return onToast({ kind: "error", title: "Invalid connection", message: "Self-edge is not allowed." });
    if (edges.some((e) => e.from === from && e.to === to))
      return onToast({ kind: "info", title: "Connection exists", message: "Dependency already present." });
    setEdges([...edges, { from, to }]);
    setConnectMode({ from: null });
    onToast({ kind: "success", title: "Dependency added", message: "Flow linkage updated." });
  };

  const cycle = useMemo(() => hasCycle(nodes, edges), [nodes, edges]);

  const onDropOnCanvas = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const canvas = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - canvas.left) / canvas.width) * 760;
    const y = ((e.clientY - canvas.top) / canvas.height) * 360;

    const raw = e.dataTransfer.getData("text/workflow");
    const templateType = e.dataTransfer.getData("text/workflow_template") as WorkflowNode["type"];

    if (raw.startsWith("node:")) {
      const nodeId = raw.slice("node:".length);
      setNodes(nodes.map((n) => (n.id === nodeId ? { ...n, x: clamp(x - 40, 0, 760), y: clamp(y - 22, 0, 360) } : n)));
      return;
    }

    if (templateType) {
      const newNode: WorkflowEditorNode = {
        id: uid(),
        label: templateType === "custom" ? "Custom Step" : `${templateType[0].toUpperCase()}${templateType.slice(1)} Step`,
        type: templateType,
        x: clamp(x - 40, 0, 760),
        y: clamp(y - 22, 0, 360),
      };
      setNodes([...nodes, newNode]);
      setSelectedNodeId(newNode.id);
      onToast({ kind: "success", title: "Node added", message: "A new orchestration node is ready." });
    }
  };

  return (
    <div className="panel workflowPanel">
      <div className="panelHeader">
        <div className="panelTitle">Workflow Editor</div>
        <div className="panelMeta muted">{cycle ? "cycle detected" : `edges: ${edges.length}`}</div>
      </div>

      <div className="workflowGrid">
        <div className="workflowLeft">
          <div className="subTitle">Templates</div>
          <div className="templateRow">
            {(["ingest", "balance", "dispatch", "custom"] as WorkflowNode["type"][]).map((t) => (
              <div
                key={t}
                className="templateCard"
                draggable
                onDragStart={(ev) => {
                  ev.dataTransfer.setData("text/workflow_template", t);
                  ev.dataTransfer.effectAllowed = "copy";
                }}
                role="button"
                tabIndex={0}
              >
                <div className="templateName">{t.toUpperCase()}</div>
                <div className="templateHint">{t === "custom" ? "User-defined step" : "Typed step"}</div>
              </div>
            ))}
          </div>

          <div className="subTitle">Actions</div>
          <div className="actionRow">
            <button className="btn secondary" onClick={reset} disabled={nodes.length < 1}>
              Rollback
            </button>
            <button
              className="btn primary"
              onClick={() => {
                if (nodes.length < 2) return onToast({ kind: "error", title: "Publish failed", message: "Need at least 2 nodes." });
                if (edges.length < 1) return onToast({ kind: "error", title: "Publish failed", message: "Add at least 1 dependency." });
                if (cycle) return onToast({ kind: "error", title: "Publish failed", message: "Workflow has a cycle; break dependencies." });
                onPublishBoost(0.35);
                onToast({ kind: "success", title: "Published", message: "Dispatch simulation running (mock)." });
              }}
              disabled={nodes.length < 2 || edges.length < 1 || cycle}
            >
              Publish
            </button>
          </div>

          <div className="subTitle">Selected Node</div>
          {selected ? (
            <div className="nodeConfig">
              <div className="nodeTypePill">{selected.type}</div>
              <label className="field">
                <span className="fieldLabel">Label</span>
                <input
                  className="input"
                  value={selected.label}
                  onChange={(e) => setNodes(nodes.map((n) => (n.id === selected.id ? { ...n, label: e.target.value } : n)))}
                />
              </label>
              <div className="configMeta muted">Click nodes: {connectMode.from ? "choose target" : "enable connect mode"}.</div>
              <button
                className="btn danger"
                onClick={() => {
                  setNodes(nodes.filter((n) => n.id !== selected.id));
                  setEdges(edges.filter((e) => e.from !== selected.id && e.to !== selected.id));
                  setSelectedNodeId(null);
                  setConnectMode({ from: null });
                  onToast({ kind: "info", title: "Node deleted", message: "Removed and pruned edges." });
                }}
              >
                Delete Node
              </button>
            </div>
          ) : (
            <div className="emptyState">No node selected.</div>
          )}
        </div>

        <div className="workflowCanvas" onDragOver={(e) => e.preventDefault()} onDrop={onDropOnCanvas}>
          <svg className="edgeLayer" viewBox="0 0 760 360" preserveAspectRatio="none" aria-hidden="true">
            {edges.map((e, idx) => {
              const from = nodes.find((n) => n.id === e.from);
              const to = nodes.find((n) => n.id === e.to);
              if (!from || !to) return null;
              const x1 = from.x + 40;
              const y1 = from.y + 22;
              const x2 = to.x + 40;
              const y2 = to.y + 22;
              const mx = (x1 + x2) / 2;
              const my = (y1 + y2) / 2 - 18;
              const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
              return (
                <g key={`${e.from}-${e.to}-${idx}`}>
                  <path d={d} stroke="rgba(34,211,238,0.35)" strokeWidth={4} fill="none" />
                  <path d={d} stroke="#1EE3CF" strokeWidth={1.4} fill="none" strokeDasharray="4 3" className="edgeFlow" />
                </g>
              );
            })}
          </svg>

          {nodes.map((n) => {
            const isSel = n.id === selectedNodeId;
            return (
              <div
                key={n.id}
                className={`wfNode ${isSel ? "selected" : ""}`}
                style={{ left: n.x, top: n.y }}
                draggable
                onClick={() => {
                  setSelectedNodeId(n.id);
                  if (connectMode.from) tryConnect(connectMode.from, n.id);
                  else beginConnect(n.id);
                }}
                onDragStart={(ev) => {
                  ev.dataTransfer.setData("text/workflow", `node:${n.id}`);
                  ev.dataTransfer.effectAllowed = "move";
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  setSelectedNodeId(n.id);
                  if (connectMode.from) tryConnect(connectMode.from, n.id);
                  else beginConnect(n.id);
                }}
                aria-label={`workflow node ${n.label}`}
              >
                <div className="wfNodeTop">
                  <div className="wfNodeType">{n.type}</div>
                  <div className="wfNodeId muted">{n.id.slice(0, 4)}</div>
                </div>
                <div className="wfNodeLabel">{n.label}</div>
                <div className="wfNodeHint muted">{connectMode.from ? "click target" : "click to connect"}</div>
                {reducedMotion ? null : <div className="wfNodeGlow" />}
              </div>
            );
          })}

          <div className="canvasHelper muted">
            Drag nodes to rearrange. Click a node: {connectMode.from ? "choose target" : "enable connect mode"}.
          </div>
        </div>
      </div>
    </div>
  );
}

function CtaLeadSection({ onToast }: { onToast: (t: Omit<Toast, "id">) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const emailOk = useMemo(() => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.trim()), [email]);
  const formOk = name.trim().length >= 2 && company.trim().length >= 2 && emailOk && role.trim().length >= 2;

  const submit = async () => {
    setError(null);
    if (!formOk) {
      setStatus("error");
      setError("请补全必填字段并确保邮箱格式正确。");
      onToast({ kind: "error", title: "提交失败", message: "表单校验未通过。" });
      return;
    }
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 900));
    if (email.toLowerCase().includes("fail")) {
      setStatus("error");
      setError("服务器模拟失败：请更换邮箱后重试。");
      onToast({ kind: "error", title: "提交失败", message: "模拟错误触发。" });
      return;
    }
    setStatus("success");
    onToast({ kind: "success", title: "已提交", message: "我们会在 24 小时内联系你（模拟）。" });
  };

  return (
    <section id="cta" className="section">
      <div className="sectionHeader">
        <div className="sectionEyebrow">Conversion</div>
        <h2 className="sectionTitle">让调度决策更快、更稳</h2>
        <p className="sectionSub muted">从“发现不均衡”到“发布可执行流程”，在同一套高科技交互里闭环。</p>
      </div>

      <div className="twoCol">
        <div className="panel heroPanel">
          <div className="heroKpiRow">
            <div className="heroKpi">
              <div className="heroKpiValue">-28%</div>
              <div className="heroKpiLabel">资源等待</div>
            </div>
            <div className="heroKpi">
              <div className="heroKpiValue">+19%</div>
              <div className="heroKpiLabel">调度效率</div>
            </div>
            <div className="heroKpi">
              <div className="heroKpiValue">1-1</div>
              <div className="heroKpiLabel">模块联动</div>
            </div>
          </div>

          <div className="proofRow">
            <div className="proofCard">
              <div className="proofTitle">可解释可视化</div>
              <div className="proofBody muted">SVG 图表与热力空间深度一致，同步刷新可读数值。</div>
            </div>
            <div className="proofCard">
              <div className="proofTitle">工作流发布反馈</div>
              <div className="proofBody muted">节点依赖校验 + 发布 toast，避免“点击没反应”。</div>
            </div>
          </div>

          <div className="ctaInline">
            <button className="btn primary" onClick={() => document.getElementById("leadForm")?.scrollIntoView({ behavior: "smooth", block: "center" })}>
              立即获取演示
            </button>
            <div className="ctaInlineText muted">适配移动端与桌面端。尊重 reduced-motion。</div>
          </div>
        </div>

        <div className="panel formPanel" id="leadForm">
          <div className="panelHeader">
            <div className="panelTitle">Request a Demo</div>
            <div className="panelMeta muted">
              {status === "loading" ? "Submitting..." : status === "success" ? "Success" : "Ready"}
            </div>
          </div>

          <label className="field">
            <span className="fieldLabel">姓名</span>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="例如：张伟" disabled={status === "loading"} />
          </label>

          <label className="field">
            <span className="fieldLabel">工作邮箱</span>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" disabled={status === "loading"} />
            {email.length > 3 ? <div className={`hint ${emailOk ? "ok" : "bad"}`}>{emailOk ? "邮箱格式正确" : "邮箱格式不正确"}</div> : null}
          </label>

          <label className="field">
            <span className="fieldLabel">公司</span>
            <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="农业科技公司" disabled={status === "loading"} />
          </label>

          <label className="field">
            <span className="fieldLabel">职位</span>
            <input className="input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="运营 / 调度 / 负责人" disabled={status === "loading"} />
          </label>

          <div className="formMeta muted">提交即表示你同意我们仅用于演示沟通（模拟）。</div>
          {error ? <div className="formError">{error}</div> : null}

          <button className="btn primary formBtn" onClick={submit} disabled={status === "loading"} aria-disabled={status === "loading"}>
            {status === "loading" ? "提交中..." : status === "success" ? "提交成功" : "提交请求"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const reducedMotion = useReducedMotion();

  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [toastList, setToastList] = useState<Toast[]>([]);
  const [dispatchBoost, setDispatchBoost] = useState(0);

  const [workflowNodes, setWorkflowNodes] = useState<WorkflowEditorNode[]>(
    initialWorkflow.map((n, i) => ({
      ...n,
      x: 56 + (i % 3) * 200,
      y: 40 + i * 86,
    }))
  );
  const [workflowEdges, setWorkflowEdges] = useState<WorkflowEdge[]>([]);

  const pushToast = (t: Omit<Toast, "id">) => {
    const newToast: Toast = { ...t, id: uid() };
    setToastList((prev) => [newToast, ...prev].slice(0, 4));
    window.setTimeout(() => setToastList((prev) => prev.filter((x) => x.id !== newToast.id)), 3800);
  };

  const filteredPoints = useMemo(() => {
    const timeK = filter.timeRange === "24h" ? 1.12 : filter.timeRange === "7d" ? 1.0 : 0.88;
    return points
      .filter((p) => p.region === filter.region && p.type === filter.resourceType)
      .map((p) => ({
        ...p,
        load: clamp(Math.round(p.load * timeK + (filter.region.length - 4) * 1.7), 10, 99),
      }));
  }, [filter.region, filter.resourceType, filter.timeRange]);

  useEffect(() => {
    if (!selectedAssetId) return;
    if (filteredPoints.some((p) => p.id === selectedAssetId)) return;
    setSelectedAssetId(filteredPoints[0]?.id ?? null);
  }, [filteredPoints, selectedAssetId]);

  useEffect(() => {
    if (selectedAssetId) return;
    setSelectedAssetId(filteredPoints[0]?.id ?? null);
  }, [filteredPoints, selectedAssetId]);

  const selectedPoint = useMemo(
    () => (selectedAssetId ? filteredPoints.find((p) => p.id === selectedAssetId) ?? null : null),
    [filteredPoints, selectedAssetId]
  );

  const series = useMemo(() => trendByFilter(filter), [filter]);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const dist = useMemo(() => {
    const bins = [0, 0, 0, 0];
    const mid = 50;
    for (const p of filteredPoints) {
      const ix = p.x < mid ? 0 : 1;
      const iy = p.y < mid ? 0 : 1;
      bins[iy * 2 + ix] += p.load;
    }
    const total = bins.reduce((a, b) => a + b, 0) || 1;
    return bins.map((v) => (v / total) * 100);
  }, [filteredPoints]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  useEffect(() => {
    if (dispatchBoost <= 0) return;
    const t = window.setTimeout(() => setDispatchBoost(0), 1600);
    return () => window.clearTimeout(t);
  }, [dispatchBoost]);

  return (
    <div className="appRoot">
      <header className="topNav">
        <div className="brand">
          <div className="brandMark" />
          <div className="brandText">
            <div className="brandName">AgriFlow Command</div>
            <div className="brandTag muted">High-tech Resource Orchestration</div>
          </div>
        </div>

        <nav className="navLinks" aria-label="primary navigation">
          {[
            ["overview", "Overview"],
            ["command", "Command"],
            ["workflow", "Workflow"],
            ["geo", "Geo"],
            ["cta", "CTA"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(id);
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main className="main">
        <section id="overview" className="section heroSection">
          <FlowFieldCanvas speedBoost={dispatchBoost} reducedMotion={reducedMotion} />
          <div className="heroContent">
            <div className="heroEyebrow">Resources, mapped. Decisions, executed.</div>
            <h1 className="heroTitle">
              解决“资源调度不均”，让多地块协同 <span className="accent">实时均衡</span>
            </h1>
            <p className="heroSub muted">
              动态 SVG 图表 + 热力空间联动工作流编辑器：筛选→分析→编辑→发布→反馈，一气完成闭环。
            </p>
            <div className="heroCtas">
              <button className="btn primary" onClick={() => scrollTo("command")}>
                进入指挥总览
              </button>
              <button className="btn secondary" onClick={() => scrollTo("cta")}>
                获取高科技演示
              </button>
            </div>
            {hoverValue != null ? <div className="hoverBadge">hover value: {Math.round(hoverValue)}</div> : null}
          </div>
        </section>

        <section id="command" className="section">
          <div className="sectionHeader">
            <div className="sectionEyebrow">KPI Overview</div>
            <h2 className="sectionTitle">调度态势：图表与参数联动</h2>
            <p className="sectionSub muted">切换时间范围/区域/资源类型，图表与地图同步刷新并有动效过渡。</p>
          </div>

          <div className="filterRow">
            <div className="filterGroup">
              <div className="filterLabel">Time Range</div>
              {(["24h", "7d", "30d"] as FilterState["timeRange"][]).map((t) => (
                <button key={t} className={`chip ${filter.timeRange === t ? "active" : ""}`} onClick={() => setFilter((f) => ({ ...f, timeRange: t }))}>
                  {t}
                </button>
              ))}
            </div>

            <div className="filterGroup">
              <div className="filterLabel">Region</div>
              {(["north", "east", "south", "west"] as FilterState["region"][]).map((r) => (
                <button key={r} className={`chip ${filter.region === r ? "active" : ""}`} onClick={() => setFilter((f) => ({ ...f, region: r }))}>
                  {r}
                </button>
              ))}
            </div>

            <div className="filterGroup">
              <div className="filterLabel">Resource</div>
              {(["drone", "tractor", "crew"] as FilterState["resourceType"][]).map((t) => (
                <button key={t} className={`chip ${filter.resourceType === t ? "active" : ""}`} onClick={() => setFilter((f) => ({ ...f, resourceType: t }))}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {filteredPoints.length ? (
            <>
              <div className="chartsGrid">
                <LineChart title="Load Trend (SVG)" series={series} accent="#22D3EE" onHover={setHoverValue} />
                <BarsChart title="Resource Distribution (SVG)" values={dist} labels={["Q1", "Q2", "Q3", "Q4"]} accent="#1EE3CF" />
              </div>

              <div className="layout2col">
                <ResourceHeatMap points={filteredPoints} filter={filter} reducedMotion={reducedMotion} selectedId={selectedAssetId} onSelect={setSelectedAssetId} dispatchBoost={dispatchBoost} />
                <SparkStats selectedPoint={selectedPoint} />
              </div>
            </>
          ) : (
            <div className="emptyState">No points match current filter. Try changing region/type.</div>
          )}
        </section>

        <section id="workflow" className="section">
          <div className="sectionHeader">
            <div className="sectionEyebrow">Workflow Editor</div>
            <h2 className="sectionTitle">拖拽编排调度逻辑（含自定义节点）</h2>
            <p className="sectionSub muted">支持节点拖拽、连线依赖与发布反馈（简化版）。</p>
          </div>

          <WorkflowEditor
            reducedMotion={reducedMotion}
            nodes={workflowNodes}
            edges={workflowEdges}
            setNodes={setWorkflowNodes}
            setEdges={setWorkflowEdges}
            onToast={pushToast}
            onPublishBoost={(b) => setDispatchBoost(b)}
          />
        </section>

        <section id="geo" className="section">
          <div className="sectionHeader">
            <div className="sectionEyebrow">Geo Tracking</div>
            <h2 className="sectionTitle">实时位置追踪与热力洞察</h2>
            <p className="sectionSub muted">地图与图表共享筛选状态；热点脉冲与轨迹随数据刷新。</p>
          </div>

          <div className="layoutSingle">
            <ResourceHeatMap points={filteredPoints} filter={filter} reducedMotion={reducedMotion} selectedId={selectedAssetId} onSelect={setSelectedAssetId} dispatchBoost={dispatchBoost} />
          </div>
        </section>

        <CtaLeadSection onToast={pushToast} />

        <footer className="footer muted">Interactive orchestration UI (mock). Reduced-motion honored.</footer>
      </main>

      <ToastCenter toasts={toastList} onClose={(id) => setToastList((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
