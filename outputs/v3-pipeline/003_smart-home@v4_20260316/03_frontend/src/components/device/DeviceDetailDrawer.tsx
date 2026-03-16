import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Power, Minus, Plus, Zap, Clock,
  Lightbulb, Wind, Camera, Tv, AlignJustify, Microwave, Lock, WifiOff
} from 'lucide-react'
import type { Device } from '@/types'
import { useDeviceStore } from '@/store/DeviceStore'
import { useUIStore } from '@/store/UIStore'

const TYPE_ICONS: Record<string, React.ReactNode> = {
  lighting: <Lightbulb size={32} />,
  climate: <Wind size={32} />,
  security: <Camera size={32} />,
  entertainment: <Tv size={32} />,
  curtain: <AlignJustify size={32} />,
  appliance: <Microwave size={32} />,
  lock: <Lock size={32} />,
}

const ACTIVE_COLORS: Record<string, string> = {
  lighting: '#FFD700',
  climate: '#60A5FA',
  security: '#34D399',
  entertainment: '#A78BFA',
  curtain: '#FB923C',
  appliance: '#FB923C',
}

interface DeviceDetailDrawerProps {
  device: Device | null
  onClose: () => void
}

export default function DeviceDetailDrawer({ device, onClose }: DeviceDetailDrawerProps) {
  const { toggleDevice, updateParams } = useDeviceStore()
  const addToast = useUIStore(s => s.addToast)

  if (!device) return null

  const activeColor = ACTIVE_COLORS[device.type] ?? '#4E9EFF'
  const iconEl = device.name.includes('门锁') ? TYPE_ICONS.lock : (TYPE_ICONS[device.type] || <Power size={32} />)

  const handleToggle = () => {
    if (!device.isOnline) return
    toggleDevice(device.id)
    addToast({
      type: 'success',
      title: device.isOn ? `${device.name}已关闭` : `${device.name}已开启`,
    })
  }

  return (
    <AnimatePresence>
      {device && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full z-50 w-80 flex flex-col"
            style={{
              background: 'rgba(18, 20, 28, 0.97)',
              backdropFilter: 'blur(24px)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4">
              <h2 className="text-lg font-semibold text-text-primary">设备详情</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X size={16} className="text-text-secondary" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {/* Device hero */}
              <div
                className="rounded-2xl p-6 flex flex-col items-center gap-3 mb-6"
                style={{
                  background: device.isOn
                    ? `radial-gradient(circle, ${activeColor}22 0%, rgba(22,25,33,0.8) 70%)`
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${device.isOn ? activeColor + '30' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: device.isOn ? `${activeColor}25` : 'rgba(255,255,255,0.06)',
                    color: device.isOn ? activeColor : '#4A5568',
                    boxShadow: device.isOn ? `0 0 24px ${activeColor}40` : 'none',
                  }}
                >
                  {iconEl}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-text-primary">{device.name}</h3>
                  <div className="flex items-center gap-1.5 justify-center mt-1">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: device.isOnline ? '#34D399' : '#4A5568' }}
                    />
                    <span className="text-xs text-text-secondary">
                      {device.isOnline ? '在线' : '离线'} · {device.lastSeen}
                    </span>
                    {!device.isOnline && <WifiOff size={11} className="text-text-tertiary" />}
                  </div>
                </div>
              </div>

              {/* Power control */}
              <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">电源</span>
                  <button
                    onClick={handleToggle}
                    disabled={!device.isOnline}
                    className="relative w-12 h-6 rounded-full transition-all duration-300 disabled:opacity-40"
                    style={{
                      background: device.isOn ? activeColor : 'rgba(255,255,255,0.12)',
                    }}
                  >
                    <motion.div
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
                      animate={{ left: device.isOn ? '26px' : '2px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>

              {/* Type-specific controls */}
              {device.type === 'lighting' && device.isOn && (
                <div className="glass rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-text-secondary">亮度</span>
                    <span className="text-sm font-semibold tabular-nums" style={{ color: activeColor }}>
                      {device.params.brightness ?? 80}%
                    </span>
                  </div>
                  <input
                    type="range" min={1} max={100}
                    value={device.params.brightness ?? 80}
                    onChange={e => updateParams(device.id, { brightness: Number(e.target.value) })}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${activeColor} 0%, ${activeColor} ${device.params.brightness ?? 80}%, rgba(255,255,255,0.1) ${device.params.brightness ?? 80}%, rgba(255,255,255,0.1) 100%)`,
                    }}
                  />
                </div>
              )}

              {device.type === 'climate' && device.isOn && (
                <div className="glass rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-text-secondary">温度</span>
                    <span className="text-xl font-bold tabular-nums" style={{ color: activeColor }}>
                      {device.params.temperature ?? 26}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => updateParams(device.id, { temperature: Math.max(16, (device.params.temperature ?? 26) - 1) })}
                      className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <Minus size={16} className="text-text-secondary" />
                    </button>
                    <div className="flex gap-2">
                      {['制冷', '制热', '送风', '除湿'].map(m => (
                        <button
                          key={m}
                          onClick={() => updateParams(device.id, { mode: m })}
                          className="text-xs px-2 py-1 rounded-lg transition-all duration-150"
                          style={{
                            background: device.params.mode === m ? `${activeColor}25` : 'rgba(255,255,255,0.06)',
                            color: device.params.mode === m ? activeColor : '#8B9BB4',
                            border: device.params.mode === m ? `1px solid ${activeColor}40` : '1px solid transparent',
                          }}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => updateParams(device.id, { temperature: Math.min(32, (device.params.temperature ?? 26) + 1) })}
                      className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <Plus size={16} className="text-text-secondary" />
                    </button>
                  </div>
                </div>
              )}

              {device.type === 'entertainment' && device.isOn && (
                <div className="glass rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-text-secondary">音量</span>
                    <span className="text-sm font-semibold tabular-nums" style={{ color: activeColor }}>
                      {device.params.volume ?? 30}
                    </span>
                  </div>
                  <input
                    type="range" min={0} max={100}
                    value={device.params.volume ?? 30}
                    onChange={e => updateParams(device.id, { volume: Number(e.target.value) })}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${activeColor} 0%, ${activeColor} ${device.params.volume ?? 30}%, rgba(255,255,255,0.1) ${device.params.volume ?? 30}%, rgba(255,255,255,0.1) 100%)`,
                    }}
                  />
                </div>
              )}

              {device.type === 'curtain' && (
                <div className="glass rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-text-secondary">开合度</span>
                    <span className="text-sm font-semibold tabular-nums" style={{ color: activeColor }}>
                      {device.params.position ?? 50}%
                    </span>
                  </div>
                  <input
                    type="range" min={0} max={100}
                    value={device.params.position ?? 50}
                    onChange={e => updateParams(device.id, { position: Number(e.target.value) })}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${activeColor} 0%, ${activeColor} ${device.params.position ?? 50}%, rgba(255,255,255,0.1) ${device.params.position ?? 50}%, rgba(255,255,255,0.1) 100%)`,
                    }}
                  />
                </div>
              )}

              {/* Power consumption */}
              <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-yellow-400" />
                  <span className="text-sm text-text-secondary">实时功耗</span>
                </div>
                <span className="text-2xl font-bold tabular-nums text-text-primary">
                  {device.isOn ? device.powerConsumption : 0}
                  <span className="text-sm font-normal text-text-secondary ml-1">W</span>
                </span>
              </div>

              {/* Last seen */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-text-tertiary" />
                  <span className="text-sm text-text-secondary">最近活跃</span>
                  <span className="text-sm text-text-primary ml-auto">{device.lastSeen}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
