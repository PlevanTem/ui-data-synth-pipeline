import type { TaskItem } from "../types";

interface Props {
  tasks: TaskItem[];
  onSelectRegion: (region: TaskItem["region"]) => void;
}

export function GeoPanel({ tasks, onSelectRegion }: Props) {
  return (
    <section className="neu-card p-4">
      <h2 className="mb-3 text-lg font-semibold">地理热力</h2>
      <div className="grid grid-cols-2 gap-2">
        {tasks.map((task) => (
          <button key={task.id} type="button" onClick={() => onSelectRegion(task.region)} className="rounded-lg bg-surface p-3 text-left">
            <p className="text-sm font-medium">{task.region.toUpperCase()}</p>
            <p className="text-xs text-text-secondary">{task.title}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
