<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '../types'

const emit = defineEmits<{
  (e: 'navigate', view: string): void
}>()

const summaryText = ref(`本次亚太区产品规划对齐会已圆满结束。\n核心决议：\n1. Q2 的主推点为鸿蒙生态下的流体协作功能。\n2. 会议产品优先适配新一代可穿戴和智慧屏设备。\n3. 所有涉及敏感数据传输的模块本周内完成本地加解密审核。`)

const tasks = ref<Task[]>([
  { id: 't1', title: '输出流体协作 PRD v1.0', assignee: 'Alice', completed: false },
  { id: 't2', title: '智慧屏原型设计', assignee: 'Bob', completed: false },
  { id: 't3', title: '加密规范安全自查报告', assignee: 'Charlie', completed: false },
])

const toggleTask = (id: string) => {
  const task = tasks.value.find(t => t.id === id)
  if (task) task.completed = !task.completed
}
</script>

<template>
  <div class="summary-view container">
    <header class="header">
      <button class="back-btn" @click="emit('navigate', 'dashboard')">← 返回首页</button>
      <h2>智能纪要：2026 Q2 亚太区产品规划对齐会</h2>
    </header>

    <main class="grid-layout">
      <!-- AI 总结核心区块 -->
      <section class="ai-summary glass-panel hairline-border">
        <div class="title-with-icon">
          <span class="sparkle">✨</span>
          <h3>AI 结论提取</h3>
        </div>
        <div class="content">
          <p v-for="(paragraph, index) in summaryText.split('\n')" :key="index">
            {{ paragraph }}
          </p>
        </div>
        
        <div class="actions">
          <button class="primary-btn">一键分享至群组</button>
          <button class="secondary-btn">导出完整文档</button>
        </div>
      </section>

      <!-- 智能分发的待办 -->
      <aside class="task-dist glass-panel hairline-border">
        <h3>智能识别的任务分布</h3>
        <ul class="task-list">
          <li v-for="task in tasks" :key="task.id" class="task-item" :class="{ completed: task.completed }">
            <label class="checkbox-container">
              <input type="checkbox" :checked="task.completed" @change="toggleTask(task.id)" />
              <span class="checkmark"></span>
            </label>
            <div class="task-content">
              <span class="task-title">{{ task.title }}</span>
              <span class="assignee">@{{ task.assignee }}</span>
            </div>
          </li>
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

.header {
  margin-bottom: 32px;
}
.back-btn {
  background: transparent;
  color: var(--text-muted);
  margin-bottom: 12px;
  font-size: 14px;
}
.back-btn:hover {
  color: var(--primary);
}

.grid-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
}

.ai-summary {
  padding: 40px;
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.sparkle {
  font-size: 24px;
  animation: pulse 2s infinite alternate;
}
@keyframes pulse {
  from { opacity: 0.6; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1.1); }
}

.content p {
  line-height: 1.8;
  margin-bottom: 16px;
  color: var(--text-main);
  font-size: 16px;
}

.actions {
  margin-top: 40px;
  display: flex;
  gap: 16px;
}
.primary-btn {
  padding: 12px 24px;
  border-radius: var(--radius-btn);
  background: var(--primary);
  color: white;
}
.secondary-btn {
  padding: 12px 24px;
  border-radius: var(--radius-btn);
  background: rgba(59, 89, 152, 0.05);
  color: var(--primary);
}

.task-dist {
  padding: 32px;
}
.task-dist h3 {
  margin-bottom: 24px;
}

.task-list {
  list-style: none; padding: 0; margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  transition: all 0.3s ease;
}
.task-item.completed {
  opacity: 0.6;
}
.task-item.completed .task-title {
  text-decoration: line-through;
}

.checkbox-container {
  display: block;
  position: relative;
  cursor: pointer;
  width: 20px; height: 20px;
}
.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0; width: 0;
}
.checkmark {
  position: absolute;
  top: 0; left: 0;
  height: 20px; width: 20px;
  background-color: #e0e0e0;
  border-radius: 4px;
}
.checkbox-container input:checked ~ .checkmark {
  background-color: var(--accent);
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.task-title {
  font-size: 14px;
  font-weight: 500;
}
.assignee {
  font-size: 12px;
  color: var(--primary);
}

@media (max-width: 768px) {
  .grid-layout { grid-template-columns: 1fr; }
}
</style>
