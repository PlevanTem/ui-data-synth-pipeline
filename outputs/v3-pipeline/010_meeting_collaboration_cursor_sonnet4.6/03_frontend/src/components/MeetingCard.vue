<script setup lang="ts">
import type { Meeting } from '../types'

const props = defineProps<{
  meeting: Meeting
}>()

const emit = defineEmits<{
  (e: 'join', id: string): void
}>()

const formatStatus = (status: string) => {
  if (status === 'upcoming') return '即将开始'
  if (status === 'ongoing') return '进行中'
  return '已结束'
}
</script>

<template>
  <div class="meeting-card glass-panel hairline-border" :class="meeting.status">
    <div class="card-header">
      <span class="status-badge" :class="meeting.status">{{ formatStatus(meeting.status) }}</span>
      <span class="time">{{ meeting.time }}</span>
    </div>
    
    <h3 class="title">{{ meeting.title }}</h3>
    
    <div class="participants">
      <div v-for="(p, idx) in meeting.participants.slice(0,3)" :key="idx" class="avatar">
        {{ p.charAt(0) }}
      </div>
      <div v-if="meeting.participants.length > 3" class="avatar more">
        +{{ meeting.participants.length - 3 }}
      </div>
    </div>
    
    <button 
      v-if="meeting.status !== 'past'" 
      class="join-btn" 
      :class="{ 'ongoing-btn': meeting.status === 'ongoing' }"
      @click="emit('join', meeting.id)"
    >
      {{ meeting.status === 'ongoing' ? '一键入会' : '进入等候室' }}
    </button>
  </div>
</template>

<style scoped>
.meeting-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 350ms var(--fluid-ease);
  position: relative;
  overflow: hidden;
}

.meeting-card::before {
  content: '';
  position: absolute;
  top: 0; left: -100%; right: 0; bottom: 0;
  width: 50%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transform: skewX(-20deg);
  transition: left 0.7s ease;
}
.meeting-card:hover::before {
  left: 200%;
}

.meeting-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: var(--radius-pill);
  font-weight: 500;
}
.status-badge.ongoing {
  background-color: rgba(0, 196, 140, 0.1);
  color: var(--accent);
}
.status-badge.upcoming {
  background-color: rgba(59, 89, 152, 0.1);
  color: var(--primary);
}
.status-badge.past {
  background-color: rgba(141, 148, 158, 0.1);
  color: var(--text-muted);
}

.time {
  font-size: 14px;
  color: var(--text-muted);
}

.title {
  font-size: 18px;
  color: var(--text-main);
  line-height: 1.4;
}

.participants {
  display: flex;
  margin-top: auto;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border: 2px solid white;
  margin-left: -8px;
}
.avatar:first-child { margin-left: 0; }
.avatar.more {
  background: var(--text-muted);
}

.join-btn {
  margin-top: 8px;
  padding: 12px;
  border-radius: var(--radius-btn);
  font-size: 14px;
  font-weight: 600;
  background: rgba(59, 89, 152, 0.05);
  color: var(--primary);
}
.join-btn.ongoing-btn {
  background: var(--primary);
  color: white;
}
.join-btn:hover {
  filter: brightness(1.1);
}
</style>
