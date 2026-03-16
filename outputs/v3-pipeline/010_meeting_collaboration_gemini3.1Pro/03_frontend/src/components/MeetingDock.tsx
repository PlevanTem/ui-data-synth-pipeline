import React from 'react';
import { useMeetingStore } from '../store/useMeetingStore';
import { Mic, MicOff, Video, VideoOff, MonitorUp, SquareSquare, PhoneOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const MeetingDock: React.FC = () => {
  const { isMuted, isVideoOn, toggleMute, toggleVideo, toggleWhiteboard, isWhiteboardActive, setView } = useMeetingStore();

  const handleLeave = () => {
    setView('summary');
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-surface/80 backdrop-blur-md px-6 py-3 rounded-full shadow-floating border border-border/50 z-50"
    >
      <DockButton 
        active={!isMuted} 
        onClick={toggleMute} 
        icon={isMuted ? <MicOff size={20} className="text-red-500" /> : <Mic size={20} />} 
        label="Mute"
      />
      <DockButton 
        active={isVideoOn} 
        onClick={toggleVideo} 
        icon={isVideoOn ? <Video size={20} /> : <VideoOff size={20} className="text-red-500" />} 
        label="Video"
      />
      <div className="w-px h-8 bg-border mx-2"></div>
      <DockButton 
        active={isWhiteboardActive} 
        onClick={toggleWhiteboard} 
        icon={<SquareSquare size={20} />} 
        label="Whiteboard"
      />
      <DockButton 
        active={false} 
        onClick={() => {}} 
        icon={<MonitorUp size={20} />} 
        label="Share"
      />
      <div className="w-px h-8 bg-border mx-2"></div>
      <button 
        onClick={handleLeave}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
        title="Leave Meeting"
      >
        <PhoneOff size={20} />
      </button>
    </motion.div>
  );
};

const DockButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
      active ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'bg-surface hover:bg-gray-100 text-text_secondary'
    }`}
    title={label}
  >
    {icon}
  </button>
);