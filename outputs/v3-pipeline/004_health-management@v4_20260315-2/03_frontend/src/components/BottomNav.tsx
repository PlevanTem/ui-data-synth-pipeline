import React from 'react';
import { motion } from 'framer-motion';
import { Activity, BrainCircuit, FileText, User } from 'lucide-react';
import { useElderMode } from '../context/ElderModeContext';

export const BottomNav: React.FC<{ activeTab: string; setActiveTab: (t: string) => void }> = ({ activeTab, setActiveTab }) => {
  const { isElderMode } = useElderMode();

  const tabs = [
    { id: 'dashboard', label: '看板', icon: Activity },
    { id: 'ai', label: '指导', icon: BrainCircuit },
    { id: 'report', label: '报告', icon: FileText },
    { id: 'profile', label: '我的', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-[#747C84]/10 pb-safe">
      <div className={`mx-auto max-w-md flex justify-around items-center px-2 ${isElderMode ? 'py-4' : 'py-3'}`}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center p-2 rounded-2xl w-16"
            >
              <div className="relative z-10 flex flex-col items-center">
                <Icon 
                  size={isElderMode ? 28 : 24} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors duration-300 ${isActive ? 'text-[#E4895C]' : 'text-[#747C84]'}`} 
                />
                <span className={`mt-1 font-medium transition-colors duration-300 ${isElderMode ? 'text-base' : 'text-xs'} ${isActive ? 'text-[#E4895C]' : 'text-[#747C84]'}`}>
                  {tab.label}
                </span>
              </div>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 bg-[#E4895C]/10 rounded-2xl z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};