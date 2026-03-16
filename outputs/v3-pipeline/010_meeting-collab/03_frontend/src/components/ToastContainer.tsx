import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, WarningCircle, Info, Warning } from '@phosphor-icons/react';
import { useUIStore } from '@/store';

const ICONS = {
  success: CheckCircle,
  error: WarningCircle,
  warning: Warning,
  info: Info,
};

const COLORS = {
  success: 'var(--color-success)',
  error: 'var(--color-error)',
  warning: 'var(--color-warning)',
  info: 'var(--color-accent)',
};

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div style={{
      position: 'fixed', top: 16, right: 16, zIndex: 1000,
      display: 'flex', flexDirection: 'column', gap: 8,
      pointerEvents: 'none',
    }}>
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type];
          const color = COLORS[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 32, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 32, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                background: 'var(--color-bg-elevated)',
                border: `1px solid var(--color-border-default)`,
                borderLeft: `3px solid ${color}`,
                borderRadius: 10, padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                minWidth: 280, maxWidth: 360,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                pointerEvents: 'all',
              }}
            >
              <Icon size={18} color={color} weight="fill" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13.5, color: 'var(--color-text-primary)', flex: 1, lineHeight: 1.4 }}>
                {toast.message}
              </span>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--color-text-tertiary)', display: 'flex',
                  alignItems: 'center', padding: 2, borderRadius: 4, flexShrink: 0,
                }}
                aria-label="关闭通知"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
