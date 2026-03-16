import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowSquareOut, Translate, Export, ArrowRight } from '@phosphor-icons/react';
import { useMeetingStore, useUIStore, useTaskStore } from '@/store';
import { MOCK_MINUTES } from '@/utils/mockData';
import type { Task } from '@/types';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function MinutesView() {
  const { language, setLanguage, syncedTaskIds, syncActionItem, syncAllActionItems } = useMeetingStore();
  const { addToast } = useUIStore();
  const { addTasksFromMinutes, setCurrentView } = useTaskStore() as any;
  const { setCurrentView: setView } = useMeetingStore();

  const minutes = MOCK_MINUTES;

  const handleSyncItem = (itemId: string, itemText: string) => {
    syncActionItem(itemId);
    addToast({ type: 'success', message: `「${itemText.slice(0, 20)}...」已同步到任务` });
  };

  const handleSyncAll = () => {
    const unsyncedIds = minutes.actionItems.filter((a) => !syncedTaskIds.includes(a.id)).map((a) => a.id);
    if (unsyncedIds.length === 0) {
      addToast({ type: 'info', message: '所有行动项已同步' });
      return;
    }
    syncAllActionItems(unsyncedIds);

    const newTasks: Task[] = minutes.actionItems.filter((a) => unsyncedIds.includes(a.id)).map((a, i) => ({
      id: a.id,
      title: a.text.slice(0, 20),
      titleEn: a.textEn.slice(0, 30),
      sourceMeetingId: minutes.meetingId,
      sourceMeetingTitle: minutes.title,
      assignee: a.assignee,
      dueDate: a.dueDate,
      status: 'todo' as const,
      description: a.text,
      descriptionEn: a.textEn,
      relatedMinutesExcerpt: a.text,
      relatedMinutesExcerptEn: a.textEn,
    }));

    addToast({ type: 'success', message: `已同步 ${unsyncedIds.length} 个任务到待办清单` });
  };

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: '20px 24px' }}>
      <motion.div variants={container} initial="hidden" animate="show" style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <motion.div variants={item} style={{
          background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)',
          borderRadius: 14, padding: '20px 24px', marginBottom: 16,
          display: 'flex', alignItems: 'flex-start', gap: 16,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
                color: 'var(--color-accent)', background: 'var(--color-accent-muted)',
                borderRadius: 4, padding: '2px 7px', border: '1px solid rgba(56,189,248,0.2)',
              }}>AI 生成纪要</span>
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 }}>
              {language === 'zh' ? minutes.title : minutes.titleEn}
            </h1>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              {minutes.date} · {minutes.duration} · {minutes.participants.join('、')}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <div style={{
              display: 'flex', gap: 2,
              background: 'var(--color-bg-elevated)', borderRadius: 8, padding: 3,
            }}>
              {(['zh', 'en'] as const).map((lang) => (
                <button key={lang} onClick={() => setLanguage(lang)} style={{
                  padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: language === lang ? 600 : 400,
                  background: language === lang ? 'var(--color-bg-overlay)' : 'transparent',
                  color: language === lang ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                }}>
                  {lang === 'zh' ? '中文' : 'EN'}
                </button>
              ))}
            </div>
            <button
              onClick={() => addToast({ type: 'success', message: '纪要链接已复制到剪贴板' })}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, background: 'var(--color-bg-elevated)',
                color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-default)',
                borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer',
              }}
            >
              <Export size={14} /> 导出
            </button>
          </div>
        </motion.div>

        {/* Agenda items */}
        {minutes.agendaItems.map((agenda) => (
          <motion.div key={agenda.id} variants={item} style={{
            background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)',
            borderRadius: 12, padding: '18px 22px', marginBottom: 12,
          }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>
              {language === 'zh' ? agenda.title : agenda.titleEn}
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: 12 }}>
              {language === 'zh' ? agenda.content : agenda.contentEn}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {agenda.decisions.map((d) => (
                <div key={d.id} style={{
                  display: 'flex', gap: 8, alignItems: 'flex-start',
                  padding: '8px 12px', borderRadius: 8,
                  background: d.importance === 'high' ? 'rgba(251,191,36,0.06)' : 'var(--color-bg-elevated)',
                  border: `1px solid ${d.importance === 'high' ? 'rgba(251,191,36,0.15)' : 'var(--color-border-subtle)'}`,
                }}>
                  <CheckCircle size={15} color={d.importance === 'high' ? '#fbbf24' : 'var(--color-success)'} weight="fill" style={{ marginTop: 1, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                    {language === 'zh' ? d.text : d.textEn}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Action items */}
        <motion.div variants={item} style={{
          background: 'var(--color-bg-surface)', border: '1px solid rgba(56,189,248,0.2)',
          borderRadius: 12, padding: '18px 22px', marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>
              行动项
              <span style={{
                marginLeft: 8, fontSize: 12, color: 'var(--color-accent)',
                background: 'var(--color-accent-muted)', borderRadius: 4, padding: '2px 7px',
              }}>
                {minutes.actionItems.length} 项
              </span>
            </h2>
            <button
              onClick={handleSyncAll}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'var(--color-accent)', color: '#0a0f1e',
                border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              全部同步到任务 <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {minutes.actionItems.map((ai) => {
              const isSynced = syncedTaskIds.includes(ai.id);
              return (
                <div key={ai.id} style={{
                  display: 'flex', gap: 12, alignItems: 'center',
                  padding: '10px 14px', borderRadius: 8,
                  background: isSynced ? 'rgba(52,211,153,0.06)' : 'var(--color-bg-elevated)',
                  border: `1px solid ${isSynced ? 'rgba(52,211,153,0.2)' : 'var(--color-border-subtle)'}`,
                  transition: 'all 0.2s ease',
                }}>
                  <CheckCircle
                    size={16} weight={isSynced ? 'fill' : 'regular'}
                    color={isSynced ? 'var(--color-success)' : 'var(--color-text-tertiary)'}
                    style={{ flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                      {language === 'zh' ? ai.text : ai.textEn}
                    </p>
                    <div style={{ display: 'flex', gap: 10, marginTop: 3 }}>
                      <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>负责人: {ai.assignee}</span>
                      <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>截止: {ai.dueDate}</span>
                    </div>
                  </div>
                  {!isSynced && (
                    <button
                      onClick={() => handleSyncItem(ai.id, language === 'zh' ? ai.text : ai.textEn)}
                      style={{
                        background: 'transparent', color: 'var(--color-accent)',
                        border: '1px solid rgba(56,189,248,0.3)', borderRadius: 7,
                        padding: '4px 10px', fontSize: 11, cursor: 'pointer', flexShrink: 0,
                      }}
                    >
                      同步
                    </button>
                  )}
                  {isSynced && (
                    <span style={{ fontSize: 11, color: 'var(--color-success)', flexShrink: 0 }}>已同步</span>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
