import { useEffect, useRef } from "react";

interface Props {
  intensity: number;
  reducedMotion: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function FlowFieldCanvas({ intensity, reducedMotion }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const particles: Particle[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles.length = 0;
      const count = Math.max(40, Math.min(160, Math.floor(rect.width / 8)));
      for (let i = 0; i < count; i += 1) {
        particles.push({ x: Math.random() * rect.width, y: Math.random() * rect.height, vx: 0, vy: 0 });
      }
    };

    const noise = (x: number, y: number) => {
      return Math.sin(x * 0.005 + y * 0.003 + performance.now() * 0.00018);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running && !reducedMotion) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = "rgba(61, 100, 189, 0.22)";

      for (const p of particles) {
        const angle = noise(p.x, p.y) * Math.PI * 2;
        const speed = 0.08 + intensity * 0.5;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = rect.width;
        if (p.x > rect.width) p.x = 0;
        if (p.y < 0) p.y = rect.height;
        if (p.y > rect.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      if (running) raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    if (!reducedMotion) {
      raf = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(77,124,254,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intensity, reducedMotion]);

  return <canvas aria-hidden="true" ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}
