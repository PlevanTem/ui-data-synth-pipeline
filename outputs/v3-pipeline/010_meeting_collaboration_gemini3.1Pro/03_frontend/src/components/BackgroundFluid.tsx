import React, { useEffect, useRef } from 'react';
import { useMeetingStore } from '../store/useMeetingStore';

export const BackgroundFluid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isSpeaking = useMeetingStore((state) => state.isSpeaking);
  const currentView = useMeetingStore((state) => state.currentView);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{x: number, y: number, vx: number, vy: number, size: number}> = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1
        });
      }
    };

    window.addEventListener('resize', resize);
    resize();

    let time = 0;

    const render = () => {
      time += 0.01;
      // Fade out previous frame to create trails
      ctx.fillStyle = 'rgba(247, 249, 250, 0.1)'; // #F7F9FA with opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const speedMultiplier = isSpeaking ? 3 : 0.5;

      particles.forEach(p => {
        const angle = Math.sin(p.x * 0.005 + time) * Math.cos(p.y * 0.005 + time) * Math.PI * 2;
        
        p.vx += Math.cos(angle) * 0.02 * speedMultiplier;
        p.vy += Math.sin(angle) * 0.02 * speedMultiplier;

        p.vx *= 0.95;
        p.vy *= 0.95;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isSpeaking ? 'rgba(217, 119, 6, 0.15)' : 'rgba(49, 130, 206, 0.05)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isSpeaking]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed top-0 left-0 w-full h-full -z-10 transition-opacity duration-1000 ${currentView === 'hub' ? 'opacity-30' : 'opacity-100'}`}
      style={{ pointerEvents: 'none', background: '#F7F9FA' }}
    />
  );
};