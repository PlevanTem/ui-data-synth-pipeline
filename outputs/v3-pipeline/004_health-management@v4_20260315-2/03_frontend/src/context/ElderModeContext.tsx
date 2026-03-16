import React, { createContext, useContext, useState } from 'react';

type ElderModeContextType = {
  isElderMode: boolean;
  toggleElderMode: () => void;
};

const ElderModeContext = createContext<ElderModeContextType | undefined>(undefined);

export const ElderModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isElderMode, setIsElderMode] = useState(false);

  const toggleElderMode = () => setIsElderMode(!isElderMode);

  return (
    <ElderModeContext.Provider value={{ isElderMode, toggleElderMode }}>
      {children}
    </ElderModeContext.Provider>
  );
};

export const useElderMode = () => {
  const context = useContext(ElderModeContext);
  if (!context) throw new Error('useElderMode must be used within an ElderModeProvider');
  return context;
};