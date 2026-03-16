import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Monitor } from '@phosphor-icons/react';
import { useUIStore, useMeetingStore } from '@/store';

export function ProjectionModal() {
  const { projectionOpen, setProjectionOpen } = useUIStore();
  const { language } = useMeetingStore();

  return (
    <AnimatePresence>
      {projectionOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setProjectionOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 16, padding: '20px 24px',
              width: '90%', maxWidth: 640,
              boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Monitor size={18} color="var(--color-accent)" />
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  智慧屏投屏预览
                </span>
              </div>
              <button
                onClick={() => setProjectionOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: 4, borderRadius: 6 }}
                aria-label="关闭"
              >
                <X size={16} />
              </button>
            </div>

            {/* Screen preview */}
            <div style={{
              background: '#000', borderRadius: 10, overflow: 'hidden',
              aspectRatio: '16/9', position: 'relative',
              border: '2px solid var(--color-border-default)',
            }}>
              {/* Simulated screen content */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, #0a0f1e 0%, #111827 100%)',
                padding: '5% 6%',
                display: 'flex', flexDirection: 'column', gap: '3%',
              }}>
                <div style={{ fontSize: '2.2%', color: '#38bdf8', fontWeight: 600 }}>
                  {language === 'zh' ? 'Q1产品路线图评审 · 会议进行中' : 'Q1 Roadmap Review · In Progress'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '60% 38%', gap: '2%', flex: 1 }}>
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '1.5%', padding: '3%' }}>
                    <div style={{ fontSize: '1.8%', color: '#94a3b8', marginBottom: '3%' }}>实时转写</div>
                    {[1,2,3].map(i => (
                      <div key={i} style={{ marginBottom: '2%', display: 'flex', gap: '2%', alignItems: 'flex-start' }}>
                        <div style={{ width: '4%', aspectRatio: '1', borderRadius: '50%', background: ['#38bdf8','#34d399','#a78bfa'][i-1], flexShrink: 0 }} />
                        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '1%', height: '1.5%', flex: 1 }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '1.5%', padding: '3%' }}>
                    <div style={{ fontSize: '1.8%', color: '#38bdf8', marginBottom: '3%' }}>AI 摘要</div>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ marginBottom: '2%', background: 'rgba(56,189,248,0.08)', borderRadius: '1%', height: '1.8%' }} />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5%' }}>
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} style={{ width: '4%', aspectRatio: '1', borderRadius: '50%', background: ['#38bdf8','#34d399','#a78bfa','#fbbf24','#fb7185','#2dd4bf'][i-1] + '55' }} />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, padding: '10px 14px', background: 'var(--color-bg-surface)', borderRadius: 8, border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 2 }}>设备</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>客厅智慧屏 65"</div>
              </div>
              <div style={{ flex: 1, padding: '10px 14px', background: 'var(--color-bg-surface)', borderRadius: 8, border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 2 }}>状态</div>
                <div style={{ fontSize: 13, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />
                  已连接
                </div>
              </div>
              <button
                onClick={() => { setProjectionOpen(false); }}
                style={{
                  background: 'var(--color-accent)', color: '#0a0f1e',
                  border: 'none', borderRadius: 8, padding: '0 20px',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                开始投屏
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
