import { useMediaQuery } from '@/hooks/useMediaQuery'
import { BottomNav, SideNav } from '@/components/layout/Navigation'
import ToastContainer from '@/components/ui/Toast'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {isDesktop && <SideNav />}

      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: isDesktop ? 0 : '80px' }}>
        {children}
      </main>

      {!isDesktop && <BottomNav />}

      <ToastContainer />
    </div>
  )
}
