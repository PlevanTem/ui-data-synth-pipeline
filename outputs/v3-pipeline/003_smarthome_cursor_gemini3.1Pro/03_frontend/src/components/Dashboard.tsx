import React, { useState, useEffect } from 'react';
import type { Device, Scene, DeviceType, SceneType } from '../types';
import { EnvironmentHero } from './EnvironmentHero';
import { SceneCard } from './SceneCard';
import { DeviceCard } from './DeviceCard';
import { VoiceAssistant } from './VoiceAssistant';
import { motion } from 'framer-motion';

const initialDevices: Device[] = [
  { id: 'l1', name: '客厅主灯', type: 'light', room: '客厅', isOn: true, isOnline: true },
  { id: 'l2', name: '氛围灯带', type: 'light', room: '客厅', isOn: false, isOnline: true },
  { id: 'c1', name: '中央空调', type: 'climate', room: '客厅', isOn: false, isOnline: true, value: 24 },
  { id: 'm1', name: '智慧屏', type: 'media', room: '客厅', isOn: false, isOnline: true },
  { id: 'cu1', name: '智能窗帘', type: 'curtain', room: '客厅', isOn: true, isOnline: true },
  { id: 's1', name: '智能门锁', type: 'security', room: '玄关', isOn: true, isOnline: true },
];

const scenes: Scene[] = [
  { id: 'home', name: '回家', icon: 'Home', color: 'text-scene-home' },
  { id: 'leave', name: '离家', icon: 'LogOut', color: 'text-scene-leave' },
  { id: 'movie', name: '观影', icon: 'Film', color: 'text-scene-movie' },
  { id: 'sleep', name: '睡眠', icon: 'Moon', color: 'text-scene-sleep' },
];

export const Dashboard: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [activeScene, setActiveScene] = useState<SceneType | null>('home');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => 
      d.id === id ? { ...d, isOn: !d.isOn } : d
    ));
    // Reset active scene if user manually tweaks a device
    setActiveScene(null);
  };

  const activateScene = (sceneId: string) => {
    const sId = sceneId as SceneType;
    setActiveScene(sId);
    
    // Simulate orchestration with stagger
    const updateSequence = (updates: Partial<Device>[], delayBase = 50) => {
      updates.forEach((update, idx) => {
        setTimeout(() => {
          setDevices(prev => prev.map(d => d.id === update.id ? { ...d, ...update } : d));
        }, delayBase * idx);
      });
    };

    if (sId === 'leave') {
      updateSequence(devices.map(d => ({ id: d.id, isOn: d.id === 's1' ? true : false })));
    } else if (sId === 'home') {
      updateSequence([
        { id: 'l1', isOn: true },
        { id: 'c1', isOn: true },
        { id: 'cu1', isOn: true },
      ]);
    } else if (sId === 'movie') {
      updateSequence([
        { id: 'l1', isOn: false },
        { id: 'l2', isOn: true },
        { id: 'cu1', isOn: false },
        { id: 'm1', isOn: true },
      ]);
    } else if (sId === 'sleep') {
      updateSequence(devices.map(d => ({ id: d.id, isOn: d.id === 's1' || d.id === 'c1' ? true : false })));
    }
  };

  return (
    <div className="relative z-10 min-h-screen w-full max-w-md mx-auto flex flex-col md:max-w-4xl md:flex-row md:items-start md:py-12 md:gap-12">
      
      <div className="md:sticky md:top-12 md:w-80 flex flex-col gap-6">
        <EnvironmentHero 
          temperature={24} 
          humidity={45} 
          onVoiceClick={() => setIsVoiceOpen(true)}
        />

        <div className="px-6 md:px-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted uppercase tracking-wider">智能场景</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {scenes.map(s => (
              <SceneCard 
                key={s.id} 
                scene={s} 
                isActive={activeScene === s.id} 
                onActivate={activateScene} 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 md:py-0 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wider">设备控制</h2>
          <span className="text-xs text-muted">共 {devices.length} 个设备</span>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 }
            }
          }}
        >
          {devices.map(d => (
            <motion.div 
              key={d.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <DeviceCard device={d} onToggle={toggleDevice} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <VoiceAssistant isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </div>
  );
};
