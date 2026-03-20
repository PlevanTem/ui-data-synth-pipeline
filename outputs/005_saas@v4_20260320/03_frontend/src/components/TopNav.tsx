import type { ViewKey } from "../types";

interface Props {
  view: ViewKey;
  onChange: (view: ViewKey) => void;
}

const items: ViewKey[] = ["overview", "whiteboard", "secure-chat", "geo-intel", "reports"];

export function TopNav({ view, onChange }: Props) {
  return (
    <nav className="neu-card sticky top-4 z-20 mb-4 flex flex-wrap gap-2 p-3">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={"rounded-full px-3 py-2 text-sm transition " + (item === view ? "bg-accent-info text-white" : "bg-surface text-text-secondary")}
        >
          {item}
        </button>
      ))}
    </nav>
  );
}
