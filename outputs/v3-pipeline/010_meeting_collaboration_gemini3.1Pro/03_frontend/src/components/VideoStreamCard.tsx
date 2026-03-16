import React from 'react';
import { useMeetingStore } from '../store/useMeetingStore';
import { MicOff, VideoOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const VideoStreamCard: React.FC = () => {
  const { isMuted, isVideoOn, isSpeaking, isWhiteboardActive } = useMeetingStore();

  return (
    <motion.div 
      layout
      className={`relative bg-primary_highlight rounded-2xl shadow-floating overflow-hidden transition-all duration-500
        ${isWhiteboardActive ? 'w-64 h-48 absolute bottom-24 left-6 z-40' : 'w-full h-full flex-1'}
      `}
    >
      {isVideoOn ? (
        <img 
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" 
          alt="Video stream" 
          className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary">
          <div className="w-24 h-24 rounded-full bg-surface/10 flex items-center justify-center">
            <span className="text-4xl text-white font-medium">Me</span>
          </div>
        </div>
      )}

      {/* Speaking border glow */}
      {isSpeaking && !isWhiteboardActive && (
        <div className="absolute inset-0 border-4 border-accent-amber rounded-2xl pointer-events-none" />
      )}

      {/* Status indicators */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-md text-white text-sm font-medium flex items-center gap-2">
          You {isMuted && <MicOff size={14} className="text-red-400" />} {!isVideoOn && <VideoOff size={14} className="text-red-400" />}
        </div>
      </div>
    </motion.div>
  );
};