import React from 'react';
import { useWaveformCanvas } from '@/hooks/useWaveformCanvas';

interface WaveformCanvasProps {
  isActive: boolean;
  height?: number;
}

export function WaveformCanvas({ isActive, height = 48 }: WaveformCanvasProps) {
  const canvasRef = useWaveformCanvas({ isActive, color: '#38bdf8', barCount: 36 });

  return (
    <canvas
      ref={canvasRef}
      width={360}
      height={height}
      style={{ width: '100%', height: height, display: 'block' }}
      aria-hidden="true"
    />
  );
}
