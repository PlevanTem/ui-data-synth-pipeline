export type DeviceType = 'lighting' | 'climate' | 'security' | 'entertainment' | 'curtain' | 'appliance'

export interface DeviceControlParams {
  brightness?: number      // 0-100 for lighting
  temperature?: number     // 16-32 for climate
  mode?: string            // climate mode, appliance mode
  volume?: number          // 0-100 for entertainment
  position?: number        // 0-100 for curtain
  isRecording?: boolean    // for security cameras
}

export interface Device {
  id: string
  name: string
  type: DeviceType
  roomId: string
  isOn: boolean
  isOnline: boolean
  powerConsumption: number // watts
  lastSeen: string
  params: DeviceControlParams
  icon: string
}

export interface Room {
  id: string
  name: string
  icon: string
  description: string
}

export type SceneId = 'home' | 'away' | 'sleep' | 'cinema' | 'custom'

export interface SceneAction {
  deviceId: string
  targetState: {
    isOn: boolean
    params?: Partial<DeviceControlParams>
  }
}

export interface Scene {
  id: SceneId
  name: string
  icon: string
  colorPrimary: string
  colorBg: string
  actions: SceneAction[]
  isActive: boolean
  lastTriggered?: string
}

export interface EnergyDataPoint {
  label: string
  kwh: number
  cost: number
}

export interface DeviceEnergy {
  deviceId: string
  deviceName: string
  type: DeviceType
  kwh: number
  percentage: number
  trend: number // percentage change vs last period
}

export interface EnergyStats {
  totalKwh: number
  totalCost: number
  comparedToLast: number // percentage
  topDevices: DeviceEnergy[]
  dailyData: EnergyDataPoint[]
  weeklyData: EnergyDataPoint[]
  monthlyData: EnergyDataPoint[]
}

export type EnergyPeriod = 'daily' | 'weekly' | 'monthly'

export interface ToastItem {
  id: string
  type: 'success' | 'error' | 'info' | 'loading'
  title: string
  message?: string
}

export type VoiceState = 'idle' | 'listening' | 'processing' | 'success' | 'error'

export interface VoiceResult {
  transcript: string
  intent?: string
  action?: string
  success: boolean
  errorMessage?: string
}

export type NavTab = 'home' | 'devices' | 'scenes' | 'energy' | 'settings'
