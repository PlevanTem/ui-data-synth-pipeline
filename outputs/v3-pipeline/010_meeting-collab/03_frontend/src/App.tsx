import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SideNav } from '@/components/SideNav';
import { TopBar } from '@/components/TopBar';
import { ToastContainer } from '@/components/ToastContainer';
import { ProjectionModal } from '@/components/ProjectionModal';
import { DashboardView } from '@/views/DashboardView';
import { MeetingView } from '@/views/MeetingView';
import { MinutesView } from '@/views/MinutesView';
import { TasksView } from '@/views/TasksView';
import { HistoryView } from '@/views/HistoryView';
import { useMeetingStore, useUIStore } from '@/store';

const VIEW_COMPONENTS = {
  dashboard: DashboardView,
  meeting: MeetingView,
  minutes: MinutesView,
  tasks: TasksView,
  history: HistoryView,
};

export function App() {
  const { currentView } = useMeetingStore();
  const { theme } = useUIStore();
  const ViewComponent = VIEW_COMPONENTS[currentView];

  return (
    <div
      className={theme === 'light' ? 'theme-light' : ''}
      style={{
        height: '100vh', display: 'flex', flexDirection: 'column',
        background: 'var(--color-bg-base)', color: 'var(--color-text-primary)',
        overflow: 'hidden',
      }}
    >
      <TopBar />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <SideNav />
        <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              style={{ height: '100%', overflow: 'hidden' }}
            >
              <ViewComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <ToastContainer />
      <ProjectionModal />
    </div>
  );
}
