import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Zap, Cloud, Wifi, Sun } from 'lucide-react'
import StatCard from '@/components/ui/StatCard'
import RoomTabs from '@/components/ui/RoomTabs'
import { DeviceGrid } from '@/components/device/DeviceCard'
import DeviceDetailDrawer from '@/components/device/DeviceDetailDrawer'
import { SceneGrid } from '@/components/scene/SceneCard'
import { useDeviceStore } from '@/store/DeviceStore'
import type { Device } from '@/types'

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } }
}

export default function HomePage() {
  const { state } = useDeviceStore()
  const [activeRoom, setActiveRoom] = useState('all')
  const [detailDevice, setDetailDevice] = useState<Device | null>(null)

  const onlineCount = state.devices.filter(d => d.isOnline).length
  const onCount = state.devices.filter(d => d.isOn).length
  const totalPower = state.devices.reduce((sum, d) => sum + (d.isOn ? d.powerConsumption : 0), 0)
  const activeScene = state.scenes.find(s => s.isActive)

  return (
    <div className="p-5 pb-6 max-w-4xl mx-auto lg:max-w-none">
      {/* Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mb-6"
      >
        <motion.div variants={itemVariants} className="flex items-start justify-between">
          <div>
            <p className="text-xs text-text-tertiary uppercase tracking-widest mb-1">晚上好</p>
            <h1 className="text-2xl font-bold text-text-primary" style={{ fontFamily: '"Space Grotesk"' }}>
              全屋中控
            </h1>
          </div>
          <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs text-text-secondary">系统正常</span>
          </div>
        </motion.div>

        {/* Weather/time bar */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Sun size={13} className="text-yellow-400" />
            <span>24°C</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Cloud size={13} className="text-text-tertiary" />
            <span>多云</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Wifi size={13} className="text-green-400" />
            <span>{onlineCount}/{state.devices.length} 在线</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3 mb-6 lg:grid-cols-4"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            label="在线设备"
            value={onlineCount}
            unit="台"
            subLabel={`共 ${state.devices.length} 台`}
            icon={<Wifi size={14} />}
            accentColor="#34D399"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="运行中"
            value={onCount}
            unit="台"
            subLabel="设备开启"
            icon={<Cpu size={14} />}
            accentColor="#4E9EFF"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="实时功耗"
            value={totalPower}
            unit="W"
            trend={-8}
            icon={<Zap size={14} />}
            accentColor="#FBBF24"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="今日用电"
            value={8.4}
            unit="kWh"
            trend={-12}
            decimals={1}
            icon={<Zap size={14} />}
            accentColor="#A78BFA"
          />
        </motion.div>
      </motion.div>

      {/* Current scene status */}
      {activeScene && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-2xl p-4"
          style={{
            background: `${activeScene.colorBg}`,
            border: `1px solid ${activeScene.colorPrimary}30`,
          }}
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: activeScene.colorPrimary }}
          />
          <span className="text-sm text-text-secondary">当前模式</span>
          <span className="text-sm font-semibold text-text-primary ml-1">{activeScene.name}</span>
          <span className="text-xs text-text-tertiary ml-auto">{activeScene.lastTriggered}</span>
        </motion.div>
      )}

      {/* Scenes section */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-widest mb-3">
          场景联动
        </h2>
        <SceneGrid />
      </motion.section>

      {/* Devices section */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-widest">
            设备控制
          </h2>
          <span className="text-xs text-text-tertiary">{onCount} 台运行中</span>
        </div>
        <div className="mb-3">
          <RoomTabs activeRoomId={activeRoom} onRoomChange={setActiveRoom} />
        </div>
        <DeviceGrid activeRoomId={activeRoom} onOpenDetail={setDetailDevice} />
      </motion.section>

      {/* Device detail drawer */}
      <DeviceDetailDrawer device={detailDevice} onClose={() => setDetailDevice(null)} />
    </div>
  )
}
