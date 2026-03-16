import type { Device, Room, Scene, EnergyStats } from '@/types'

export const ROOMS: Room[] = [
  { id: 'all', name: '全部', icon: 'grid', description: '所有设备' },
  { id: 'living', name: '客厅', icon: 'sofa', description: '客厅空间' },
  { id: 'bedroom', name: '卧室', icon: 'bed', description: '主卧室' },
  { id: 'kitchen', name: '厨房', icon: 'chef-hat', description: '厨房空间' },
  { id: 'study', name: '书房', icon: 'book-open', description: '工作学习空间' },
  { id: 'bathroom', name: '卫生间', icon: 'droplets', description: '卫生间' },
]

export const DEVICES: Device[] = [
  // 客厅设备
  {
    id: 'd01', name: '客厅主灯', type: 'lighting', roomId: 'living',
    isOn: true, isOnline: true, powerConsumption: 18,
    lastSeen: '刚刚', icon: 'lamp-ceiling',
    params: { brightness: 80 }
  },
  {
    id: 'd02', name: '客厅空调', type: 'climate', roomId: 'living',
    isOn: true, isOnline: true, powerConsumption: 1200,
    lastSeen: '刚刚', icon: 'wind',
    params: { temperature: 26, mode: '制冷' }
  },
  {
    id: 'd03', name: '客厅电视', type: 'entertainment', roomId: 'living',
    isOn: false, isOnline: true, powerConsumption: 0,
    lastSeen: '2小时前', icon: 'tv',
    params: { volume: 30 }
  },
  {
    id: 'd04', name: '落地灯', type: 'lighting', roomId: 'living',
    isOn: true, isOnline: true, powerConsumption: 8,
    lastSeen: '刚刚', icon: 'lamp',
    params: { brightness: 45 }
  },
  {
    id: 'd05', name: '客厅窗帘', type: 'curtain', roomId: 'living',
    isOn: true, isOnline: true, powerConsumption: 5,
    lastSeen: '刚刚', icon: 'align-justify',
    params: { position: 60 }
  },
  // 卧室设备
  {
    id: 'd06', name: '卧室灯', type: 'lighting', roomId: 'bedroom',
    isOn: false, isOnline: true, powerConsumption: 0,
    lastSeen: '8小时前', icon: 'lamp-ceiling',
    params: { brightness: 30 }
  },
  {
    id: 'd07', name: '卧室空调', type: 'climate', roomId: 'bedroom',
    isOn: false, isOnline: true, powerConsumption: 0,
    lastSeen: '8小时前', icon: 'wind',
    params: { temperature: 24, mode: '制冷' }
  },
  {
    id: 'd08', name: '卧室窗帘', type: 'curtain', roomId: 'bedroom',
    isOn: false, isOnline: true, powerConsumption: 0,
    lastSeen: '8小时前', icon: 'align-justify',
    params: { position: 0 }
  },
  {
    id: 'd09', name: '床头灯', type: 'lighting', roomId: 'bedroom',
    isOn: false, isOnline: true, powerConsumption: 0,
    lastSeen: '8小时前', icon: 'lamp-desk',
    params: { brightness: 20 }
  },
  // 厨房设备
  {
    id: 'd10', name: '厨房灯', type: 'lighting', roomId: 'kitchen',
    isOn: true, isOnline: true, powerConsumption: 12,
    lastSeen: '刚刚', icon: 'lamp-ceiling',
    params: { brightness: 100 }
  },
  {
    id: 'd11', name: '智能烟机', type: 'appliance', roomId: 'kitchen',
    isOn: false, isOnline: true, powerConsumption: 0,
    lastSeen: '3小时前', icon: 'fan',
    params: { mode: '低速' }
  },
  {
    id: 'd12', name: '冰箱', type: 'appliance', roomId: 'kitchen',
    isOn: true, isOnline: true, powerConsumption: 45,
    lastSeen: '刚刚', icon: 'refrigerator',
    params: { mode: '节能' }
  },
  // 书房设备
  {
    id: 'd13', name: '书房灯', type: 'lighting', roomId: 'study',
    isOn: false, isOnline: true, powerConsumption: 0,
    lastSeen: '1小时前', icon: 'lamp-desk',
    params: { brightness: 90 }
  },
  {
    id: 'd14', name: '书房空调', type: 'climate', roomId: 'study',
    isOn: false, isOnline: false, powerConsumption: 0,
    lastSeen: '离线', icon: 'wind',
    params: { temperature: 25, mode: '送风' }
  },
  // 安防设备
  {
    id: 'd15', name: '门口摄像头', type: 'security', roomId: 'living',
    isOn: true, isOnline: true, powerConsumption: 8,
    lastSeen: '刚刚', icon: 'camera',
    params: { isRecording: true }
  },
  {
    id: 'd16', name: '门锁', type: 'security', roomId: 'living',
    isOn: true, isOnline: true, powerConsumption: 1,
    lastSeen: '刚刚', icon: 'lock',
    params: {}
  },
]

export const INITIAL_SCENES: Scene[] = [
  {
    id: 'home', name: '回家', icon: 'home', colorPrimary: '#FF8C42', colorBg: 'rgba(255, 140, 66, 0.12)',
    isActive: true, lastTriggered: '今天 18:30',
    actions: [
      { deviceId: 'd01', targetState: { isOn: true, params: { brightness: 80 } } },
      { deviceId: 'd02', targetState: { isOn: true, params: { temperature: 26 } } },
      { deviceId: 'd04', targetState: { isOn: true, params: { brightness: 50 } } },
      { deviceId: 'd05', targetState: { isOn: true, params: { position: 60 } } },
      { deviceId: 'd15', targetState: { isOn: true } },
      { deviceId: 'd16', targetState: { isOn: false } }, // 解锁
    ]
  },
  {
    id: 'away', name: '离家', icon: 'lock', colorPrimary: '#4E9EFF', colorBg: 'rgba(78, 158, 255, 0.12)',
    isActive: false,
    actions: [
      { deviceId: 'd01', targetState: { isOn: false } },
      { deviceId: 'd02', targetState: { isOn: false } },
      { deviceId: 'd03', targetState: { isOn: false } },
      { deviceId: 'd04', targetState: { isOn: false } },
      { deviceId: 'd05', targetState: { isOn: true, params: { position: 0 } } },
      { deviceId: 'd15', targetState: { isOn: true } },
      { deviceId: 'd16', targetState: { isOn: true } }, // 上锁
    ]
  },
  {
    id: 'sleep', name: '睡眠', icon: 'moon', colorPrimary: '#A78BFA', colorBg: 'rgba(167, 139, 250, 0.12)',
    isActive: false,
    actions: [
      { deviceId: 'd01', targetState: { isOn: false } },
      { deviceId: 'd04', targetState: { isOn: false } },
      { deviceId: 'd06', targetState: { isOn: true, params: { brightness: 10 } } },
      { deviceId: 'd07', targetState: { isOn: true, params: { temperature: 25, mode: '睡眠' } } },
      { deviceId: 'd08', targetState: { isOn: true, params: { position: 100 } } },
      { deviceId: 'd09', targetState: { isOn: true, params: { brightness: 5 } } },
    ]
  },
  {
    id: 'cinema', name: '观影', icon: 'film', colorPrimary: '#F59E0B', colorBg: 'rgba(245, 158, 11, 0.12)',
    isActive: false,
    actions: [
      { deviceId: 'd01', targetState: { isOn: true, params: { brightness: 20 } } },
      { deviceId: 'd03', targetState: { isOn: true, params: { volume: 50 } } },
      { deviceId: 'd04', targetState: { isOn: true, params: { brightness: 15 } } },
      { deviceId: 'd05', targetState: { isOn: true, params: { position: 100 } } },
    ]
  },
]

export const ENERGY_STATS: EnergyStats = {
  totalKwh: 8.4,
  totalCost: 5.21,
  comparedToLast: -12.3,
  topDevices: [
    { deviceId: 'd02', deviceName: '客厅空调', type: 'climate', kwh: 3.2, percentage: 38, trend: -8.5 },
    { deviceId: 'd07', deviceName: '卧室空调', type: 'climate', kwh: 1.8, percentage: 21, trend: 5.2 },
    { deviceId: 'd12', deviceName: '冰箱', type: 'appliance', kwh: 1.1, percentage: 13, trend: 2.1 },
    { deviceId: 'd03', deviceName: '客厅电视', type: 'entertainment', kwh: 0.8, percentage: 10, trend: -15.0 },
    { deviceId: 'd01', deviceName: '客厅主灯', type: 'lighting', kwh: 0.4, percentage: 5, trend: 0 },
    { deviceId: 'd15', deviceName: '门口摄像头', type: 'security', kwh: 0.19, percentage: 2, trend: 1.0 },
  ],
  dailyData: [
    { label: '0时', kwh: 0.3, cost: 0.19 },
    { label: '4时', kwh: 0.2, cost: 0.12 },
    { label: '8时', kwh: 0.5, cost: 0.31 },
    { label: '12时', kwh: 0.8, cost: 0.50 },
    { label: '16时', kwh: 1.2, cost: 0.74 },
    { label: '20时', kwh: 2.1, cost: 1.30 },
    { label: '现在', kwh: 3.1, cost: 1.92 },
  ],
  weeklyData: [
    { label: '周一', kwh: 9.2, cost: 5.70 },
    { label: '周二', kwh: 8.8, cost: 5.46 },
    { label: '周三', kwh: 10.1, cost: 6.26 },
    { label: '周四', kwh: 7.6, cost: 4.71 },
    { label: '周五', kwh: 11.3, cost: 7.01 },
    { label: '周六', kwh: 9.6, cost: 5.95 },
    { label: '今天', kwh: 8.4, cost: 5.21 },
  ],
  monthlyData: [
    { label: '1月', kwh: 280, cost: 173.60 },
    { label: '2月', kwh: 310, cost: 192.20 },
    { label: '3月', kwh: 195, cost: 120.90 },
  ],
}
