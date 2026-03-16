import React from 'react';
import { useMeetingStore } from './store/useMeetingStore';
import { BackgroundFluid } from './components/BackgroundFluid';
import { HubView } from './views/HubView';
import { MeetingRoomView } from './views/MeetingRoomView';
import { SummaryView } from './views/SummaryView';
import { AnimatePresence } from 'framer-motion';

function App() {
  const currentView = useMeetingStore((state) => state.currentView);

  return (
    <>
      <BackgroundFluid />
      <AnimatePresence mode="wait">
        {currentView === 'hub' && <HubView key="hub" />}
        {currentView === 'meeting' && <MeetingRoomView key="meeting" />}
        {currentView === 'summary' && <SummaryView key="summary" />}
      </AnimatePresence>
    </>
  );
}

export default App;