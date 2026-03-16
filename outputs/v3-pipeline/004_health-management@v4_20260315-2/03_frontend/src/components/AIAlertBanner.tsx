import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useElderMode } from '../context/ElderModeContext';

export const AIAlertBanner: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  const { isElderMode } = useElderMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`mb-6 rounded-2xl bg-[#E65F5C]/10 border border-[#E65F5C]/20 p-4 flex items-start gap-3 shadow-sm ${isElderMode ? 'p-5' : ''}`}
    >
      <div className={`mt-0.5 rounded-full bg-[#E65F5C]/20 p-1 flex-shrink-0 text-[#E65F5C]`}>
        <AlertCircle size={isElderMode ? 28 : 20} strokeWidth={2.5} />
      </div>
      <div className="flex-1">
        <h4 className={`font-semibold text-[#E65F5C] ${isElderMode ? 'text-xl' : 'text-sm'}`}>
          AI 健康预警
        </h4>
        <p className={`mt-1 text-[#2D3142] ${isElderMode ? 'text-lg leading-relaxed' : 'text-sm leading-normal'}`}>
          {message}
        </p>
      </div>
      <button onClick={onClose} className="text-[#E65F5C]/60 hover:text-[#E65F5C] transition-colors p-1">
        <X size={isElderMode ? 28 : 20} />
      </button>
    </motion.div>
  );
};