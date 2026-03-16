import { useState } from 'react'
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Zap } from 'lucide-react'
import type { EnergyPeriod } from '@/types'
import { ENERGY_STATS } from '@/store/mockData'
import { useCountUp } from '@/hooks/useCountUp'

const PERIOD_LABELS: Record<EnergyPeriod, string> = {
  daily: '今日',
  weekly: '本周',
  monthly: '本月',
}

const DEVICE_COLORS = ['#4E9EFF', '#60A5FA', '#34D399', '#A78BFA', '#FFD700', '#FB923C']

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs"
      style={{
        background: 'rgba(22,25,33,0.97)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.10)',
      }}
    >
      <p className="text-text-secondary mb-0.5">{label}</p>
      <p className="font-semibold text-text-primary">{payload[0].value} kWh</p>
    </div>
  )
}

export default function EnergyPanel() {
  const [period, setPeriod] = useState<EnergyPeriod>('daily')
  const stats = ENERGY_STATS

  const data = period === 'daily' ? stats.dailyData : period === 'weekly' ? stats.weeklyData : stats.monthlyData
  const totalKwh = useCountUp(period === 'daily' ? stats.totalKwh : period === 'weekly' ? 65.1 : 785, 600, 1)
  const totalCost = useCountUp(period === 'daily' ? stats.totalCost : period === 'weekly' ? 40.36 : 486.50, 600, 2)

  const trend = stats.comparedToLast
  const TrendIcon = trend < 0 ? TrendingDown : TrendingUp
  const trendColor = trend < 0 ? '#34D399' : '#FF5C5C'

  return (
    <div className="flex flex-col gap-4">
      {/* Summary row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-text-tertiary uppercase tracking-widest mb-2">用电量</p>
          <div className="flex items-end gap-1">
            <span className="tabular-nums text-3xl font-bold text-text-primary" style={{ fontFamily: '"Space Grotesk"' }}>
              {totalKwh}
            </span>
            <span className="text-sm text-text-secondary mb-1">kWh</span>
          </div>
          <div className={`flex items-center gap-1 mt-1 text-xs font-medium`} style={{ color: trendColor }}>
            <TrendIcon size={12} />
            <span>较上期 {Math.abs(trend)}%</span>
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-text-tertiary uppercase tracking-widest mb-2">电费</p>
          <div className="flex items-end gap-1">
            <span className="text-xs text-text-secondary mt-1 mb-1.5">¥</span>
            <span className="tabular-nums text-3xl font-bold text-text-primary" style={{ fontFamily: '"Space Grotesk"' }}>
              {totalCost}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Zap size={11} className="text-yellow-400" />
            <span className="text-xs text-text-tertiary">0.62元/度</span>
          </div>
        </div>
      </div>

      {/* Period tabs */}
      <div className="flex gap-2">
        {(Object.keys(PERIOD_LABELS) as EnergyPeriod[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className="flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-150"
            style={{
              background: p === period ? 'rgba(78,158,255,0.15)' : 'rgba(255,255,255,0.04)',
              color: p === period ? '#4E9EFF' : '#8B9BB4',
              border: p === period ? '1px solid rgba(78,158,255,0.30)' : '1px solid transparent',
            }}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Trend chart */}
      <div className="glass rounded-2xl p-4">
        <p className="text-xs text-text-secondary mb-4">用电趋势</p>
        <motion.div
          key={period}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4E9EFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4E9EFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#4A5568', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4A5568', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone" dataKey="kwh" stroke="#4E9EFF" strokeWidth={2}
                fill="url(#areaGrad)" animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top devices */}
      <div className="glass rounded-2xl p-4">
        <p className="text-xs text-text-secondary mb-4">设备用电排行</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={stats.topDevices.slice(0, 5)} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="deviceName" tick={{ fill: '#4A5568', fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4A5568', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="kwh" radius={[4, 4, 0, 0]} animationDuration={800}>
              {stats.topDevices.slice(0, 5).map((_, i) => (
                <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
