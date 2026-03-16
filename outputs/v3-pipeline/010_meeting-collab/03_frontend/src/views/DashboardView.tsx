import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, ArrowRight, VideoCamera, MagnifyingGlass } from '@phosphor-icons/react';
import { useMeetingStore, useUIStore } from '@/store';
import { UPCOMING_MEETINGS, HISTORY_MEETINGS } from '@/utils/mockData';

const COLORS = ['#38bdf8', '#34d399', '#a78bfa', '#fbbf24', '#fb7185'];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function DashboardView() {
  const { startMeeting } = useMeetingStore();
  const { addToast } = useUIStore();

  const handleJoin = () => {
    startMeeting();
    addToast({ type: 'success', message: '正在加入「Q1产品路线图评审」...' });
  };

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 24 }}>
      <motion.div variants={container} initial="hidden" animate="show" style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <motion.div variants={item} style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>
            下午好，陈晓明 👋
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>今天你有 {UPCOMING_MEETINGS.length} 个会议</p>
        </motion.div>

        {/* Quick join bar */}
        <motion.div variants={item} style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 12, padding: '16px 20px',
          display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24,
        }}>
          <MagnifyingGlass size={18} color="var(--color-text-tertiary)" />
          <input
            placeholder="输入会议号快速加入..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--color-text-primary)', fontSize: 14,
            }}
          />
          <button
            onClick={() => addToast({ type: 'info', message: '请输入有效的6位会议号' })}
            style={{
              background: 'var(--color-accent)', color: '#0a0f1e', border: 'none',
              borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            加入
          </button>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>

          {/* Upcoming meetings */}
          <motion.div variants={item}>
            <h2 style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              即将开始的会议
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {UPCOMING_MEETINGS.map((meeting, i) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  style={{
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 12, padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: i === 0 ? 'var(--color-accent-muted)' : 'var(--color-bg-elevated)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: i === 0 ? '1px solid rgba(56,189,248,0.3)' : '1px solid var(--color-border-subtle)',
                  }}>
                    <VideoCamera size={20} color={i === 0 ? 'var(--color-accent)' : 'var(--color-text-secondary)'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                      {meeting.title}
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} />{meeting.time}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Users size={13} />{meeting.participantCount}人
                      </span>
                    </div>
                  </div>
                  {/* Avatars */}
                  <div style={{ display: 'flex', marginRight: 8 }}>
                    {meeting.avatars.map((a, j) => (
                      <div key={j} style={{
                        width: 26, height: 26, borderRadius: '50%', marginLeft: j > 0 ? -8 : 0,
                        background: COLORS[j % COLORS.length],
                        border: '2px solid var(--color-bg-surface)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 700, color: '#0a0f1e',
                      }}>
                        {a}
                      </div>
                    ))}
                  </div>
                  {i === 0 ? (
                    <button
                      onClick={handleJoin}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'var(--color-accent)', color: '#0a0f1e',
                        border: 'none', borderRadius: 8, padding: '8px 14px',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                      }}
                    >
                      加入会议 <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => addToast({ type: 'info', message: `「${meeting.title}」尚未开始` })}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'transparent', color: 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border-default)',
                        borderRadius: 8, padding: '8px 14px',
                        fontSize: 13, cursor: 'pointer', flexShrink: 0,
                      }}
                    >
                      查看详情
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent history */}
          <motion.div variants={item}>
            <h2 style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              最近的会议
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {HISTORY_MEETINGS.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.border = '1px solid var(--color-border-default)'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.border = '1px solid var(--color-border-subtle)'}
                >
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 4 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', display: 'flex', gap: 8 }}>
                    <span>{m.date}</span>
                    <span>·</span>
                    <span>{m.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
