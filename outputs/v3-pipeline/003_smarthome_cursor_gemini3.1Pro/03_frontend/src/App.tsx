import React from 'react';
import { AuroraBackground } from './components/AuroraBackground';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden font-sans text-primary">
      <AuroraBackground />
      <Dashboard />
    </div>
  );
}

export default App;
