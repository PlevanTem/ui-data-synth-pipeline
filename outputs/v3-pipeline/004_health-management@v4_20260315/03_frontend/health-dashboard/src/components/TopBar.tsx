import { useStore } from '../store/useStore'
import { CloudSync, Sun, Moon, Bell, Activity } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

export function TopBar() {
  const { isElderlyMode, toggleElderlyMode, isSyncing, syncData, lastSync } = useStore()

  return (
    <header className="flex items-center justify-between px-6 py-4 glass-card sticky top-0 z-50 rounded-b-3xl">
      <div className="flex items-center gap-3">
        <div className="bg-[#48BB78]/20 p-2 rounded-xl text-[#48BB78]">
          <Activity size={28} />
        </div>
        <div>
          <h1 className="font-bold text-xl text-slate-800 m-0 leading-none">
            {isElderlyMode ? '我的健康' : 'Health AI'}
          </h1>
          <p className="text-sm text-slate-500">
            {isElderlyMode ? '今天气色不错' : 'Good Morning, Alex'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Sync Button */}
        <div className="flex flex-col items-end hidden md:flex">
          <button 
            onClick={syncData}
            disabled={isSyncing}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#48BB78] transition-colors disabled:opacity-50"
          >
            <motion.div
              animate={{ rotate: isSyncing ? 360 : 0 }}
              transition={{ repeat: isSyncing ? Infinity : 0, duration: 1, ease: "linear" }}
            >
              <CloudSync size={20} />
            </motion.div>
            {isElderlyMode ? (isSyncing ? '同步中...' : '同步手环数据') : (isSyncing ? 'Syncing...' : 'Sync Device')}
          </button>
          <span className="text-xs text-slate-500 mt-1">
            {isElderlyMode ? `上次更新: ${lastSync}` : `Last sync: ${lastSync}`}
          </span>
        </div>

        {/* Elderly Mode Toggle */}
        <button
          onClick={toggleElderlyMode}
          className="relative flex items-center w-16 h-8 rounded-full bg-slate-200 shadow-inner overflow-hidden transition-colors duration-300"
          aria-label="Toggle Elderly Mode"
        >
          <div className={cn("absolute w-full h-full inset-0 transition-opacity duration-300", isElderlyMode ? 'bg-orange-200' : 'bg-slate-200')} />
          <motion.div
            className="absolute z-10 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center"
            animate={{ left: isElderlyMode ? '36px' : '4px' }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <AnimatePresence mode="wait">
              {isElderlyMode ? (
                <motion.div key="sun" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                  <Sun size={14} className="text-orange-500" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                  <Moon size={14} className="text-slate-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </button>

        <button className="relative p-2 bg-white rounded-full shadow-sm text-slate-800 hover:text-[#48BB78] transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <img 
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=EBF8FF" 
          alt="Avatar" 
          className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
        />
      </div>
    </header>
  )
}
