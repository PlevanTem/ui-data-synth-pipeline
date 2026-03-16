import { useStore } from '../store/useStore'
import { motion } from 'framer-motion'
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts'
import { cn } from '../lib/utils'
import { Heart, Moon, Activity, Droplets } from 'lucide-react'

interface VitalCardProps {
  title: string
  titleElderly: string
  value: string | number
  unit: string
  status: 'normal' | 'warning' | 'danger'
  type: 'heartRate' | 'sleep' | 'steps' | 'oxygen'
  history: number[]
  color: string
}

const icons = {
  heartRate: Heart,
  sleep: Moon,
  steps: Activity,
  oxygen: Droplets
}

export function VitalCard({ title, titleElderly, value, unit, status, type, history, color }: VitalCardProps) {
  const isElderlyMode = useStore((state) => state.isElderlyMode)
  const Icon = icons[type]

  const chartData = history.map((val, index) => ({ name: index, value: val }))

  const statusColors = {
    normal: 'text-green-500 bg-green-500/10',
    warning: 'text-orange-500 bg-orange-500/10',
    danger: 'text-red-500 bg-red-500/10'
  }

  const statusText = {
    normal: '正常',
    warning: '偏高',
    danger: '危险'
  }

  return (
    <motion.div 
      layout
      className={cn(
        "glass-card glass-card-hover rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between",
        isElderlyMode ? "min-h-[160px]" : "min-h-[200px]"
      )}
    >
      <div className="flex justify-between items-start z-10 relative">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl" style={{ color: color, backgroundColor: `${color}1A` }}>
            <Icon size={isElderlyMode ? 32 : 24} className={cn(type === 'heartRate' && 'animate-heartbeat')} />
          </div>
          <span className={cn("font-medium", isElderlyMode ? "text-xl" : "text-slate-500")}>
            {isElderlyMode ? titleElderly : title}
          </span>
        </div>
        
        {isElderlyMode && (
          <div className={cn("px-4 py-1.5 rounded-full text-lg font-bold", statusColors[status])}>
            {statusText[status]}
          </div>
        )}
      </div>

      <div className="mt-4 z-10 relative">
        <div className="flex items-baseline gap-1">
          <motion.span 
            layout="position"
            className={cn("font-bold text-slate-800 tracking-tight", isElderlyMode ? "text-6xl" : "text-4xl")}
          >
            {value}
          </motion.span>
          <span className={cn("text-slate-500", isElderlyMode ? "text-2xl" : "text-base")}>
            {unit}
          </span>
        </div>
      </div>

      {/* Background Chart - Only in normal mode */}
      {!isElderlyMode && (
        <div className="absolute bottom-0 left-0 w-full h-24 opacity-30 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={3}
                fillOpacity={1} 
                fill={`url(#gradient-${type})`} 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  )
}
