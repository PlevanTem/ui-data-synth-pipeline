export type ViewKey = "overview" | "whiteboard" | "secure-chat" | "geo-intel" | "reports";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface FilterState {
  query: string;
  region: "all" | "north" | "south" | "east" | "west";
  risk: RiskLevel | "all";
  sort: "priority" | "updated";
}

export interface TaskItem {
  id: string;
  title: string;
  region: FilterState["region"];
  risk: RiskLevel;
  updatedAt: number;
  linkedMessageId: string;
  linkedNodeId: string;
}

export interface ChatMessage {
  id: string;
  channel: string;
  content: string;
  encrypted: boolean;
  status: "sent" | "read" | "failed";
  linkedNodeId?: string;
  linkedGeoEvent?: string;
}
