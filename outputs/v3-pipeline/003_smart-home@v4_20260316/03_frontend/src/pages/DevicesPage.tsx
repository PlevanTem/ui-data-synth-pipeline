import { useState } from 'react'
import { motion } from 'framer-motion'
import RoomTabs from '@/components/ui/RoomTabs'
import { DeviceGrid } from '@/components/device/DeviceCard'
import DeviceDetailDrawer from '@/components/device/DeviceDetailDrawer'
import type { Device } from '@/types'

export default function DevicesPage() {
  const [activeRoom, setActiveRoom] = useState('all')
  const [detailDevice, setDetailDevice] = useState<Device | null>(null)

  return (
    <div className="p-5 pb-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-text-primary mb-1" style={{ fontFamily: '"Space Grotesk"' }}>
          设备管理
        </h1>
        <p className="text-sm text-text-secondary mb-6">管理并控制所有鸿蒙智联设备</p>

        <div className="mb-4">
          <RoomTabs activeRoomId={activeRoom} onRoomChange={setActiveRoom} />
        </div>

        <DeviceGrid activeRoomId={activeRoom} onOpenDetail={setDetailDevice} />
      </motion.div>

      <DeviceDetailDrawer device={detailDevice} onClose={() => setDetailDevice(null)} />
    </div>
  )
}
