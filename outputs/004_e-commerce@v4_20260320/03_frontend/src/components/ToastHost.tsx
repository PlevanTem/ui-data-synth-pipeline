import type { ToastKind } from "../types";

export interface ToastItem {
  id: number;
  kind: ToastKind;
  text: string;
}

interface Props {
  toasts: ToastItem[];
  onClose: (id: number) => void;
}

export function ToastHost({ toasts, onClose }: Props) {
  return (
    <aside className="toast-host" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.kind}`}>
          <span>{toast.text}</span>
          <button aria-label="Close toast" onClick={() => onClose(toast.id)}>x</button>
        </div>
      ))}
    </aside>
  );
}
