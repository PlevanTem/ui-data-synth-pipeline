import { useEffect, useRef, useState } from 'react';

interface UseStreamingTextOptions {
  text: string;
  charDelay?: number;
  enabled?: boolean;
}

export function useStreamingText({ text, charDelay = 35, enabled = true }: UseStreamingTextOptions) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      return;
    }
    indexRef.current = 0;
    setDisplayed('');

    const tick = () => {
      if (indexRef.current < text.length) {
        indexRef.current++;
        setDisplayed(text.slice(0, indexRef.current));
        timerRef.current = setTimeout(tick, charDelay);
      }
    };
    timerRef.current = setTimeout(tick, charDelay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, charDelay, enabled]);

  const isComplete = displayed.length >= text.length;
  return { displayed, isComplete };
}
