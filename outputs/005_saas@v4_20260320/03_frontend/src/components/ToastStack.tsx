import { AnimatePresence, motion } from "framer-motion";
import type { ToastItem } from "../hooks/useToasts";

interface Props {
  items: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastStack({ items, onDismiss }: Props) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {items.map((item) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={() => onDismiss(item.id)}
            className="neu-card block w-72 p-3 text-left"
          >
            <strong className="block text-sm">{item.kind.toUpperCase()}</strong>
            <span className="text-xs text-text-secondary">{item.text}</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
