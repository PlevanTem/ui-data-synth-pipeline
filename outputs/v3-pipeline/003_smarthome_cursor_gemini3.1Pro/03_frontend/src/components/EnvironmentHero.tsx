import React from 'react';
import { Cloud, Droplets, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

interface EnvironmentHeroProps {
  temperature: number;
  humidity: number;
  onVoiceClick: () => void;
}

export const EnvironmentHero: React.FC<EnvironmentHeroProps> = ({ temperature, humidity, onVoiceClick }) => {
  return (
    <div className="w-full pt-12 pb-6 px-6 flex justify-between items-start">
      <div className="flex flex-col gap-1">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-semibold tracking-tight"
        >
          上午好，
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted"
        >
          全屋设备运行正常
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-4 mt-6 text-sm font-medium"
        >
          <div className="flex items-center gap-1.5 glass-panel px-3 py-1.5 rounded-full">
            <Cloud size={16} className="text-accent" />
            <span>{temperature}°C</span>
          </div>
          <div className="flex items-center gap-1.5 glass-panel px-3 py-1.5 rounded-full">
            <Droplets size={16} className="text-accent" />
            <span>{humidity}%</span>
          </div>
        </motion.div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={onVoiceClick}
        className="glass-panel-elevated w-12 h-12 rounded-full flex items-center justify-center text-primary relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Mic size={22} className="relative z-10" />
      </motion.button>
    </div>
  );
};
