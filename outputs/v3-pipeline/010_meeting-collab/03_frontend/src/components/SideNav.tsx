import React from 'react';
import {
  House, VideoCamera, FileText, CheckSquare, ClockCounterClockwise,
  CaretLeft, CaretRight,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeetingStore, useUIStore } from '@/store';
import type { View } from '@/types';

const NAV_ITEMS: { id: View; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: '会议首页', icon: House },
  { id: 'meeting', label: '进行中的会议', icon: VideoCamera },
  { id: 'minutes', label: '会议纪要', icon: FileText },
  { id: 'tasks', label: '任务待办', icon: CheckSquare },
  { id: 'history', label: '历史会议', icon: ClockCounterClockwise },
];

export function SideNav() {
  const { currentView, setCurrentView, meetingStatus } = useMeetingStore();
  const { sideNavCollapsed, toggleSideNav } = useUIStore();

  return (
    <motion.nav
      animate={{ width: sideNavCollapsed ? 64 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        background: 'var(--color-bg-surface)',
        borderRight: '1px solid var(--color-border-subtle)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{
        height: 56, display: 'flex', alignItems: 'center',
        padding: sideNavCollapsed ? '0 16px' : '0 20px',
        borderBottom: '1px solid var(--color-border-subtle)',
        gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, color: '#0a0f1e',
        }}>
          HM
        </div>
        <AnimatePresence>
          {!sideNavCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}
            >
              HarmonyMeet AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = currentView === id;
          const isMeetingItem = id === 'meeting';
          const showDot = isMeetingItem && meetingStatus === 'in-progress';

          return (
            <button
              key={id}
              onClick={() => setCurrentView(id)}
              title={sideNavCollapsed ? label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: sideNavCollapsed ? '10px 0' : '10px 12px',
                justifyContent: sideNavCollapsed ? 'center' : 'flex-start',
                borderRadius: 8, border: 'none', cursor: 'pointer',
                background: isActive ? 'var(--color-accent-muted)' : 'transparent',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                width: '100%', transition: 'all 0.15s ease', position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg-elevated)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)';
                }
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                {showDot && (
                  <span style={{
                    position: 'absolute', top: -2, right: -2,
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#ef4444', animation: 'pulse 2s infinite',
                  }} />
                )}
              </div>
              <AnimatePresence>
                {!sideNavCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ fontSize: 13.5, fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap' }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      {/* Collapse toggle */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--color-border-subtle)' }}>
        <button
          onClick={toggleSideNav}
          style={{
            width: '100%', height: 36, border: 'none', cursor: 'pointer',
            background: 'transparent', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-tertiary)', transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-elevated)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          {sideNavCollapsed ? <CaretRight size={16} /> : <CaretLeft size={16} />}
        </button>
      </div>
    </motion.nav>
  );
}
