import React, { useRef, useEffect, useState } from 'react';
import { useMeetingStore } from '../store/useMeetingStore';
import { motion, AnimatePresence } from 'framer-motion';

export const WhiteboardCanvas: React.FC = () => {
  const isWhiteboardActive = useMeetingStore((state) => state.isWhiteboardActive);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (!isWhiteboardActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set real size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#D97706'; // accent amber
  }, [isWhiteboardActive]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <AnimatePresence>
      {isWhiteboardActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute inset-0 bg-white/90 backdrop-blur-sm z-30 rounded-2xl shadow-floating border border-border overflow-hidden"
        >
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="px-3 py-1 bg-accent-amber/10 text-accent-amber rounded-full text-sm font-medium">
              Collab Canvas
            </div>
            <div className="px-3 py-1 bg-surface shadow-sm rounded-full text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Sarah, Michael (Simulated)
            </div>
          </div>
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};