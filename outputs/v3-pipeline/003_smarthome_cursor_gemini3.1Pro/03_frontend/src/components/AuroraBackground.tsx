import { useEffect, useRef } from 'react';

interface AuroraProps {
  color1?: string;
  color2?: string;
  color3?: string;
}

export function AuroraBackground({ 
  color1 = '#09090B', // Darkest
  color2 = '#1A1A2E', // Subtle blue/purple
  color3 = '#1E1E24'  // Dark slate
}: AuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    let t = 0;
    
    const render = () => {
      t += 0.003; // extremely slow flow
      ctx.clearRect(0, 0, width, height);
      
      // base background
      ctx.fillStyle = color1;
      ctx.fillRect(0, 0, width, height);

      // helper for radial gradients
      const drawBlob = (x: number, y: number, r: number, color: string) => {
        const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
        grd.addColorStop(0, color);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, width, height);
      };

      ctx.globalCompositeOperation = 'screen';
      
      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.max(width, height) * 0.8;
      
      drawBlob(
        cx + Math.sin(t) * cx * 0.4, 
        cy + Math.cos(t * 0.7) * cy * 0.4, 
        maxR, 
        color2
      );
      
      drawBlob(
        cx + Math.cos(t * 1.1) * cx * 0.5, 
        cy + Math.sin(t * 0.8) * cy * 0.5, 
        maxR * 0.9, 
        color3
      );

      ctx.globalCompositeOperation = 'source-over';
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color1, color2, color3]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 opacity-80"
    />
  );
}
