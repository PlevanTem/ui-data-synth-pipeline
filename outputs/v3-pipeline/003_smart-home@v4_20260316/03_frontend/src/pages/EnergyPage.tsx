import { motion } from 'framer-motion'
import EnergyPanel from '@/components/energy/EnergyPanel'

export default function EnergyPage() {
  return (
    <div className="p-5 pb-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-text-primary mb-1" style={{ fontFamily: '"Space Grotesk"' }}>
          能耗统计
        </h1>
        <p className="text-sm text-text-secondary mb-6">了解全屋用电分布，建立节能意识</p>
        <EnergyPanel />
      </motion.div>
    </div>
  )
}
