import React from 'react';
import { useElderMode } from '../context/ElderModeContext';

export const GenerativeBackground: React.FC = () => {
  const { isElderMode } = useElderMode();

  if (isElderMode) {
    return <div className="fixed inset-0 w-full h-full bg-[#FDFBF7] -z-10 pointer-events-none transition-colors duration-1000" />;
  }

  return (
    <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden bg-[#FDFBF7] transition-colors duration-1000">
      <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob bg-[#E4895C]"></div>
      <div className="absolute top-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000 bg-[#6BA292]"></div>
      <div className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000 bg-[#F4B860]"></div>
    </div>
  );
};