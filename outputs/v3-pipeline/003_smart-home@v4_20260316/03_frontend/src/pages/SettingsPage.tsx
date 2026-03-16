import { motion } from 'framer-motion'
import { Bell, Moon, Shield, Wifi, ChevronRight } from 'lucide-react'

const SETTING_SECTIONS = [
  {
    title: '显示',
    items: [
      { icon: <Moon size={16} />, label: '深色模式', value: '已开启', color: '#A78BFA' },
      { icon: <Bell size={16} />, label: '通知', value: '全部', color: '#4E9EFF' },
    ]
  },
  {
    title: '网络',
    items: [
      { icon: <Wifi size={16} />, label: '鸿蒙智联', value: '已连接 16 台', color: '#34D399' },
    ]
  },
  {
    title: '隐私',
    items: [
      { icon: <Shield size={16} />, label: '隐私保护', value: '开启', color: '#FF8C42' },
    ]
  },
]

export default function SettingsPage() {
  return (
    <div className="p-5 pb-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-text-primary mb-1" style={{ fontFamily: '"Space Grotesp"' }}>
          系统设置
        </h1>
        <p className="text-sm text-text-secondary mb-6">个性化配置</p>

        {SETTING_SECTIONS.map(section => (
          <div key={section.title} className="mb-6">
            <h2 className="text-xs text-text-tertiary uppercase tracking-widest mb-2 px-1">{section.title}</h2>
            <div className="glass rounded-2xl overflow-hidden">
              {section.items.map((item, i) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors text-left ${
                    i < section.items.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}20`, color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <span className="flex-1 text-sm text-text-primary">{item.label}</span>
                  <span className="text-xs text-text-tertiary mr-2">{item.value}</span>
                  <ChevronRight size={14} className="text-text-tertiary" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* App info */}
        <div className="text-center text-xs text-text-tertiary mt-8">
          <p>鸿蒙智联中控 v1.0.0</p>
          <p className="mt-1">兼容鸿蒙智联全品类 IoT 设备</p>
        </div>
      </motion.div>
    </div>
  )
}
