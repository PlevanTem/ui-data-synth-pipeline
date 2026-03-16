import { motion } from 'framer-motion'
import { Home, Lock, Moon, Film, Check, Loader2 } from 'lucide-react'
import type { Scene } from '@/types'
import { useDeviceStore } from '@/store/DeviceStore'
import { useUIStore } from '@/store/UIStore'

const SCENE_ICONS: Record<string, React.ReactNode> = {
  home: <Home size={22} />,
  away: <Lock size={22} />,
  sleep: <Moon size={22} />,
  cinema: <Film size={22} />,
}

interface SceneCardProps {
  scene: Scene
}

export default function SceneCard({ scene }: SceneCardProps) {
  const { triggerScene, state } = useDeviceStore()
  const addToast = useUIStore(s => s.addToast)

  const isExecuting = state.executingSceneId === scene.id

  const handleTrigger = () => {
    if (isExecuting || state.executingSceneId !== null) return
    triggerScene(scene.id)
    addToast({ type: 'loading', title: `正在切换到「${scene.name}」模式...` })
    setTimeout(() => {
      addToast({ type: 'success', title: `「${scene.name}」模式已启动` })
    }, scene.actions.length * 120 + 500)
  }

  return (
    <motion.div
      whileHover={!isExecuting ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isExecuting ? { scale: 0.97 } : {}}
      onClick={handleTrigger}
      className="relative cursor-pointer rounded-card p-4 transition-all duration-300 select-none overflow-hidden"
      style={{
        background: scene.isActive
          ? `${scene.colorBg}`
          : 'rgba(255,255,255,0.04)',
        border: scene.isActive
          ? `1px solid ${scene.colorPrimary}40`
          : '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Active left indicator */}
      {scene.isActive && (
        <div
          className="absolute left-0 top-4 bottom-4 w-0.5 rounded-r-full"
          style={{ background: scene.colorPrimary }}
        />
      )}

      {/* Executing ripple */}
      {isExecuting && (
        <motion.div
          className="absolute inset-0 rounded-card"
          animate={{ opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ background: `${scene.colorPrimary}15` }}
        />
      )}

      <div className="flex items-start justify-between">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
          style={{
            background: `${scene.colorPrimary}20`,
            color: scene.colorPrimary,
          }}
        >
          {isExecuting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            SCENE_ICONS[scene.id] || <Home size={20} />
          )}
        </div>

        {/* Active check */}
        {scene.isActive && !isExecuting && (
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: `${scene.colorPrimary}30` }}
          >
            <Check size={12} style={{ color: scene.colorPrimary }} />
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="text-sm font-semibold text-text-primary">{scene.name}</p>
        <p className="text-xs text-text-secondary mt-0.5">
          {isExecuting ? '正在执行...' : scene.isActive ? `上次：${scene.lastTriggered ?? '–'}` : `${scene.actions.length} 个设备`}
        </p>
      </div>
    </motion.div>
  )
}

export function SceneGrid() {
  const { state } = useDeviceStore()

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {state.scenes.map(scene => (
        <SceneCard key={scene.id} scene={scene} />
      ))}
    </div>
  )
}
