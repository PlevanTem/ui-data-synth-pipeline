import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, Loader2, X } from 'lucide-react'
import { useUIStore } from '@/store/UIStore'
import type { ToastItem } from '@/types'

const icons = {
  success: <CheckCircle size={18} className="text-green-400" />,
  error: <XCircle size={18} className="text-red-400" />,
  info: <Info size={18} className="text-blue-400" />,
  loading: <Loader2 size={18} className="text-blue-400 animate-spin" />,
}

function Toast({ toast }: { toast: ToastItem }) {
  const removeToast = useUIStore(s => s.removeToast)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="glass flex items-start gap-3 rounded-2xl px-4 py-3 shadow-xl min-w-[260px] max-w-[360px]"
      style={{ border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <span className="mt-0.5 flex-shrink-0">{icons[toast.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary leading-snug">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-text-secondary mt-0.5 leading-snug">{toast.message}</p>
        )}
      </div>
      {toast.type !== 'loading' && (
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 text-text-tertiary hover:text-text-secondary transition-colors mt-0.5"
        >
          <X size={14} />
        </button>
      )}
    </motion.div>
  )
}

export default function ToastContainer() {
  const toasts = useUIStore(s => s.toasts)
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <Toast toast={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
