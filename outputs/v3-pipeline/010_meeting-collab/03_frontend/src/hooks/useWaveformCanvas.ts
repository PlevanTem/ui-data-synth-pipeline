import { useEffect, useRef } from 'react';

interface WaveformOptions {
  barCount?: number;
  color?: string;
  isActive?: boolean;
}

export function useWaveformCanvas(options: WaveformOptions = {}) {
  const { barCount = 36, color = '#38bdf8', isActive = false } = options;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const barWidth = 3;
      const gap = (width - barCount * barWidth) / (barCount + 1);
      timeRef.current += 0.016;

      for (let i = 0; i < barCount; i++) {
        const x = gap + i * (barWidth + gap);
        const noise = Math.sin(i * 0.4 + timeRef.current * 2.5) * 0.5 +
          Math.sin(i * 0.7 + timeRef.current * 1.3) * 0.3 +
          Math.sin(i * 0.15 + timeRef.current * 0.8) * 0.2;
        const normalizedNoise = (noise + 1) / 2;
        const amplitude = isActive ? normalizedNoise : normalizedNoise * 0.15 + 0.05;
        const barHeight = Math.max(4, amplitude * (height - 8));
        const y = (height - barHeight) / 2;

        const opacity = isActive ? 0.5 + normalizedNoise * 0.5 : 0.25;
        ctx.fillStyle = color + Math.round(opacity * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      if (!prefersReduced) {
        frameRef.current = requestAnimationFrame(draw);
      }
    };

    if (prefersReduced) {
      draw();
    } else {
      frameRef.current = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [barCount, color, isActive]);

  return canvasRef;
}
