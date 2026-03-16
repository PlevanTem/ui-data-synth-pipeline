import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Moon, Film, LogOut } from 'lucide-react';
import type { Scene } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SceneCardProps {
  scene: Scene;
  isActive: boolean;
  onActivate: (id: string) => void;
}

const iconMap: Record<string, React.FC<any>> = {
  home: Home,
  leave: LogOut,
  sleep: Moon,
  movie: Film,
};

const colorMap: Record<string, string> = {
  home: 'text-scene-home',
  leave: 'text-scene-leave',
  sleep: 'text-scene-sleep',
  movie: 'text-scene-movie',
};

const bgMap: Record<string, string> = {
  home: 'bg-scene-home/20',
  leave: 'bg-scene-leave/20',
  sleep: 'bg-scene-sleep/20',
  movie: 'bg-scene-movie/20',
};

export const SceneCard: React.FC<SceneCardProps> = ({ scene, isActive, onActivate }) => {
  const Icon = iconMap[scene.id] || Home;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onActivate(scene.id)}
      className={cn(
        "relative flex flex-col items-center justify-center p-3 rounded-[24px] w-[88px] h-[88px] transition-all duration-500 overflow-hidden group",
        isActive ? "glass-panel-elevated" : "glass-panel"
      )}
    >
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={cn("absolute inset-0 z-0", bgMap[scene.id])}
          />
        )}
      </AnimatePresence>
      
      <div className={cn("relative z-10 transition-colors duration-300", isActive ? colorMap[scene.id] : "text-muted group-hover:text-primary")}>
        <Icon size={26} strokeWidth={1.5} />
      </div>
      <div className={cn("relative z-10 text-[11px] mt-2 font-medium transition-colors duration-300", isActive ? "text-primary" : "text-muted")}>
        {scene.name}
      </div>
    </motion.button>
  );
};
