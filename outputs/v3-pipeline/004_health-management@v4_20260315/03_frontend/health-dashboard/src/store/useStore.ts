import { create } from 'zustand'

interface HealthData {
  heartRate: number
  sleepQuality: number // 0-100
  bloodOxygen: number
  steps: number
  history: {
    heartRate: number[]
    sleep: number[]
    oxygen: number[]
  }
}

interface AppState {
  isElderlyMode: boolean
  isSyncing: boolean
  lastSync: string | null
  healthData: HealthData
  toggleElderlyMode: () => void
  syncData: () => Promise<void>
}

// Mock initial data
const initialData: HealthData = {
  heartRate: 72,
  sleepQuality: 85,
  bloodOxygen: 98,
  steps: 6430,
  history: {
    heartRate: [68, 70, 75, 72, 80, 76, 72],
    sleep: [75, 80, 85, 90, 85, 82, 85],
    oxygen: [99, 98, 97, 98, 99, 98, 98]
  }
}

export const useStore = create<AppState>((set) => ({
  isElderlyMode: false,
  isSyncing: false,
  lastSync: new Date().toLocaleTimeString(),
  healthData: initialData,
  toggleElderlyMode: () => set((state) => ({ isElderlyMode: !state.isElderlyMode })),
  syncData: async () => {
    set({ isSyncing: true })
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 2000))
    set((state) => ({
      isSyncing: false,
      lastSync: new Date().toLocaleTimeString(),
      healthData: {
        ...state.healthData,
        heartRate: Math.floor(Math.random() * 10 + 70), // Randomize slightly on sync
      }
    }))
  }
}))
