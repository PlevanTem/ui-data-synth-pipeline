import { useMemo, useState } from "react";
import { ChatPanel } from "./components/ChatPanel";
import { DetailModal } from "./components/DetailModal";
import { FilterBar } from "./components/FilterBar";
import { GeoPanel } from "./components/GeoPanel";
import { ReportForm } from "./components/ReportForm";
import { StatusPanel } from "./components/StatusPanel";
import { TaskQueue } from "./components/TaskQueue";
import { ToastStack } from "./components/ToastStack";
import { TopNav } from "./components/TopNav";
import { WhiteboardPanel } from "./components/WhiteboardPanel";
import { messageSeed, taskSeed } from "./data/mock";
import { FlowFieldCanvas } from "./generative/FlowFieldCanvas";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useToasts } from "./hooks/useToasts";
import type { FilterState, TaskItem, ViewKey } from "./types";

const initialFilter: FilterState = { query: "", region: "all", risk: "all", sort: "priority" };

export function App() {
  const [view, setView] = useState<ViewKey>("overview");
  const [filter, setFilter] = useState<FilterState>(initialFilter);
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const toasts = useToasts();

  const filteredTasks = useMemo(() => {
    let tasks = taskSeed.filter((task) => {
      if (filter.region !== "all" && task.region !== filter.region) return false;
      if (filter.risk !== "all" && task.risk !== filter.risk) return false;
      if (filter.query && !task.title.includes(filter.query)) return false;
      return true;
    });

    tasks = [...tasks].sort((a, b) => {
      if (filter.sort === "updated") return b.updatedAt - a.updatedAt;
      const weight = { low: 1, medium: 2, high: 3, critical: 4 } as const;
      return weight[b.risk] - weight[a.risk];
    });

    return tasks;
  }, [filter]);

  const filteredMessages = useMemo(() => {
    return messageSeed.filter((message) => {
      if (filter.query && !message.content.includes(filter.query)) return false;
      if (focusNodeId && message.linkedNodeId !== focusNodeId) return false;
      return true;
    });
  }, [filter.query, focusNodeId]);

  const riskIntensity = useMemo(() => {
    const map = { all: 0.2, low: 0.1, medium: 0.2, high: 0.35, critical: 0.5 } as const;
    return map[filter.risk];
  }, [filter.risk]);

  const simulateReload = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      toasts.push("状态已刷新", "info");
    }, 500);
  };

  const simulateError = () => {
    setError("网络波动：地图数据暂不可用");
  };

  return (
    <div className="relative min-h-screen px-4 pb-12 pt-6 md:px-8">
      <FlowFieldCanvas intensity={riskIntensity} reducedMotion={reducedMotion} />
      <div className="relative z-10 mx-auto max-w-7xl">
        <TopNav view={view} onChange={setView} />
        <FilterBar value={filter} onChange={setFilter} />
        <div className="mb-4 flex gap-2">
          <button className="neu-button" type="button" onClick={simulateReload}>刷新全部模块</button>
          <button className="neu-button" type="button" onClick={simulateError}>触发错误态</button>
        </div>

        <StatusPanel loading={loading} error={error} isEmpty={filteredTasks.length === 0} onRetry={simulateReload} />

        <div className="grid gap-4 lg:grid-cols-3">
          {(view === "overview" || view === "whiteboard") && (
            <WhiteboardPanel
              selectedNodeId={focusNodeId}
              onPickNode={(nodeId) => {
                setFocusNodeId(nodeId);
                toasts.push("已定位关联聊天线程", "info");
              }}
            />
          )}

          {(view === "overview" || view === "secure-chat") && (
            <ChatPanel
              messages={filteredMessages}
              focusNodeId={focusNodeId}
              onRetryMessage={(id) => {
                toasts.push(`消息 ${id} 重试成功`, "success");
              }}
            />
          )}

          {(view === "overview" || view === "geo-intel") && (
            <GeoPanel
              tasks={filteredTasks}
              onSelectRegion={(region) => {
                setFilter((current) => ({ ...current, region }));
                toasts.push(`已按 ${region} 区域过滤`, "info");
              }}
            />
          )}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <TaskQueue
            tasks={filteredTasks}
            onSelect={(task) => {
              setSelectedTask(task);
              setFocusNodeId(task.linkedNodeId);
            }}
          />

          {(view === "overview" || view === "reports") && (
            <ReportForm
              onSuccess={() => toasts.push("报表计划已保存并将定时推送", "success")}
              onError={(message) => toasts.push(message, "error")}
            />
          )}
        </div>
      </div>

      <DetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      <ToastStack items={toasts.items} onDismiss={toasts.remove} />
    </div>
  );
}
