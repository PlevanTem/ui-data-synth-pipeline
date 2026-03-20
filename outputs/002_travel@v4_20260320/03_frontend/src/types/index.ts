export type ViewKey = "tasks" | "shop" | "form" | "ar";

export type TaskState = "todo" | "completed";

export interface TaskItem {
  id: string;
  title: string;
  category: "check-in" | "museum" | "food" | "ar";
  points: number;
  state: TaskState;
}

export interface RewardItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  ownedCount: number;
}

export interface LedgerEntry {
  id: string;
  type: "earn" | "spend";
  amount: number;
  reason: string;
  ts: string;
}

export interface A11yProfile {
  reducedMotion: boolean;
  fontScale: number;
  contrastMode: "normal" | "high";
  captions: boolean;
}

export interface AppState {
  points: number;
  tasks: TaskItem[];
  rewards: RewardItem[];
  ledger: LedgerEntry[];
  a11y: A11yProfile;
  selectedWaypoint: string;
}
