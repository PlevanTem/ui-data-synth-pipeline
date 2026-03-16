import { AnimatePresence, motion } from 'framer-motion'
import AppLayout from '@/components/layout/AppLayout'
import AmbientBackground from '@/generative/AmbientBackground'
import HomePage from '@/pages/HomePage'
import DevicesPage from '@/pages/DevicesPage'
import ScenesPage from '@/pages/ScenesPage'
import EnergyPage from '@/pages/EnergyPage'
import SettingsPage from '@/pages/SettingsPage'
import { DeviceProvider } from '@/store/DeviceStore'
import { useUIStore } from '@/store/UIStore'

function PageRouter() {
  const activeTab = useUIStore(s => s.activeTab)

  const pages: Record<string, React.ReactNode> = {
    home: <HomePage />,
    devices: <DevicesPage />,
    scenes: <ScenesPage />,
    energy: <EnergyPage />,
    settings: <SettingsPage />,
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className="min-h-full"
      >
        {pages[activeTab] ?? <HomePage />}
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <DeviceProvider>
      <AmbientBackground />
      <AppLayout>
        <PageRouter />
      </AppLayout>
    </DeviceProvider>
  )
}
