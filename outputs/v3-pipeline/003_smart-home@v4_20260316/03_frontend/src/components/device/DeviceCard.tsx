import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Power, Minus, Plus, ChevronRight, WifiOff,
  Lightbulb, Wind, Camera, Tv, AlignJustify, Microwave, Lock
} from 'lucide-react'
import type { Device } from '@/types'
import { useDeviceStore } from '@/store/DeviceStore'
import { useUIStore } from '@/store/UIStore'

const TYPE_ICON_MAP: Record<string, React.ReactNode> = {
  lighting: <Lightbulb size={22} />,
  climate: <Wind size={22} />,
  security: <Camera size={22} />,
  entertainment: <Tv size={22} />,
  curtain: <AlignJustify size={22} />,
  appliance: <Microwave size={22} />,
}

const LOCK_ICON = <Lock size={22} />

const GLOW_CLASSES: Record<string, string> = {
  lighting: 'device-glow-light',
  climate: 'device-glow-climate',
  security: 'device-glow-security',
  entertainment: 'device-glow-entertainment',
  curtain: 'device-glow-appliance',
  appliance: 'device-glow-appliance',
}

const ACTIVE_COLORS: Record<string, string> = {
  lighting: '#FFD700',
  climate: '#60A5FA',
  security: '#34D399',
  entertainment: '#A78BFA',
  curtain: '#FB923C',
  appliance: '#FB923C',
}

interface DeviceCardProps {
  device: Device
  isExecuting?: boolean
  onOpenDetail?: (device: Device) => void
}

export default function DeviceCard({ device, isExecuting, onOpenDetail }: DeviceCardProps) {
  const { toggleDevice, updateParams } = useDeviceStore()
  const addToast = useUIStore(s => s.addToast)

  const activeColor = ACTIVE_COLORS[device.type]
  const glowClass = device.isOn ? GLOW_CLASSES[device.type] : ''

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!device.isOnline) {
      addToast({ type: 'error', title: `${device.name}已离线`, message: '设备当前不在线，无法控制' })
      return
    }
    toggleDevice(device.id)
    addToast({
      type: 'success',
      title: device.isOn ? `${device.name}已关闭` : `${device.name}已开启`,
    })
  }

  const iconEl = device.name.includes('门锁') ? LOCK_ICON : (TYPE_ICON_MAP[device.type] || <Power size={22} />)

  return (
    <motion.div
      layout
      whileHover={device.isOnline ? { scale: 1.02 } : {}}
      whileTap={device.isOnline ? { scale: 0.98 } : {}}
      onClick={() => device.isOnline && onOpenDetail?.(device)}
      className={`
        glass rounded-card p-4 cursor-pointer select-none relative overflow-hidden
        transition-all duration-300
        ${glowClass}
        ${!device.isOnline ? 'opacity-50' : ''}
        ${isExecuting ? 'animate-pulse' : ''}
      `}
      style={{
        background: device.isOn
          ? `radial-gradient(circle at 20% 20%, ${activeColor}18 0%, rgba(22,25,33,0.8) 60%), rgba(255,255,255,0.06)`
          : 'rgba(255,255,255,0.04)',
        border: device.isOn
          ? `1px solid ${activeColor}40`
          : device.isOnline ? '1px solid rgba(255,255,255,0.08)' : '1px dashed rgba(255,255,255,0.15)',
      }}
    >
      {/* Offline badge */}
      {!device.isOnline && (
        <span className="absolute top-2 right-2 flex items-center gap-1 text-xs text-text-tertiary">
          <WifiOff size={11} />
          <span>离线</span>
        </span>
      )}

      {/* Device icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-300"
        style={{
          background: device.isOn
            ? `${activeColor}22`
            : 'rgba(255,255,255,0.06)',
          color: device.isOn ? activeColor : '#4A5568',
        }}
      >
        {iconEl}
      </div>

      {/* Name */}
      <div className="mb-1">
        <p className="text-sm font-medium text-text-primary leading-tight truncate">{device.name}</p>
        <p className="text-xs text-text-tertiary mt-0.5">
          {device.isOn
            ? getDeviceStatus(device)
            : '已关闭'}
        </p>
      </div>

      {/* In-card slider for lighting brightness */}
      {device.type === 'lighting' && device.isOn && device.isOnline && (
        <div className="mt-3" onClick={e => e.stopPropagation()}>
          <input
            type="range"
            min={1}
            max={100}
            value={device.params.brightness ?? 80}
            onChange={e => updateParams(device.id, { brightness: Number(e.target.value) })}
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${activeColor} 0%, ${activeColor} ${device.params.brightness ?? 80}%, rgba(255,255,255,0.1) ${device.params.brightness ?? 80}%, rgba(255,255,255,0.1) 100%)`,
              outline: 'none',
            }}
          />
          <div className="flex justify-between text-xs text-text-tertiary mt-1">
            <span>亮度</span>
            <span className="tabular-nums">{device.params.brightness ?? 80}%</span>
          </div>
        </div>
      )}

      {/* Climate temperature controls */}
      {device.type === 'climate' && device.isOn && device.isOnline && (
        <div className="mt-3 flex items-center justify-between" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => updateParams(device.id, { temperature: Math.max(16, (device.params.temperature ?? 26) - 1) })}
            className="w-7 h-7 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Minus size={12} className="text-text-secondary" />
          </button>
          <span className="text-sm font-semibold tabular-nums" style={{ color: activeColor }}>
            {device.params.temperature ?? 26}°C
          </span>
          <button
            onClick={() => updateParams(device.id, { temperature: Math.min(32, (device.params.temperature ?? 26) + 1) })}
            className="w-7 h-7 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Plus size={12} className="text-text-secondary" />
          </button>
        </div>
      )}

      {/* Power toggle + detail arrow */}
      <div className="mt-3 flex items-center justify-between" onClick={e => e.stopPropagation()}>
        <button
          onClick={handleToggle}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
            ${device.isOn
              ? 'text-white'
              : 'text-text-secondary hover:text-text-primary'}
          `}
          style={{
            background: device.isOn ? `${activeColor}30` : 'rgba(255,255,255,0.06)',
            border: device.isOn ? `1px solid ${activeColor}50` : '1px solid rgba(255,255,255,0.08)',
          }}
          disabled={!device.isOnline}
        >
          <Power size={11} />
          {device.isOn ? '开启' : '关闭'}
        </button>

        <ChevronRight size={14} className="text-text-tertiary" />
      </div>
    </motion.div>
  )
}

function getDeviceStatus(device: Device): string {
  switch (device.type) {
    case 'lighting': return `亮度 ${device.params.brightness ?? 80}%`
    case 'climate': return `${device.params.temperature ?? 26}°C · ${device.params.mode ?? '制冷'}`
    case 'security': return device.params.isRecording ? '录制中' : '监控中'
    case 'entertainment': return `音量 ${device.params.volume ?? 30}`
    case 'curtain': return `开合 ${device.params.position ?? 50}%`
    case 'appliance': return device.params.mode ?? '运行中'
    default: return '运行中'
  }
}

interface DeviceGridProps {
  activeRoomId: string
  onOpenDetail: (device: Device) => void
}

export function DeviceGrid({ activeRoomId, onOpenDetail }: DeviceGridProps) {
  const { state } = useDeviceStore()

  const filtered = activeRoomId === 'all'
    ? state.devices
    : state.devices.filter(d => d.roomId === activeRoomId)

  return (
    <motion.div
      layout
      className="grid grid-cols-2 gap-3 lg:grid-cols-3"
    >
      {filtered.map((device) => (
        <DeviceCard
          key={device.id}
          device={device}
          isExecuting={state.executingDeviceIds.has(device.id)}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </motion.div>
  )
}
