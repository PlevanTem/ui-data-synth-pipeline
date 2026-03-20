import { useEffect } from "react";
import type { TaskItem } from "../types";

interface Props {
  task: TaskItem | null;
  onClose: () => void;
}

export function DetailModal({ task, onClose }: Props) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 p-4" onClick={onClose}>
      <div className="neu-card w-full max-w-lg p-5" onClick={(event) => event.stopPropagation()}>
        <h3 className="text-xl font-semibold">{task.title}</h3>
        <p className="mt-2 text-sm text-text-secondary">区域 {task.region} · 风险 {task.risk}</p>
        <button type="button" onClick={onClose} className="mt-4 rounded-xl bg-accent-info px-4 py-2 text-white">关闭</button>
      </div>
    </div>
  );
}
