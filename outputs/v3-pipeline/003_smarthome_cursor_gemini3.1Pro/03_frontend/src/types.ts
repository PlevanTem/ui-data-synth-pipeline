export type DeviceType = 'light' | 'climate' | 'security' | 'media' | 'curtain';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  room: string;
  isOn: boolean;
  isOnline: boolean;
  value?: number; // brightness, temperature, etc.
}

export type SceneType = 'home' | 'leave' | 'sleep' | 'movie';

export interface Scene {
  id: SceneType;
  name: string;
  icon: string;
  color: string;
}
