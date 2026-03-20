export type TimeRange = "24h" | "7d" | "30d";
export type Region = "north" | "east" | "south" | "west";
export type ResourceType = "drone" | "tractor" | "crew";

export interface FilterState {
  timeRange: TimeRange;
  region: Region;
  resourceType: ResourceType;
}

export interface ResourcePoint {
  id: string;
  name: string;
  region: Region;
  type: ResourceType;
  x: number;
  y: number;
  load: number; // 0..100
}

export interface WorkflowNode {
  id: string;
  label: string;
  type: "ingest" | "balance" | "dispatch" | "custom";
}

