<script setup lang="ts">
import { ref } from 'vue'
import Dashboard from './components/Dashboard.vue'
import MeetingRoom from './components/MeetingRoom.vue'
import SmartSummary from './components/SmartSummary.vue'

type ViewState = 'dashboard' | 'meeting' | 'summary'

const currentView = ref<ViewState>('dashboard')

const navigateTo = (view: string, payload?: any) => {
  currentView.value = view as ViewState
  if (payload) {
    console.log('Navigated with payload:', payload)
  }
}
</script>

<template>
  <div class="app-shell">
    <Transition name="fade" mode="out-in">
      <Dashboard 
        v-if="currentView === 'dashboard'" 
        @navigate="navigateTo" 
      />
      
      <MeetingRoom 
        v-else-if="currentView === 'meeting'" 
        @navigate="navigateTo" 
      />
      
      <SmartSummary 
        v-else-if="currentView === 'summary'" 
        @navigate="navigateTo" 
      />
    </Transition>
  </div>
</template>

<style>
.app-shell {
  min-height: 100vh;
  width: 100vw;
  position: relative;
}
</style>
