import { useEffect, useRef } from "react";

interface FlowFieldCanvasProps {
  intensity: number;
  paused: boolean;
}

export function FlowFieldCanvas({ intensity, paused }: FlowFieldCanvasProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const setSize = () => {
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.floor(clientWidth * dpr);
      canvas.height = Math.floor(clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();
    window.addEventListener("resize", setSize);

    const particles = Array.from({ length: reduced ? 30 : 80 }, () => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      vx: 0,
      vy: 0,
    }));
    let raf = 0;
    let t = 0;

    const step = () => {
      if (!paused) {
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        particles.forEach((p) => {
          const n = Math.sin((p.x + t) * 0.01) + Math.cos((p.y - t) * 0.01);
          const speed = (reduced ? 0.15 : 0.32) * intensity;
          p.vx = Math.cos(n * Math.PI) * speed;
          p.vy = Math.sin(n * Math.PI) * speed;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = canvas.clientWidth;
          if (p.x > canvas.clientWidth) p.x = 0;
          if (p.y < 0) p.y = canvas.clientHeight;
          if (p.y > canvas.clientHeight) p.y = 0;
          ctx.fillStyle = "rgba(34, 211, 238, 0.35)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        });
        t += 0.8;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSize);
    };
  }, [intensity, paused]);

  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.7 }} aria-hidden="true" />;
}
