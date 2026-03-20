import type { TaskItem } from "../types";

interface Props {
  tasks: TaskItem[];
  onSelect: (task: TaskItem) => void;
}

export function TaskQueue({ tasks, onSelect }: Props) {
  return (
    <section className="neu-card p-4">
      <h2 className="mb-3 text-lg font-semibold">聚焦队列</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id}>
            <button type="button" onClick={() => onSelect(task)} className="w-full rounded-xl bg-surface p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <strong>{task.title}</strong>
                <span className="text-xs uppercase">{task.risk}</span>
              </div>
              <p className="text-xs text-text-secondary">区域: {task.region}</p>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
