import React from 'react';
import { motion } from 'framer-motion';
import { useElderMode } from '../context/ElderModeContext';
import { HealthWave } from './HealthWave';

interface VitalCardProps {
  title: string;
  value: string | number;
  unit: string;
  status: 'normal' | 'alert';
  onClick: () => void;
  isActive?: boolean;
}

export const VitalCard: React.FC<VitalCardProps> = ({ title, value, unit, status, onClick, isActive }) => {
  const { isElderMode } = useElderMode();
  
  // Choose color based on status and title
  const getThemeColor = () => {
    if (status === 'alert') return '#E65F5C'; // warm alert
    if (title.includes('睡眠')) return '#4F518C';
    if (title.includes('心率')) return '#E4895C';
    return '#6BA292'; // activity/oxygen
  };

  const themeColor = getThemeColor();

  return (
    <motion.div
      layout
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden cursor-pointer rounded-[24px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-2 transition-colors duration-300 ${isActive ? 'border-opacity-100' : 'border-transparent'}`}
      style={{ borderColor: isActive ? themeColor : 'transparent' }}
    >
      <motion.h3 layout className={`font-semibold text-[#747C84] relative z-10 ${isElderMode ? 'text-xl' : 'text-sm'}`}>
        {title}
      </motion.h3>
      <div className="mt-2 flex items-baseline gap-2 relative z-10">
        <motion.span layout className={`font-bold text-[#2D3142] tabular-nums ${isElderMode ? 'text-5xl' : 'text-4xl'}`}>
          {value}
        </motion.span>
        <motion.span layout className={`font-medium text-[#747C84] ${isElderMode ? 'text-xl' : 'text-base'}`}>
          {unit}
        </motion.span>
      </div>

      {status === 'alert' && (
        <div className="mt-4 inline-flex relative z-10 items-center gap-1.5 rounded-full bg-[#E65F5C]/10 px-3 py-1 text-sm font-medium text-[#E65F5C]">
          <span className="w-2 h-2 rounded-full bg-[#E65F5C] animate-pulse" />
          需关注
        </div>
      )}

      {/* Dynamic Health Wave replacing static SVG */}
      <HealthWave 
        color={themeColor} 
        frequency={status === 'alert' ? 1.5 : (title.includes('睡眠') ? 4 : 2)} 
        amplitude={status === 'alert' ? 25 : 15}
      />
    </motion.div>
  );
};