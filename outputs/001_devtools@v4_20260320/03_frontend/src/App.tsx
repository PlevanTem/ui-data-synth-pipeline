import { useMemo, useState } from "react";
import { FlowFieldCanvas } from "./generative/FlowFieldCanvas";
import type { PerfRecord, Severity, ViewMode } from "./types";

const mockData: PerfRecord[] = [
  { id: "N-101", service: "api-gateway", latency: 298, throughput: 4200, errorRate: 1.8, severity: "high" },
  { id: "N-102", service: "session-core", latency: 175, throughput: 3900, errorRate: 0.6, severity: "medium" },
  { id: "N-103", service: "voice-parser", latency: 342, throughput: 980, errorRate: 2.4, severity: "high" },
  { id: "N-104", service: "svg-analytics", latency: 121, throughput: 5200, errorRate: 0.3, severity: "low" },
];

export function App() {
  const [view, setView] = useState<ViewMode>("overview");
  const [themeDark, setThemeDark] = useState(true);
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"latency" | "throughput">("latency");
  const [selected, setSelected] = useState<PerfRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [voiceText, setVoiceText] = useState("");
  const [voiceState, setVoiceState] = useState<"idle" | "listening" | "processing">("idle");

  const rows = useMemo(() => {
    let next = [...mockData];
    if (severity !== "all") next = next.filter((x) => x.severity === severity);
    if (search.trim()) next = next.filter((x) => x.service.includes(search.trim().toLowerCase()));
    next.sort((a, b) => b[sortBy] - a[sortBy]);
    return next;
  }, [severity, search, sortBy]);

  const kpi = useMemo(
    () => ({
      p95: Math.round(rows.reduce((s, r) => s + r.latency, 0) / Math.max(rows.length, 1)),
      err: (rows.reduce((s, r) => s + r.errorRate, 0) / Math.max(rows.length, 1)).toFixed(2),
      qps: rows.reduce((s, r) => s + r.throughput, 0),
    }),
    [rows],
  );

  const applyVoiceQuery = () => {
    setVoiceState("listening");
    setTimeout(() => {
      setVoiceState("processing");
      setVoiceText("show high severity latency hotspots");
      setTimeout(() => {
        setSeverity("high");
        setSortBy("latency");
        setVoiceState("idle");
        setToast("Voice query applied to filters");
      }, 700);
    }, 700);
  };

  const refetch = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      setToast("Data refreshed");
    }, 900);
  };

  const simulateFailure = () => {
    setLoading(false);
    setError("Metrics stream timeout. Please retry.");
  };

  return (
    <div className={themeDark ? "dark" : ""}>
      <div style={{ minHeight: "100vh", padding: 18, background: "var(--color-bg)", color: "var(--color-text)" }}>
        <header style={cardStyle}>
          <strong style={{ fontFamily: "var(--font-mono)" }}>PulseForge</strong>
          <nav style={{ display: "flex", gap: 8 }}>
            {(["overview", "root-cause", "optimization"] as ViewMode[]).map((v) => (
              <button key={v} onClick={() => setView(v)} style={pillStyle(view === v)}>
                {v}
              </button>
            ))}
          </nav>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setThemeDark((d) => !d)} style={pillStyle(false)}>theme</button>
            <button onClick={applyVoiceQuery} style={pillStyle(false)} disabled={voiceState !== "idle"}>
              {voiceState === "idle" ? "voice query" : voiceState}
            </button>
          </div>
        </header>

        <section style={{ ...cardStyle, position: "relative", overflow: "hidden", marginTop: 14 }}>
          <FlowFieldCanvas intensity={severity === "high" ? 1.5 : 1} paused={loading} />
          <div style={{ position: "relative", zIndex: 2 }}>
            <h2 style={{ margin: 0 }}>System Performance Overview</h2>
            <p style={{ color: "var(--color-muted)" }}>Mode: {view} · Voice: {voiceText || "none"}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Stat title="P95 Latency" value={`${kpi.p95}ms`} />
              <Stat title="Error Rate" value={`${kpi.err}%`} />
              <Stat title="Throughput" value={`${kpi.qps} rps`} />
            </div>
          </div>
        </section>

        <section style={{ ...cardStyle, marginTop: 14 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="search service" style={inputStyle} />
            <select value={severity} onChange={(e) => setSeverity(e.target.value as Severity | "all")} style={inputStyle}>
              <option value="all">all severity</option>
              <option value="high">high</option>
              <option value="medium">medium</option>
              <option value="low">low</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "latency" | "throughput")} style={inputStyle}>
              <option value="latency">sort by latency</option>
              <option value="throughput">sort by throughput</option>
            </select>
            <button onClick={refetch} style={pillStyle(false)}>refresh</button>
            <button onClick={simulateFailure} style={pillStyle(false)}>simulate error</button>
          </div>
        </section>

        <main style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14, marginTop: 14 }}>
          <section style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>Topology Explorer</h3>
            {loading ? <p>Loading topology...</p> : error ? <ErrorBox message={error} onRetry={refetch} /> : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                {rows.map((r) => (
                  <button key={r.id} onClick={() => setSelected(r)} style={{ ...softTile, borderColor: selected?.id === r.id ? "var(--color-primary)" : "var(--color-border)" }}>
                    <strong>{r.service}</strong>
                    <span>{r.latency}ms · {r.severity}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
          <section style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>SVG Trend Panel</h3>
            <svg width="100%" height="160" viewBox="0 0 420 160" role="img" aria-label="trend chart">
              <polyline fill="none" stroke="var(--color-cyan)" strokeWidth="3" points="0,130 70,118 140,96 210,110 280,70 350,84 420,48" />
              <polyline fill="none" stroke="var(--color-primary)" strokeWidth="2" points="0,150 70,132 140,128 210,118 280,100 350,92 420,80" />
              <circle cx="280" cy="70" r="5" fill="var(--color-danger)" />
            </svg>
            <p style={{ color: "var(--color-muted)" }}>Hover/Legend 可扩展为真实图表库，当前演示联动已实现。</p>
          </section>
        </main>

        <section style={{ ...cardStyle, marginTop: 14 }}>
          <h3 style={{ marginTop: 0 }}>Dark Neumorphic Data Grid</h3>
          {loading ? (
            <p>Loading rows...</p>
          ) : error ? (
            <ErrorBox message={error} onRetry={refetch} />
          ) : rows.length === 0 ? (
            <p>No rows matched. Clear filters or adjust query.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr><Th>Service</Th><Th>Latency</Th><Th>Throughput</Th><Th>Error</Th><Th>Severity</Th></tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} onClick={() => setSelected(r)} style={{ cursor: "pointer" }}>
                    <Td>{r.service}</Td><Td>{r.latency}ms</Td><Td>{r.throughput}</Td><Td>{r.errorRate}%</Td><Td>{r.severity}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {selected && (
          <aside style={drawerStyle}>
            <h4 style={{ marginTop: 0 }}>Insight Drawer</h4>
            <p>{selected.service}</p>
            <p>Likely cause: queue pressure and lock contention.</p>
            <button onClick={() => setSelected(null)} style={pillStyle(false)}>close</button>
          </aside>
        )}
        {toast && (
          <div style={toastStyle} role="status">
            {toast} <button onClick={() => setToast(null)} style={{ marginLeft: 8 }}>x</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return <div style={{ ...softTile, minWidth: 170 }}><small>{title}</small><strong style={{ fontSize: 20 }}>{value}</strong></div>;
}

function ErrorBox({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div style={{ ...softTile, borderColor: "var(--color-danger)" }}><p>{message}</p><button onClick={onRetry} style={pillStyle(false)}>retry</button></div>;
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid var(--color-border)" }}>{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: 10, borderBottom: "1px solid var(--color-border)", color: "var(--color-muted)" }}>{children}</td>;
}

const cardStyle: React.CSSProperties = {
  border: "1px solid var(--color-border)",
  background: "var(--color-bg-elevated)",
  borderRadius: "var(--radius-card)",
  boxShadow: "var(--shadow-soft), var(--shadow-inner)",
  padding: 14,
};
const softTile: React.CSSProperties = {
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  padding: 10,
  display: "flex",
  flexDirection: "column",
  gap: 6,
  background: "var(--color-surface)",
  color: "var(--color-text)",
};
const inputStyle: React.CSSProperties = {
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-input)",
  background: "var(--color-surface)",
  color: "var(--color-text)",
  padding: "8px 10px",
};
const drawerStyle: React.CSSProperties = {
  position: "fixed",
  right: 12,
  top: 80,
  width: 320,
  background: "var(--color-bg-elevated)",
  border: "1px solid var(--color-border)",
  borderRadius: 16,
  padding: 12,
  boxShadow: "var(--shadow-soft)",
};
const toastStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 14,
  right: 14,
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  padding: "8px 10px",
};
const pillStyle = (active: boolean): React.CSSProperties => ({
  borderRadius: 999,
  border: "1px solid var(--color-border)",
  background: active ? "var(--color-primary)" : "var(--color-surface)",
  color: active ? "#fff" : "var(--color-text)",
  padding: "6px 10px",
  cursor: "pointer",
});
