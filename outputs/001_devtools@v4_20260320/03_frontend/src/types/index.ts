export type Severity = "low" | "medium" | "high";

export type ViewMode = "overview" | "root-cause" | "optimization";

export interface PerfRecord {
  id: string;
  service: string;
  latency: number;
  throughput: number;
  errorRate: number;
  severity: Severity;
}
