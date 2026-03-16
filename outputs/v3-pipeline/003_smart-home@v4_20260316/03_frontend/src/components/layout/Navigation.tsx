import { motion } from 'framer-motion'
import { LayoutGrid, Cpu, Zap, Settings, Home } from 'lucide-react'
import VoiceButton from '@/components/voice/VoiceButton'
import { useUIStore } from '@/store/UIStore'
import type { NavTab } from '@/types'

const NAV_ITEMS: { id: NavTab; icon: React.ReactNode; label: string }[] = [
  { id: 'home', icon: <Home size={20} />, label: '主页' },
  { id: 'devices', icon: <Cpu size={20} />, label: '设备' },
  { id: 'scenes', icon: <Zap size={20} />, label: '场景' },
  { id: 'energy', icon: <LayoutGrid size={20} />, label: '能耗' },
  { id: 'settings', icon: <Settings size={20} />, label: '设置' },
]

export function BottomNav() {
  const { activeTab, setActiveTab } = useUIStore()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around px-4 pb-safe"
      style={{
        background: 'rgba(13,15,20,0.92)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        paddingTop: '8px',
      }}
    >
      {NAV_ITEMS.slice(0, 2).map(item => (
        <NavBtn key={item.id} item={item} activeTab={activeTab} onSelect={setActiveTab} />
      ))}

      {/* Voice FAB center */}
      <div className="relative -mt-6">
        <VoiceButton />
      </div>

      {NAV_ITEMS.slice(2, 4).map(item => (
        <NavBtn key={item.id} item={item} activeTab={activeTab} onSelect={setActiveTab} />
      ))}
    </nav>
  )
}

function NavBtn({
  item,
  activeTab,
  onSelect,
}: {
  item: { id: NavTab; icon: React.ReactNode; label: string }
  activeTab: NavTab
  onSelect: (t: NavTab) => void
}) {
  const isActive = item.id === activeTab
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => onSelect(item.id)}
      className="flex flex-col items-center gap-1 min-w-[48px] transition-all duration-150"
      style={{ color: isActive ? '#4E9EFF' : '#4A5568' }}
    >
      {item.icon}
      <span className="text-xs font-medium">{item.label}</span>
    </motion.button>
  )
}

export function SideNav() {
  const { activeTab, setActiveTab } = useUIStore()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.nav
      animate={{ width: collapsed ? 72 : 220 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex-shrink-0 h-full flex flex-col py-6 overflow-hidden"
      style={{
        background: 'rgba(13,15,20,0.80)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 mb-8 ${collapsed ? 'justify-center' : ''}`}>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #4E9EFF 0%, #7C3AED 100%)' }}
        >
          <Home size={16} className="text-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-w-0"
          >
            <p className="text-sm font-bold text-text-primary leading-none">鸿蒙智联</p>
            <p className="text-xs text-text-tertiary mt-0.5">全屋中控</p>
          </motion.div>
        )}
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-1 px-3 flex-1">
        {NAV_ITEMS.map(item => {
          const isActive = item.id === activeTab
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 ${
                collapsed ? 'justify-center' : ''
              }`}
              style={{
                background: isActive ? 'rgba(78,158,255,0.12)' : 'transparent',
                borderLeft: isActive ? '3px solid #4E9EFF' : '3px solid transparent',
                color: isActive ? '#4E9EFF' : '#4A5568',
              }}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="mx-3 mt-4 py-2.5 rounded-xl glass flex items-center justify-center text-text-tertiary hover:text-text-secondary transition-colors"
      >
        <motion.div animate={{ rotate: collapsed ? 0 : 180 }}>
          <Settings size={16} />
        </motion.div>
      </button>
    </motion.nav>
  )
}

// Need useState import here
import { useState } from 'react'
