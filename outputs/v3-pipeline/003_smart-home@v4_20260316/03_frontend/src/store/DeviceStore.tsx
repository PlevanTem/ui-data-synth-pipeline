import React, { createContext, useContext, useReducer, useCallback } from 'react'
import type { Device, Scene, SceneId, DeviceControlParams } from '@/types'
import { DEVICES, INITIAL_SCENES } from './mockData'

interface DeviceState {
  devices: Device[]
  scenes: Scene[]
  executingSceneId: SceneId | null
  executingDeviceIds: Set<string>
}

type DeviceAction =
  | { type: 'TOGGLE_DEVICE'; deviceId: string }
  | { type: 'UPDATE_PARAMS'; deviceId: string; params: Partial<DeviceControlParams> }
  | { type: 'TRIGGER_SCENE_START'; sceneId: SceneId }
  | { type: 'UPDATE_DEVICE_FROM_SCENE'; deviceId: string; isOn: boolean; params?: Partial<DeviceControlParams> }
  | { type: 'TRIGGER_SCENE_COMPLETE'; sceneId: SceneId }
  | { type: 'SCENE_DEVICE_START'; deviceId: string }
  | { type: 'SCENE_DEVICE_DONE'; deviceId: string }

function deviceReducer(state: DeviceState, action: DeviceAction): DeviceState {
  switch (action.type) {
    case 'TOGGLE_DEVICE':
      return {
        ...state,
        devices: state.devices.map(d =>
          d.id === action.deviceId && d.isOnline
            ? { ...d, isOn: !d.isOn }
            : d
        )
      }
    case 'UPDATE_PARAMS':
      return {
        ...state,
        devices: state.devices.map(d =>
          d.id === action.deviceId
            ? { ...d, params: { ...d.params, ...action.params } }
            : d
        )
      }
    case 'TRIGGER_SCENE_START':
      return {
        ...state,
        executingSceneId: action.sceneId,
        scenes: state.scenes.map(s => ({ ...s, isActive: false }))
      }
    case 'UPDATE_DEVICE_FROM_SCENE':
      return {
        ...state,
        devices: state.devices.map(d =>
          d.id === action.deviceId
            ? {
                ...d,
                isOn: action.isOn,
                params: action.params ? { ...d.params, ...action.params } : d.params
              }
            : d
        )
      }
    case 'TRIGGER_SCENE_COMPLETE':
      return {
        ...state,
        executingSceneId: null,
        executingDeviceIds: new Set(),
        scenes: state.scenes.map(s =>
          s.id === action.sceneId
            ? { ...s, isActive: true, lastTriggered: '刚刚' }
            : s
        )
      }
    case 'SCENE_DEVICE_START':
      return {
        ...state,
        executingDeviceIds: new Set([...state.executingDeviceIds, action.deviceId])
      }
    case 'SCENE_DEVICE_DONE': {
      const next = new Set(state.executingDeviceIds)
      next.delete(action.deviceId)
      return { ...state, executingDeviceIds: next }
    }
    default:
      return state
  }
}

interface DeviceContextValue {
  state: DeviceState
  toggleDevice: (deviceId: string) => void
  updateParams: (deviceId: string, params: Partial<DeviceControlParams>) => void
  triggerScene: (sceneId: SceneId) => void
}

const DeviceContext = createContext<DeviceContextValue | null>(null)

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(deviceReducer, {
    devices: DEVICES,
    scenes: INITIAL_SCENES,
    executingSceneId: null,
    executingDeviceIds: new Set(),
  })

  const toggleDevice = useCallback((deviceId: string) => {
    dispatch({ type: 'TOGGLE_DEVICE', deviceId })
  }, [])

  const updateParams = useCallback((deviceId: string, params: Partial<DeviceControlParams>) => {
    dispatch({ type: 'UPDATE_PARAMS', deviceId, params })
  }, [])

  const triggerScene = useCallback((sceneId: SceneId) => {
    const scene = state.scenes.find(s => s.id === sceneId)
    if (!scene) return

    dispatch({ type: 'TRIGGER_SCENE_START', sceneId })

    scene.actions.forEach((action, index) => {
      const delay = index * 120

      setTimeout(() => {
        dispatch({ type: 'SCENE_DEVICE_START', deviceId: action.deviceId })
      }, delay)

      setTimeout(() => {
        dispatch({
          type: 'UPDATE_DEVICE_FROM_SCENE',
          deviceId: action.deviceId,
          isOn: action.targetState.isOn,
          params: action.targetState.params,
        })
        dispatch({ type: 'SCENE_DEVICE_DONE', deviceId: action.deviceId })
      }, delay + 300)
    })

    const totalDuration = scene.actions.length * 120 + 400
    setTimeout(() => {
      dispatch({ type: 'TRIGGER_SCENE_COMPLETE', sceneId })
    }, totalDuration)
  }, [state.scenes])

  return (
    <DeviceContext.Provider value={{ state, toggleDevice, updateParams, triggerScene }}>
      {children}
    </DeviceContext.Provider>
  )
}

export function useDeviceStore() {
  const ctx = useContext(DeviceContext)
  if (!ctx) throw new Error('useDeviceStore must be used within DeviceProvider')
  return ctx
}
