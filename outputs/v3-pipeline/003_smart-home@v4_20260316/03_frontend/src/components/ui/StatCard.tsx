import { useCountUp } from '@/hooks/useCountUp'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number
  unit: string
  subLabel?: string
  trend?: number
  decimals?: number
  icon?: React.ReactNode
  accentColor?: string
}

export default function StatCard({
  label,
  value,
  unit,
  subLabel,
  trend,
  decimals = 0,
  icon,
  accentColor = '#4E9EFF',
}: StatCardProps) {
  const displayValue = useCountUp(value, 800, decimals)

  const TrendIcon = trend === undefined || trend === 0
    ? Minus
    : trend < 0 ? TrendingDown : TrendingUp

  const trendColor = trend === undefined || trend === 0
    ? 'text-text-tertiary'
    : trend < 0 ? 'text-green-400' : 'text-red-400'

  return (
    <div
      className="glass rounded-card p-5 flex flex-col gap-1 relative overflow-hidden transition-all duration-200 hover:glass-active"
    >
      {/* Subtle accent glow */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          transform: 'translate(30%, -30%)',
        }}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-tertiary uppercase tracking-widest">{label}</span>
        {icon && <span style={{ color: accentColor }}>{icon}</span>}
      </div>

      <div className="flex items-end gap-1.5 mt-1">
        <span
          className="tabular-nums leading-none"
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '2.25rem',
            fontWeight: 700,
            color: '#F0F4FF',
          }}
        >
          {displayValue}
        </span>
        <span className="text-sm text-text-secondary mb-1">{unit}</span>
      </div>

      <div className="flex items-center gap-2 mt-0.5">
        {subLabel && <span className="text-xs text-text-secondary">{subLabel}</span>}
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
            <TrendIcon size={12} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  )
}
