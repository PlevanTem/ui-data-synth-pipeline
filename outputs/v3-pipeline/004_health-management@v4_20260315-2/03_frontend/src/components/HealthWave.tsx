import React from 'react';
import { motion } from 'framer-motion';
import { useElderMode } from '../context/ElderModeContext';

interface HealthWaveProps {
  color: string;
  frequency?: number;
  amplitude?: number;
}

export const HealthWave: React.FC<HealthWaveProps> = ({ color, frequency = 2 }) => {
  const { isElderMode } = useElderMode();

  if (isElderMode) return null;

  return (
    <div className="absolute bottom-0 left-0 w-full h-24 overflow-hidden pointer-events-none opacity-20">
      <motion.svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-[200%] h-full"
        animate={{
          x: ['0%', '-50%']
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: frequency
        }}
      >
        <path d="M0,100 L0,50 Q25,30 50,50 T100,50 T150,50 T200,50 L200,100 Z" fill={color} />
      </motion.svg>
    </div>
  );
};