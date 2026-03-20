import { useCallback, useMemo, useState } from "react";

export interface ToastItem {
  id: string;
  text: string;
  kind: "success" | "error" | "info";
}

export function useToasts() {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((text: string, kind: ToastItem["kind"]) => {
    const id = crypto.randomUUID();
    setItems((current) => [...current, { id, text, kind }]);
    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
    }, 2600);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  return useMemo(() => ({ items, push, remove }), [items, push, remove]);
}
