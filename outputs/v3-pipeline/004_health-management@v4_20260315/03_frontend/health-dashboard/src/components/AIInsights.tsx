import { useStore } from '../store/useStore'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Apple, Activity, Bed } from 'lucide-react'
import { cn } from '../lib/utils'

export function AIInsights() {
  const isElderlyMode = useStore(state => state.isElderlyMode)

  const plans = [
    { icon: Bed, title: '睡眠改善', desc: '今晚建议10:30前入睡', color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: Activity, title: '适度运动', desc: '今天还差2000步达标', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Apple, title: '饮食建议', desc: '血压偏高，建议少盐', color: 'text-green-500', bg: 'bg-green-50' }
  ]

  return (
    <div className="flex flex-col gap-6">
      <motion.div layout className="glass-card rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#48BB78] via-blue-400 to-purple-500" />
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
            <Sparkles className="text-purple-600 animate-pulse" size={isElderlyMode ? 32 : 24} />
          </div>
          <div>
            <h3 className={cn("font-bold text-slate-800 mb-2", isElderlyMode ? "text-2xl" : "text-lg")}>
              AI 健康洞察
            </h3>
            <p className={cn("text-slate-600 leading-relaxed", isElderlyMode ? "text-xl" : "text-sm")}>
              {isElderlyMode 
                ? "您今天的心率很稳定，继续保持！但是要注意按时吃降压药，今晚早点休息。"
                : "Your resting heart rate is in the top 15% of your age group. However, your sleep efficiency was slightly lower last night. Consider winding down 30 mins earlier today."}
            </p>
            <button className="mt-4 flex items-center gap-2 text-[#48BB78] font-medium text-sm hover:underline">
              {isElderlyMode ? '查看完整报告' : 'Read Full Report'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan, idx) => (
          <motion.div 
            key={idx}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:bg-white/90 transition-colors"
          >
            <div className={cn("p-3 rounded-xl", plan.bg, plan.color)}>
              <plan.icon size={isElderlyMode ? 28 : 20} />
            </div>
            <div>
              <h4 className={cn("font-semibold text-slate-800", isElderlyMode ? "text-xl" : "text-base")}>
                {plan.title}
              </h4>
              <p className={cn("text-slate-500", isElderlyMode ? "text-lg" : "text-sm")}>
                {plan.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
