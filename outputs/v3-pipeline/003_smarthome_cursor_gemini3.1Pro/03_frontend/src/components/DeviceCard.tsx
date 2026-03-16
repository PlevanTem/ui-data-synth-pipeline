import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Thermometer, ShieldCheck, Tv, Blinds, Power } from 'lucide-react';
import type { Device } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DeviceCardProps {
  device: Device;
  onToggle: (id: string) => void;
}

const iconMap = {
  light: Lightbulb,
  climate: Thermometer,
  security: ShieldCheck,
  media: Tv,
  curtain: Blinds,
};

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onToggle }) => {
  const Icon = iconMap[device.type] || Power;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onToggle(device.id)}
      className={cn(
        "relative flex flex-col justify-between text-left p-4 rounded-3xl h-32 w-full transition-colors duration-300 overflow-hidden",
        device.isOn 
          ? "bg-white/10 shadow-[0_0_20px_0_rgba(56,189,248,0.15)] border border-white/20" 
          : "glass-panel"
      )}
    >
      {/* Background Glow when ON */}
      {device.isOn && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-50 pointer-events-none" />
      )}

      <div className="relative flex justify-between items-start w-full">
        <div 
          className={cn(
            "p-2 rounded-2xl transition-colors duration-300",
            device.isOn ? "bg-accent/20 text-accent" : "bg-white/5 text-muted"
          )}
        >
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <div 
          className={cn(
            "w-2 h-2 rounded-full mt-2 transition-colors",
            device.isOnline ? (device.isOn ? "bg-accent shadow-[0_0_8px_rgba(56,189,248,0.8)]" : "bg-white/20") : "bg-status-offline"
          )}
        />
      </div>

      <div className="relative z-10">
        <div className="font-medium text-primary text-sm truncate">{device.name}</div>
        <div className="text-xs text-muted mt-0.5 font-light">
          {device.isOnline ? (device.isOn ? (device.value ? `${device.value}` : '已开启') : '已关闭') : '离线'}
        </div>
      </div>
    </motion.button>
  );
};
