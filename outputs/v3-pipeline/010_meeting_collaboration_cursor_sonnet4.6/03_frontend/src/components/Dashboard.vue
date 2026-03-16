<script setup lang="ts">
import { ref } from 'vue'
import MeetingCard from './MeetingCard.vue'
import type { Meeting } from '../types'

const emit = defineEmits<{
  (e: 'navigate', view: string, payload?: any): void
}>()

const meetings = ref<Meeting[]>([
  {
    id: 'm1',
    title: '2026 Q2 亚太区产品规划对齐会',
    time: '14:00 - 15:30 (今天)',
    status: 'ongoing',
    participants: ['Alice', 'Bob', 'Charlie', 'David', 'Eve']
  },
  {
    id: 'm2',
    title: '研发周报同步',
    time: '16:00 - 17:00 (今天)',
    status: 'upcoming',
    participants: ['Frank', 'Grace']
  },
  {
    id: 'm3',
    title: '设计规范 Review',
    time: '10:00 - 11:30 (昨天)',
    status: 'past',
    participants: ['Heidi', 'Frank', 'Alice']
  }
])

const handleJoin = (id: string) => {
  emit('navigate', 'meeting', { meetingId: id })
}
</script>

<template>
  <div class="dashboard container">
    <header class="top-nav">
      <div class="user-info">
        <div class="avatar-large">M</div>
        <h2>上午好，Master</h2>
      </div>
      <div class="quick-actions">
        <button class="icon-btn" title="扫码投屏">📱 投屏</button>
        <button class="primary-btn">发起会议</button>
      </div>
    </header>

    <main class="content-area">
      <section class="agenda">
        <div class="section-header">
          <h3>我的日程</h3>
          <button class="text-btn">查看日历</button>
        </div>
        
        <div class="cards-grid">
          <TransitionGroup name="list">
            <MeetingCard 
              v-for="meet in meetings" 
              :key="meet.id" 
              :meeting="meet" 
              @join="handleJoin"
            />
          </TransitionGroup>
        </div>
      </section>
      
      <aside class="quick-tasks glass-panel hairline-border">
        <h3>未尽待办</h3>
        <ul class="task-list">
          <li class="task-item">更新产品白皮书草案</li>
          <li class="task-item">确认 Q2 预算规划</li>
          <li class="task-item">Review 鸿蒙适配文档</li>
        </ul>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}
.avatar-large {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
}
h2 {
  font-size: 24px;
}

.quick-actions {
  display: flex;
  gap: 16px;
}
.icon-btn {
  padding: 10px 16px;
  border-radius: var(--radius-btn);
  background: white;
  color: var(--text-main);
  box-shadow: var(--shadow-soft);
}
.primary-btn {
  padding: 10px 24px;
  border-radius: var(--radius-btn);
  background: var(--primary);
  color: white;
}

.content-area {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.text-btn {
  background: transparent;
  color: var(--primary);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.quick-tasks {
  padding: 32px 24px;
  align-self: start;
}
.quick-tasks h3 {
  margin-bottom: 24px;
}
.task-list {
  list-style: none;
  padding: 0; margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.task-item {
  padding: 12px;
  background: rgba(255,255,255, 0.4);
  border-radius: 8px;
  font-size: 14px;
  position: relative;
  padding-left: 32px;
}
.task-item::before {
  content: '○';
  position: absolute;
  left: 12px;
  color: var(--text-muted);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@media (max-width: 768px) {
  .content-area {
    grid-template-columns: 1fr;
  }
}
</style>
