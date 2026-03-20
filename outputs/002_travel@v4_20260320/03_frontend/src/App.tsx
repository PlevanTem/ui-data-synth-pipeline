import { FormEvent, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { FlowFieldCanvas } from "./generative/FlowFieldCanvas";
import { useLocalState } from "./hooks/useLocalState";
import type { AppState, LedgerEntry, ViewKey } from "./types";
import "./styles/app.css";

const defaultState: AppState = {
  points: 120,
  tasks: [
    { id: "t1", title: "景点签到", category: "check-in", points: 20, state: "todo" },
    { id: "t2", title: "博物馆解谜", category: "museum", points: 30, state: "todo" },
    { id: "t3", title: "AR 导览点位", category: "ar", points: 25, state: "todo" }
  ],
  rewards: [
    { id: "r1", name: "机场贵宾厅券", price: 80, stock: 5, ownedCount: 0 },
    { id: "r2", name: "咖啡兑换券", price: 40, stock: 20, ownedCount: 0 }
  ],
  ledger: [],
  a11y: { reducedMotion: false, fontScale: 1, contrastMode: "normal", captions: false },
  selectedWaypoint: "gate-a"
};

const waypoints = [
  { id: "gate-a", label: "Gate A", hint: "直行 120m 后右转" },
  { id: "museum-hall", label: "Museum Hall", hint: "电梯上 2F 后左转" }
];

export default function App() {
  const [state, setState] = useLocalState("travel-quest-ar", defaultState);
  const [view, setView] = useState<ViewKey>("tasks");
  const [taskFilter, setTaskFilter] = useState("all");
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskError, setTaskError] = useState(false);
  const [arMode, setArMode] = useState<"idle" | "camera" | "fallback">("idle");
  const [formStep, setFormStep] = useState(1);
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nameRef = useRef<HTMLInputElement | null>(null);

  const completedCount = state.tasks.filter((t) => t.state === "completed").length;
  const filteredTasks = taskFilter === "all" ? state.tasks : state.tasks.filter((t) => t.category === taskFilter);
  const activeWaypoint = useMemo(() => waypoints.find((w) => w.id === state.selectedWaypoint) ?? waypoints[0], [state.selectedWaypoint]);

  const record = (entry: Omit<LedgerEntry, "id" | "ts">) =>
    setState((prev) => ({ ...prev, ledger: [{ ...entry, id: crypto.randomUUID(), ts: new Date().toISOString() }, ...prev.ledger].slice(0, 8) }));

  const completeTask = (id: string) => {
    setState((prev) => {
      const task = prev.tasks.find((t) => t.id === id);
      if (!task || task.state === "completed") return prev;
      record({ type: "earn", amount: task.points, reason: `完成任务: ${task.title}` });
      toast.success(`已完成 ${task.title}，+${task.points} 积分`);
      return { ...prev, points: prev.points + task.points, tasks: prev.tasks.map((t) => (t.id === id ? { ...t, state: "completed" } : t)) };
    });
  };

  const redeem = (id: string) => {
    setState((prev) => {
      const reward = prev.rewards.find((r) => r.id === id);
      if (!reward) return prev;
      if (prev.points < reward.price || reward.stock <= 0) {
        toast.error("积分不足或库存为空");
        return prev;
      }
      record({ type: "spend", amount: reward.price, reason: `兑换: ${reward.name}` });
      toast.success(`兑换成功：${reward.name}`);
      return { ...prev, points: prev.points - reward.price, rewards: prev.rewards.map((r) => (r.id === id ? { ...r, stock: r.stock - 1, ownedCount: r.ownedCount + 1 } : r)) };
    });
  };

  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value.trim() ?? "";
    if (!name) {
      setErrors({ name: "请输入出行人姓名" });
      nameRef.current?.focus();
      return;
    }
    setErrors({});
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      toast.success("无障碍偏好已保存并全局生效");
    }, 700);
  };

  const startAR = () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setArMode("fallback");
      toast.message("当前设备不支持相机，已切换到可用降级模式");
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: true }).then((s) => {
      s.getTracks().forEach((t) => t.stop());
      setArMode("camera");
    }).catch(() => {
      setArMode("fallback");
      toast.error("相机权限被拒绝，已提供替代导览层");
    });
  };

  return (
    <div className="app-shell" style={{ fontSize: `${state.a11y.fontScale}rem` }}>
      <FlowFieldCanvas reducedMotion={state.a11y.reducedMotion} intensity={completedCount} />
      <div className="content">
        <header className="card" style={{ marginBottom: 16 }}>
          <h1 style={{ marginTop: 0, fontFamily: "Syncopate, sans-serif" }}>Travel Quest AR</h1>
          <div className="tabs">{(["tasks", "shop", "form", "ar"] as const).map((k) => <button key={k} className={view === k ? "active" : ""} onClick={() => setView(k)}>{k.toUpperCase()}</button>)}</div>
        </header>
        <main className="grid-2">
          <section className="card">
            {view === "tasks" && <><h2>任务中心</h2><div style={{ display: "flex", gap: 8, marginBottom: 12 }}><button className="btn" onClick={() => setTaskLoading(true)}>模拟 Loading</button><button className="btn" onClick={() => setTaskError(true)}>模拟 Error</button><select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)}><option value="all">全部</option><option value="check-in">签到</option><option value="museum">博物馆</option><option value="ar">AR</option></select></div>{taskLoading ? <p>任务加载中...</p> : taskError ? <p>任务加载失败 <button className="btn" onClick={() => setTaskError(false)}>重试</button></p> : filteredTasks.map((task) => <div key={task.id} className="card" style={{ marginBottom: 8 }}><div style={{ display: "flex", justifyContent: "space-between" }}><strong>{task.title}</strong><span className="badge">{task.category}</span></div><p>奖励：{task.points} 积分</p><button className="btn" disabled={task.state === "completed"} onClick={() => completeTask(task.id)}>{task.state === "completed" ? "已完成" : "完成任务"}</button></div>)}</>}
            {view === "shop" && state.rewards.map((item) => <div key={item.id} className="card" style={{ marginBottom: 8 }}><strong>{item.name}</strong><p>{item.price} 积分 | 库存 {item.stock} | 已拥有 {item.ownedCount}</p><button className="btn" disabled={state.points < item.price || item.stock <= 0} onClick={() => redeem(item.id)}>{state.points < item.price || item.stock <= 0 ? "不可兑换" : "立即兑换"}</button></div>)}
            {view === "form" && <form onSubmit={submitForm}><h2>无障碍表单（Step {formStep}/3）</h2>{formStep === 1 && <div className="field"><label htmlFor="name">出行人姓名 *</label><input id="name" ref={nameRef} aria-invalid={!!errors.name} />{errors.name && <span className="error" role="alert">{errors.name}</span>}</div>}{formStep === 2 && <div className="field"><label htmlFor="font-scale">字号缩放</label><select id="font-scale" value={state.a11y.fontScale} onChange={(e) => setState((p) => ({ ...p, a11y: { ...p.a11y, fontScale: Number(e.target.value) } }))}><option value={1}>100%</option><option value={1.1}>110%</option><option value={1.2}>120%</option></select></div>}{formStep === 3 && <div className="field"><label><input type="checkbox" checked={state.a11y.reducedMotion} onChange={(e) => setState((p) => ({ ...p, a11y: { ...p.a11y, reducedMotion: e.target.checked } }))} /> 减少动画</label></div>}<div style={{ display: "flex", gap: 8, marginTop: 12 }}><button className="btn" type="button" onClick={() => setFormStep((s) => Math.max(1, s - 1))}>上一步</button><button className="btn" type="button" onClick={() => setFormStep((s) => Math.min(3, s + 1))}>下一步</button><button className="btn" type="submit" disabled={formLoading}>{formLoading ? "提交中..." : "提交"}</button></div></form>}
            {view === "ar" && <><h2>AR 导览</h2><div style={{ display: "flex", gap: 8, marginBottom: 8 }}><button className="btn" onClick={startAR}>开始 AR</button><button className="btn" onClick={() => setArMode("idle")}>停止 AR</button></div><div className="card"><p>模式：{arMode === "camera" ? "相机模式" : arMode === "fallback" ? "降级模式" : "未启动"}</p><p>当前点位：{activeWaypoint.label} - {activeWaypoint.hint}</p>{waypoints.map((w) => <button key={w.id} className="btn" style={{ marginRight: 8 }} onClick={() => setState((p) => ({ ...p, selectedWaypoint: w.id }))}>{w.label}</button>)}</div></>}
          </section>
          <aside className="card"><h3>状态摘要</h3><p>积分：{state.points}</p><p>任务完成：{completedCount}/{state.tasks.length}</p><p>Motion：{state.a11y.reducedMotion ? "Reduced" : "Normal"}</p><h4>最近账本</h4>{state.ledger.length === 0 ? <p>暂无记录</p> : state.ledger.map((l) => <p key={l.id}>{l.type} {l.amount} - {l.reason}</p>)}</aside>
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
