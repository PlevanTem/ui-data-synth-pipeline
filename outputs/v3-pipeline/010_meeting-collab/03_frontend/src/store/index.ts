import { create } from 'zustand';
import type { View, MeetingStatus, Theme, DeviceMode, Language, Toast } from '@/types';
import { MOCK_TASKS } from '@/utils/mockData';
import type { Task, TaskStatus } from '@/types';

interface UIStore {
  theme: Theme;
  deviceMode: DeviceMode;
  sideNavCollapsed: boolean;
  projectionOpen: boolean;
  toasts: Toast[];
  toggleTheme: () => void;
  setDeviceMode: (mode: DeviceMode) => void;
  toggleSideNav: () => void;
  setProjectionOpen: (open: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  theme: 'dark',
  deviceMode: 'desktop',
  sideNavCollapsed: false,
  projectionOpen: false,
  toasts: [],
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  setDeviceMode: (mode) => set({ deviceMode: mode }),
  toggleSideNav: () => set((s) => ({ sideNavCollapsed: !s.sideNavCollapsed })),
  setProjectionOpen: (open) => set({ projectionOpen: open }),
  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, toast.duration ?? 3000);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

interface MeetingStore {
  currentView: View;
  meetingStatus: MeetingStatus;
  language: Language;
  syncedTaskIds: string[];
  setCurrentView: (view: View) => void;
  startMeeting: () => void;
  endMeeting: () => void;
  setLanguage: (lang: Language) => void;
  syncActionItem: (itemId: string) => void;
  syncAllActionItems: (itemIds: string[]) => void;
}

export const useMeetingStore = create<MeetingStore>((set) => ({
  currentView: 'dashboard',
  meetingStatus: 'idle',
  language: 'zh',
  syncedTaskIds: [],
  setCurrentView: (view) => set({ currentView: view }),
  startMeeting: () => set({ meetingStatus: 'in-progress', currentView: 'meeting' }),
  endMeeting: () => {
    set({ meetingStatus: 'generating' });
    setTimeout(() => {
      set({ meetingStatus: 'done', currentView: 'minutes' });
    }, 2000);
  },
  setLanguage: (lang) => set({ language: lang }),
  syncActionItem: (itemId) =>
    set((s) => ({ syncedTaskIds: s.syncedTaskIds.includes(itemId) ? s.syncedTaskIds : [...s.syncedTaskIds, itemId] })),
  syncAllActionItems: (itemIds) =>
    set((s) => ({ syncedTaskIds: [...new Set([...s.syncedTaskIds, ...itemIds])] })),
}));

type TaskFilter = 'all' | TaskStatus;

interface TaskStore {
  tasks: Task[];
  selectedTaskId: string | null;
  filterStatus: TaskFilter;
  drawerOpen: boolean;
  setFilterStatus: (f: TaskFilter) => void;
  setSelectedTaskId: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  addTasksFromMinutes: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: MOCK_TASKS,
  selectedTaskId: null,
  filterStatus: 'all',
  drawerOpen: false,
  setFilterStatus: (f) => set({ filterStatus: f }),
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  updateTaskStatus: (id, status) =>
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) })),
  addTasksFromMinutes: (newTasks) =>
    set((s) => ({
      tasks: [
        ...s.tasks,
        ...newTasks.filter((nt) => !s.tasks.find((t) => t.id === nt.id)),
      ],
    })),
}));
