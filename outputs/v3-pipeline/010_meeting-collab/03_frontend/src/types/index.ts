// Application-wide TypeScript types

export type View = 'dashboard' | 'meeting' | 'minutes' | 'tasks' | 'history';
export type MeetingStatus = 'idle' | 'in-progress' | 'generating' | 'done';
export type Theme = 'dark' | 'light';
export type DeviceMode = 'desktop' | 'tablet' | 'phone';
export type Language = 'zh' | 'en';
export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isMuted: boolean;
  isSpeaking: boolean;
}

export interface TranscriptLine {
  id: string;
  participantId: string;
  participantName: string;
  participantColor: string;
  text: string;
  textEn: string;
  timestamp: string;
}

export interface SummaryItem {
  id: string;
  text: string;
  textEn: string;
  category: 'key-point' | 'decision' | 'action';
}

export interface Meeting {
  id: string;
  title: string;
  titleEn: string;
  date: string;
  startTime: string;
  duration: string;
  participants: Participant[];
  status: MeetingStatus;
}

export interface UpcomingMeeting {
  id: string;
  title: string;
  time: string;
  duration: string;
  participantCount: number;
  avatars: string[];
}

export interface AgendaItem {
  id: string;
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  decisions: DecisionItem[];
}

export interface DecisionItem {
  id: string;
  text: string;
  textEn: string;
  importance: 'high' | 'medium' | 'low';
}

export interface ActionItem {
  id: string;
  text: string;
  textEn: string;
  assignee: string;
  dueDate: string;
  synced: boolean;
}

export interface Minutes {
  meetingId: string;
  title: string;
  titleEn: string;
  date: string;
  duration: string;
  participants: string[];
  agendaItems: AgendaItem[];
  actionItems: ActionItem[];
}

export interface Task {
  id: string;
  title: string;
  titleEn: string;
  sourceMeetingId: string;
  sourceMeetingTitle: string;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
  description: string;
  descriptionEn: string;
  relatedMinutesExcerpt: string;
  relatedMinutesExcerptEn: string;
}

export interface HistoryMeeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  participantCount: number;
  keywordsZh: string[];
  keywordsEn: string[];
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
