import React, { useEffect, useRef } from 'react';

interface ParticleConvergeProps {
  onComplete: () => void;
}

export function ParticleConverge({ onComplete }: ParticleConvergeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const CX = W / 2;
    const CY = H / 2;

    const startTime = performance.now();
    const DURATION = 1500;

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: 1.5 + Math.random() * 2.5,
      color: Math.random() > 0.5 ? '#38bdf8' : '#7dd3fc',
    }));

    const draw = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = `rgba(10, 15, 30, ${Math.min(progress * 1.5, 0.85)})`;
      ctx.fillRect(0, 0, W, H);

      particles.forEach((p) => {
        const px = p.x + (CX - p.x) * eased;
        const py = p.y + (CY - p.y) * eased;
        const opacity = progress < 0.7 ? 0.8 : 0.8 * (1 - (progress - 0.7) / 0.3);
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      if (progress > 0.6) {
        const textOpacity = (progress - 0.6) / 0.4;
        ctx.fillStyle = `rgba(241, 245, 249, ${textOpacity})`;
        ctx.font = '500 18px Inter, system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('AI 正在整理会议纪要...', CX, CY);
      }

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(draw);
      } else {
        setTimeout(onComplete, 100);
      }
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        pointerEvents: 'none',
      }}
    />
  );
}
