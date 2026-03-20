import type { ChatMessage, TaskItem } from "../types";

export const taskSeed: TaskItem[] = [
  { id: "t1", title: "北区延迟告警", region: "north", risk: "high", updatedAt: 171000003, linkedMessageId: "m1", linkedNodeId: "n1" },
  { id: "t2", title: "西区产能回升", region: "west", risk: "medium", updatedAt: 171000100, linkedMessageId: "m2", linkedNodeId: "n3" },
  { id: "t3", title: "南区设备离线", region: "south", risk: "critical", updatedAt: 171000120, linkedMessageId: "m3", linkedNodeId: "n2" },
  { id: "t4", title: "东区热力聚集", region: "east", risk: "high", updatedAt: 171000090, linkedMessageId: "m4", linkedNodeId: "n4" }
];

export const messageSeed: ChatMessage[] = [
  { id: "m1", channel: "ops", content: "北区 14:00 前需补派两组巡检", encrypted: true, status: "read", linkedNodeId: "n1", linkedGeoEvent: "g1" },
  { id: "m2", channel: "planning", content: "西区回升建议调整资源配比", encrypted: true, status: "sent", linkedNodeId: "n3" },
  { id: "m3", channel: "ops", content: "南区设备离线，等待重连", encrypted: true, status: "failed", linkedNodeId: "n2", linkedGeoEvent: "g2" },
  { id: "m4", channel: "geo", content: "东区温度异常，建议升级响应", encrypted: true, status: "sent", linkedNodeId: "n4", linkedGeoEvent: "g3" }
];
