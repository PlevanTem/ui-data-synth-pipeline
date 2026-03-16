import React from 'react';
import { ElderModeProvider } from './context/ElderModeContext';
import { Dashboard } from './components/Dashboard';
import { GenerativeBackground } from './components/GenerativeBackground';

const App: React.FC = () => {
  return (
    <ElderModeProvider>
      <div className="relative min-h-screen">
        <GenerativeBackground />
        <Dashboard />
      </div>
    </ElderModeProvider>
  );
};

export default App;