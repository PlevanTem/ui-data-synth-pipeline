import type { FilterState, ResourcePoint, WorkflowNode } from "../types";

export const defaultFilter: FilterState = {
  timeRange: "7d",
  region: "north",
  resourceType: "drone",
};

export const points: ResourcePoint[] = [
  { id: "r1", name: "Drone A1", region: "north", type: "drone", x: 18, y: 35, load: 72 },
  { id: "r2", name: "Crew N2", region: "north", type: "crew", x: 36, y: 48, load: 54 },
  { id: "r3", name: "Tractor E7", region: "east", type: "tractor", x: 68, y: 28, load: 83 },
  { id: "r4", name: "Drone S3", region: "south", type: "drone", x: 58, y: 72, load: 41 },
  { id: "r5", name: "Crew W9", region: "west", type: "crew", x: 22, y: 74, load: 64 },
];

export const initialWorkflow: WorkflowNode[] = [
  { id: "w1", label: "Ingest Telemetry", type: "ingest" },
  { id: "w2", label: "Balance Priority", type: "balance" },
  { id: "w3", label: "Dispatch Route", type: "dispatch" },
];

export function trendByFilter(filter: FilterState): number[] {
  // Deterministic series based on filter to keep UI predictable for tests.
  const seed = filter.timeRange.length + filter.region.length + filter.resourceType.length;
  return Array.from({ length: 8 }, (_, i) => 35 + ((i * 7 + seed * 5) % 55));
}

