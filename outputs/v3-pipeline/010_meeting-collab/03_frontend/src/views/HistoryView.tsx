import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlass, Users, Clock, FileText } from '@phosphor-icons/react';
import { HISTORY_MEETINGS } from '@/utils/mockData';

export function HistoryView() {
  const [query, setQuery] = useState('');

  const filtered = HISTORY_MEETINGS.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase()) ||
    m.keywordsZh.some((k) => k.includes(query))
  );

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 24 }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', gap: 10, alignItems: 'center',
            background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)',
            borderRadius: 10, padding: '10px 16px', marginBottom: 20,
          }}
        >
          <MagnifyingGlass size={16} color="var(--color-text-tertiary)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索历史会议标题或关键词..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 14, color: 'var(--color-text-primary)',
            }}
          />
        </motion.div>

        {/* Title */}
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', letterSpacing: '0.08em', marginBottom: 12 }}>
          历史会议 · {filtered.length} 条记录
        </div>

        {/* Meeting list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-tertiary)', fontSize: 14 }}>
              未找到相关会议记录
            </div>
          ) : (
            filtered.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 10, padding: '14px 18px',
                  display: 'flex', gap: 14, alignItems: 'center', cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.border = '1px solid var(--color-border-default)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.border = '1px solid var(--color-border-subtle)'}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <FileText size={18} color="var(--color-text-tertiary)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 4 }}>{m.title}</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={11} />{m.date}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{m.duration}</span>
                    <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Users size={11} />{m.participantCount}人
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 160 }}>
                  {m.keywordsZh.map((kw) => (
                    <span key={kw} style={{
                      fontSize: 10, padding: '2px 7px', borderRadius: 4,
                      background: 'var(--color-bg-elevated)',
                      color: 'var(--color-text-tertiary)',
                      border: '1px solid var(--color-border-subtle)',
                    }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
