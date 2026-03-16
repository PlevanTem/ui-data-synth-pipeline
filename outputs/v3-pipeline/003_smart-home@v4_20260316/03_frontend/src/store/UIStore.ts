import { create } from 'zustand'
import type { ToastItem, NavTab } from '@/types'

interface UIState {
  activeTab: NavTab
  toasts: ToastItem[]
  setActiveTab: (tab: NavTab) => void
  addToast: (toast: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'home',
  toasts: [],

  setActiveTab: (tab) => set({ activeTab: tab }),

  addToast: (toast) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2)
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    if (toast.type !== 'loading') {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }))
      }, 3500)
    }
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }))
  },
}))
