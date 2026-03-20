import { useEffect, useRef } from "react";

interface FlowFieldCanvasProps {
  reducedMotion: boolean;
  intensity: number;
}

export function FlowFieldCanvas({ reducedMotion, intensity }: FlowFieldCanvasProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let frame = 0;
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const particles = Array.from({ length: reducedMotion ? 24 : 120 }, (_, i) => ({
      x: (i * 67) % window.innerWidth,
      y: (i * 41) % window.innerHeight
    }));

    const tick = () => {
      ctx.fillStyle = "rgba(6,11,22,0.08)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      frame += 1;

      for (const p of particles) {
        const n = Math.sin((p.x + frame) * 0.003) + Math.cos((p.y - frame) * 0.0021);
        const speed = reducedMotion ? 0.15 : 0.35 + intensity * 0.35;
        p.x += Math.cos(n * Math.PI) * speed;
        p.y += Math.sin(n * Math.PI) * speed;
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;
        ctx.fillStyle = "rgba(53,199,255,0.14)";
        ctx.fillRect(p.x, p.y, 1.8, 1.8);
      }
      raf = requestAnimationFrame(tick);
    };

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [intensity, reducedMotion]);

  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} aria-hidden="true" />;
}
