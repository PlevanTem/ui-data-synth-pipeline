<script setup lang="ts">
import { ref } from 'vue'
import LiveTranslationPanel from './LiveTranslationPanel.vue'

const emit = defineEmits<{
  (e: 'navigate', view: string): void
}>()

const isMicOn = ref(true)
const isCameraOn = ref(true)
const isAnnotationActive = ref(false)
const showTranslation = ref(true)

const toggleMic = () => isMicOn.value = !isMicOn.value
const toggleCamera = () => isCameraOn.value = !isCameraOn.value
const toggleAnnotation = () => isAnnotationActive.value = !isAnnotationActive.value
const toggleTranslation = () => showTranslation.value = !showTranslation.value

const endMeeting = () => {
  emit('navigate', 'summary')
}
</script>

<template>
  <div class="meeting-room-wrapper">
    <!-- 主会议区 -->
    <main class="main-stage" :class="{ 'with-sidebar': showTranslation && false }">
      <!-- 模拟视频流网格 -->
      <div class="video-grid">
        <div class="video-cell speaker glass-panel">
          <div class="video-placeholder">
            <span class="avatar">Alex (主讲人)</span>
          </div>
          <div v-if="isAnnotationActive" class="annotation-layer">
            <!-- 模拟画笔批注层 -->
            <svg class="drawing" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 10,50 Q 50,10 90,50" stroke="var(--accent)" stroke-width="2" fill="none" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        <div class="video-cell glass-panel"><div class="video-placeholder"><span class="avatar">Me</span></div></div>
        <div class="video-cell glass-panel"><div class="video-placeholder"><span class="avatar">Bob</span></div></div>
        <div class="video-cell glass-panel"><div class="video-placeholder"><span class="avatar">Charlie</span></div></div>
      </div>

      <!-- 底部控制栏 -->
      <footer class="control-bar glass-panel hairline-border">
        <div class="left-controls">
          <span class="meeting-time">00:45:12</span>
        </div>
        
        <div class="center-controls">
          <button class="circle-btn" :class="{ 'off': !isMicOn }" @click="toggleMic">
            {{ isMicOn ? '🎤' : '🔇' }}
          </button>
          <button class="circle-btn" :class="{ 'off': !isCameraOn }" @click="toggleCamera">
            {{ isCameraOn ? '📹' : '📵' }}
          </button>
          <button class="circle-btn" :class="{ 'active': isAnnotationActive }" @click="toggleAnnotation" title="批注">
            ✏️
          </button>
          <button class="circle-btn" :class="{ 'active': showTranslation }" @click="toggleTranslation" title="字幕">
            💬
          </button>
        </div>

        <div class="right-controls">
          <button class="end-btn" @click="endMeeting">结束会议</button>
        </div>
      </footer>
    </main>

    <!-- 翻译面板悬浮或侧边栏 -->
    <Transition name="slide-fade">
      <LiveTranslationPanel v-if="showTranslation" :active="showTranslation" />
    </Transition>
  </div>
</template>

<style scoped>
.meeting-room-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: #0d1117; /* 深色沉浸背景 */
  overflow: hidden;
  position: relative;
}

.main-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 24px;
  transition: all 0.5s var(--fluid-ease);
}

.video-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 2fr 1fr;
  gap: 16px;
}

.video-cell {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-cell.speaker {
  grid-column: 1 / span 3;
  grid-row: 1 / 2;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.video-placeholder {
  color: rgba(255,255,255,0.5);
  font-size: 18px;
}

.annotation-layer {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
  z-index: 10;
}
.drawing {
  width: 100%; height: 100%;
}
.drawing path {
  animation: draw 2s ease forwards;
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}

.control-bar {
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(30, 30, 30, 0.6);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-radius: 24px;
}

.meeting-time {
  color: white;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

.center-controls {
  display: flex;
  gap: 16px;
}

.circle-btn {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.circle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
.circle-btn.off {
  background: rgba(255, 82, 82, 0.2);
  color: #ff5252;
}
.circle-btn.active {
  background: rgba(59, 89, 152, 0.4);
  border: 1px solid var(--primary);
}

.end-btn {
  padding: 12px 24px;
  border-radius: 24px;
  background: #ff5252;
  color: white;
  font-weight: 600;
}
.end-btn:hover {
  background: #ff3333;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s var(--fluid-ease);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

@media (max-width: 768px) {
  .video-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }
  .video-cell.speaker {
    grid-column: 1 / span 2;
  }
  .center-controls {
    gap: 8px;
  }
  .circle-btn {
    width: 48px; height: 48px;
  }
}
</style>
