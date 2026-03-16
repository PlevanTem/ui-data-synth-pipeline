import { create } from 'zustand';

type ViewState = 'hub' | 'meeting' | 'summary';

interface MeetingState {
  currentView: ViewState;
  isMuted: boolean;
  isVideoOn: boolean;
  isSpeaking: boolean;
  isWhiteboardActive: boolean;
  transcriptData: Array<{ id: string; speaker: string; text: string; isAi: boolean }>;
  actionItems: Array<{ id: string; text: string; completed: boolean }>;
  
  // Actions
  setView: (view: ViewState) => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  setSpeaking: (speaking: boolean) => void;
  toggleWhiteboard: () => void;
  addTranscript: (speaker: string, text: string, isAi?: boolean) => void;
  addActionItem: (text: string) => void;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  currentView: 'hub',
  isMuted: false,
  isVideoOn: true,
  isSpeaking: false,
  isWhiteboardActive: false,
  transcriptData: [
    { id: '1', speaker: 'AI Assistant', text: 'Meeting started. I am ready to transcribe and extract action items.', isAi: true }
  ],
  actionItems: [],

  setView: (view) => set({ currentView: view }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted, isSpeaking: state.isMuted ? false : state.isSpeaking })),
  toggleVideo: () => set((state) => ({ isVideoOn: !state.isVideoOn })),
  setSpeaking: (speaking) => set({ isSpeaking: speaking }),
  toggleWhiteboard: () => set((state) => ({ isWhiteboardActive: !state.isWhiteboardActive })),
  addTranscript: (speaker, text, isAi = false) => set((state) => ({
    transcriptData: [...state.transcriptData, { id: Date.now().toString(), speaker, text, isAi }]
  })),
  addActionItem: (text) => set((state) => ({
    actionItems: [...state.actionItems, { id: Date.now().toString(), text, completed: false }]
  }))
}));