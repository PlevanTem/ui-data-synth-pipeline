import { motion } from 'framer-motion'
import { SceneGrid } from '@/components/scene/SceneCard'
import { useDeviceStore } from '@/store/DeviceStore'

export default function ScenesPage() {
  const { state } = useDeviceStore()
  const activeScene = state.scenes.find(s => s.isActive)

  return (
    <div className="p-5 pb-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-text-primary mb-1" style={{ fontFamily: '"Space Grotesk"' }}>
          场景联动
        </h1>
        <p className="text-sm text-text-secondary mb-6">
          {activeScene ? `当前模式：${activeScene.name}` : '选择一个场景快速切换生活模式'}
        </p>

        <SceneGrid />

        {/* Scene details */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-widest mb-4">场景说明</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {state.scenes.map(scene => (
              <div key={scene.id} className="glass rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                    style={{ background: `${scene.colorBg}`, color: scene.colorPrimary }}
                  >
                    {scene.actions.length}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{scene.name}模式</p>
                    <p className="text-xs text-text-tertiary">{scene.actions.length} 个设备联动</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {scene.actions.slice(0, 4).map((action) => {
                    const device = state.devices.find(d => d.id === action.deviceId)
                    if (!device) return null
                    return (
                      <span
                        key={action.deviceId}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          color: '#8B9BB4',
                        }}
                      >
                        {device.name} → {action.targetState.isOn ? '开' : '关'}
                      </span>
                    )
                  })}
                  {scene.actions.length > 4 && (
                    <span className="text-xs px-2 py-0.5 rounded-full text-text-tertiary"
                      style={{ background: 'rgba(255,255,255,0.04)' }}>
                      +{scene.actions.length - 4} 更多
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
