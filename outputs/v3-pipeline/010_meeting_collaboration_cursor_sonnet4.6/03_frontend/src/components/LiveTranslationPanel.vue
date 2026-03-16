<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  active: boolean
}>()

const sentences = ref<{ id: number, text: string, lang: string }[]>([
  { id: 1, text: "Okay everyone, let's get started on the Q2 planning.", lang: "en" },
  { id: 2, text: "好的，大家，我们开始 Q2 的规划吧。", lang: "zh" }
])

const isFloating = ref(true)

// Mock incoming captions
onMounted(() => {
  let count = 3
  setInterval(() => {
    if (!props.active) return
    const newEn = `Discussion point ${count}...`
    const newZh = `讨论要点 ${count}...`
    sentences.value.push({ id: count * 10, text: newEn, lang: 'en' })
    sentences.value.push({ id: count * 10 + 1, text: newZh, lang: 'zh' })
    count++
    
    // keeping array small for performance visualization
    if (sentences.value.length > 8) {
      sentences.value.splice(0, 2)
    }
  }, 4000)
})

const toggleDock = () => {
  isFloating.value = !isFloating.value
}
</script>

<template>
  <div 
    class="translation-panel glass-panel hairline-border"
    :class="{ 'floating': isFloating, 'docked': !isFloating }"
  >
    <div class="panel-header">
      <div class="title">
        <span class="live-dot"></span>
        <span>实时双语字幕</span>
      </div>
      <button class="icon-btn" @click="toggleDock" title="切换停靠模式">⇱</button>
    </div>
    
    <div class="captions-container">
      <TransitionGroup name="fade-up">
        <div v-for="item in sentences" :key="item.id" class="caption-item">
          <span class="lang-tag" :class="item.lang">{{ item.lang.toUpperCase() }}</span>
          <p>{{ item.text }}</p>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.translation-panel {
  display: flex;
  flex-direction: column;
  transition: all 0.5s var(--fluid-ease);
  overflow: hidden;
}

.floating {
  position: absolute;
  right: 24px;
  top: 24px;
  width: 320px;
  max-height: 400px;
  z-index: 100;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.docked {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 0;
  border: none;
  border-left: 1px solid rgba(0, 0, 0, 0.05);
}

.panel-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.live-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: red;
  animation: pulse 1.5s infinite;
}

.icon-btn {
  background: transparent;
  color: var(--text-muted);
  font-size: 16px;
  padding: 4px;
}

.captions-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  flex: 1;
}

.caption-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.lang-tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}
.lang-tag.en { background: rgba(59, 89, 152, 0.1); color: var(--primary); }
.lang-tag.zh { background: rgba(0, 196, 140, 0.1); color: var(--accent); }

.caption-item p {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-main);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.4s var(--fluid-ease);
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
