import { TopBar } from './components/TopBar'
import { VitalCard } from './components/VitalCard'
import { AIInsights } from './components/AIInsights'
import { useStore } from './store/useStore'
import { motion } from 'framer-motion'
import { cn } from './lib/utils'

function App() {
  const { healthData, isElderlyMode } = useStore()

  return (
    <div className="min-h-screen relative font-sans selection:bg-[#48BB78]/30">
      {/* Background ambient gradient */}
      <div className="fixed inset-0 pointer-events-none opacity-60">
        <div className="absolute top-0 -left-1/4 w-[150%] h-[150%] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob bg-green-200" />
        <div className="absolute top-0 -right-1/4 w-[150%] h-[150%] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-2000 bg-blue-200" />
        <div className="absolute -bottom-1/2 left-1/4 w-[150%] h-[150%] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-4000 bg-orange-100" />
      </div>

      <div className="max-w-4xl mx-auto pb-24 relative z-10">
        <TopBar />

        <main className="px-6 py-8 flex flex-col gap-8">
          <motion.div layout className="space-y-4">
            <h2 className={cn("font-bold text-slate-800", isElderlyMode ? "text-3xl" : "text-xl")}>
              {isElderlyMode ? '今日核心指标' : 'Vital Overview'}
            </h2>
            
            <motion.div 
              layout
              className={cn(
                "grid gap-4",
                isElderlyMode ? "grid-cols-1" : "grid-cols-2 md:grid-cols-2 lg:grid-cols-2"
              )}
            >
              <VitalCard
                type="heartRate"
                title="Heart Rate"
                titleElderly="心率"
                value={healthData.heartRate}
                unit="bpm"
                status={healthData.heartRate > 90 ? 'warning' : 'normal'}
                history={healthData.history.heartRate}
                color="#F56565" // Red
              />
              <VitalCard
                type="sleep"
                title="Sleep Quality"
                titleElderly="睡眠质量"
                value={healthData.sleepQuality}
                unit="Score"
                status="normal"
                history={healthData.history.sleep}
                color="#805AD5" // Purple
              />
              <VitalCard
                type="oxygen"
                title="Blood Oxygen"
                titleElderly="血氧饱和度"
                value={healthData.bloodOxygen}
                unit="%"
                status={healthData.bloodOxygen < 95 ? 'danger' : 'normal'}
                history={healthData.history.oxygen}
                color="#4299E1" // Blue
              />
              <VitalCard
                type="steps"
                title="Daily Activity"
                titleElderly="今日步数"
                value={healthData.steps}
                unit="steps"
                status="normal"
                history={healthData.history.heartRate} // Dummy history
                color="#38B2AC" // Teal
              />
            </motion.div>
          </motion.div>

          <AIInsights />
        </main>
      </div>
    </div>
  )
}

export default App
