import { DeviceMobile, DeviceTablet, Monitor, Sun, Moon } from '@phosphor-icons/react';
import { useUIStore, useMeetingStore } from '@/store';
import type { DeviceMode } from '@/types';

const DEVICES: { id: DeviceMode; icon: React.ElementType; label: string }[] = [
  { id: 'phone', icon: DeviceMobile, label: '手机' },
  { id: 'tablet', icon: DeviceTablet, label: '平板' },
  { id: 'desktop', icon: Monitor, label: '桌面' },
];

import React from 'react';

export function TopBar() {
  const { theme, deviceMode, setDeviceMode, toggleTheme } = useUIStore();
  const { meetingStatus } = useMeetingStore();

  return (
    <header style={{
      height: 56, display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 16,
      background: 'var(--color-bg-surface)',
      borderBottom: '1px solid var(--color-border-subtle)',
      flexShrink: 0,
    }}>
      {/* Device mode tabs */}
      <div style={{
        display: 'flex', gap: 2,
        background: 'var(--color-bg-elevated)',
        borderRadius: 8, padding: 3,
      }}>
        {DEVICES.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setDeviceMode(id)}
            title={label}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
              borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12,
              background: deviceMode === id ? 'var(--color-bg-overlay)' : 'transparent',
              color: deviceMode === id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              transition: 'all 0.15s ease', fontWeight: deviceMode === id ? 500 : 400,
            }}
          >
            <Icon size={14} />
            <span style={{ fontSize: 12 }}>{label}</span>
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Meeting status indicator */}
      {meetingStatus === 'in-progress' && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(239, 68, 68, 0.12)', borderRadius: 20,
          padding: '4px 10px', border: '1px solid rgba(239, 68, 68, 0.3)',
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', background: '#ef4444',
            animation: 'pulse 1.5s ease-in-out infinite',
            boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)',
          }} />
          <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 500 }}>会议进行中</span>
        </div>
      )}

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        style={{
          width: 36, height: 36, borderRadius: 8, border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', color: 'var(--color-text-secondary)',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg-elevated)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-primary)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)';
        }}
        aria-label={theme === 'dark' ? '切换为亮色模式' : '切换为暗色模式'}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* User avatar */}
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700, color: '#0a0f1e', cursor: 'pointer',
        flexShrink: 0,
      }}>
        CX
      </div>
    </header>
  );
}
