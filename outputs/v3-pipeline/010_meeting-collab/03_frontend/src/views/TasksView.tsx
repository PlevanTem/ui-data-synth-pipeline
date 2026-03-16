import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarBlank, User, ArrowSquareOut } from '@phosphor-icons/react';
import { useTaskStore, useUIStore, useMeetingStore } from '@/store';
import type { TaskStatus } from '@/types';

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  todo: { label: '待办', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
  doing: { label: '进行中', color: '#38bdf8', bg: 'rgba(56,189,248,0.1)' },
  done: { label: '已完成', color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
};

const FILTER_OPTIONS: { id: 'all' | TaskStatus; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'todo', label: '待办' },
  { id: 'doing', label: '进行中' },
  { id: 'done', label: '已完成' },
];

export function TasksView() {
  const { tasks, selectedTaskId, filterStatus, drawerOpen, setFilterStatus, setSelectedTaskId, setDrawerOpen, updateTaskStatus } = useTaskStore();
  const { addToast } = useUIStore();
  const { language } = useMeetingStore();

  const filteredTasks = filterStatus === 'all' ? tasks : tasks.filter((t) => t.status === filterStatus);
  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  const handleStatusCycle = (id: string, current: TaskStatus) => {
    const next: Record<TaskStatus, TaskStatus> = { todo: 'doing', doing: 'done', done: 'todo' };
    const nextStatus = next[current];
    updateTaskStatus(id, nextStatus);
    addToast({ type: 'success', message: `任务状态已更新为「${STATUS_CONFIG[nextStatus].label}」` });
  };

  return (
    <div style={{ height: '100%', display: 'flex', overflow: 'hidden' }}>

      {/* Task list */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Filter bar */}
        <div style={{
          padding: '14px 20px', borderBottom: '1px solid var(--color-border-subtle)',
          background: 'var(--color-bg-surface)', display: 'flex', gap: 8, alignItems: 'center',
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginRight: 4 }}>任务待办</span>
          <span style={{
            fontSize: 12, color: 'var(--color-text-tertiary)',
            background: 'var(--color-bg-elevated)', borderRadius: 99,
            padding: '2px 8px', marginRight: 8,
          }}>
            {tasks.filter((t) => t.status !== 'done').length} 项未完成
          </span>
          {FILTER_OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilterStatus(id)}
              style={{
                padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12,
                background: filterStatus === id ? 'var(--color-accent-muted)' : 'transparent',
                color: filterStatus === id ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontWeight: filterStatus === id ? 600 : 400,
                transition: 'all 0.15s ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
          {filteredTasks.length === 0 ? (
            <div style={{
              height: '60%', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 12,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: 'var(--color-bg-elevated)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 28,
              }}>✓</div>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>没有符合条件的任务</p>
              <button
                onClick={() => setFilterStatus('all')}
                style={{
                  background: 'var(--color-accent-muted)', color: 'var(--color-accent)',
                  border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8,
                  padding: '8px 16px', fontSize: 13, cursor: 'pointer',
                }}
              >
                查看全部任务
              </button>
            </div>
          ) : (
            <motion.div layout style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task) => {
                  const cfg = STATUS_CONFIG[task.status];
                  const isSelected = selectedTaskId === task.id;
                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => { setSelectedTaskId(task.id); setDrawerOpen(true); }}
                      style={{
                        background: isSelected ? 'var(--color-accent-muted)' : 'var(--color-bg-surface)',
                        border: `1px solid ${isSelected ? 'rgba(56,189,248,0.3)' : 'var(--color-border-subtle)'}`,
                        borderRadius: 10, padding: '12px 16px', cursor: 'pointer',
                        display: 'flex', gap: 12, alignItems: 'center',
                        transition: 'background 0.15s, border 0.15s',
                      }}
                    >
                      {/* Status chip */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStatusCycle(task.id, task.status); }}
                        style={{
                          padding: '3px 10px', borderRadius: 20, border: 'none', cursor: 'pointer',
                          fontSize: 11, fontWeight: 600, flexShrink: 0,
                          background: cfg.bg, color: cfg.color,
                          transition: 'all 0.15s ease',
                        }}
                        title="点击切换状态"
                      >
                        {cfg.label}
                      </button>

                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)',
                          textDecoration: task.status === 'done' ? 'line-through' : 'none',
                          opacity: task.status === 'done' ? 0.6 : 1,
                          marginBottom: 3,
                        }}>
                          {language === 'zh' ? task.title : task.titleEn}
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <User size={11} />{task.assignee}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <CalendarBlank size={11} />{task.dueDate}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>来自：{task.sourceMeetingTitle}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {drawerOpen && selectedTask && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              width: 340, borderLeft: '1px solid var(--color-border-subtle)',
              background: 'var(--color-bg-surface)', display: 'flex', flexDirection: 'column',
              overflow: 'hidden', flexShrink: 0,
            }}
          >
            <div style={{
              padding: '14px 16px', borderBottom: '1px solid var(--color-border-subtle)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>任务详情</span>
              <button
                onClick={() => { setDrawerOpen(false); setSelectedTaskId(null); }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: 4, borderRadius: 6 }}
                aria-label="关闭详情"
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
              {/* Status */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 6 }}>状态</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['todo', 'doing', 'done'] as TaskStatus[]).map((s) => {
                    const cfg = STATUS_CONFIG[s];
                    return (
                      <button
                        key={s}
                        onClick={() => { updateTaskStatus(selectedTask.id, s); addToast({ type: 'success', message: `状态已更新` }); }}
                        style={{
                          padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                          fontSize: 12, fontWeight: 600,
                          background: selectedTask.status === s ? cfg.bg : 'var(--color-bg-elevated)',
                          color: selectedTask.status === s ? cfg.color : 'var(--color-text-secondary)',
                          outline: selectedTask.status === s ? `1px solid ${cfg.color}40` : 'none',
                        }}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 6 }}>标题</div>
                <p style={{ fontSize: 14, color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                  {language === 'zh' ? selectedTask.title : selectedTask.titleEn}
                </p>
              </div>

              {/* Meta */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>负责人</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>{selectedTask.assignee}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>截止日期</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>{selectedTask.dueDate}</div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 6 }}>描述</div>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {language === 'zh' ? selectedTask.description : selectedTask.descriptionEn}
                </p>
              </div>

              {/* Related excerpt */}
              <div>
                <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 6 }}>关联纪要</div>
                <div style={{
                  padding: '10px 12px', borderRadius: 8,
                  background: 'var(--color-accent-muted)',
                  border: '1px solid rgba(56,189,248,0.2)',
                  fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.55,
                  borderLeft: '3px solid var(--color-accent)',
                }}>
                  {language === 'zh' ? selectedTask.relatedMinutesExcerpt : selectedTask.relatedMinutesExcerptEn}
                </div>
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
                    来自：{selectedTask.sourceMeetingTitle}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
