import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMeetingStore } from '../store/useMeetingStore';
import { VideoStreamCard } from '../components/VideoStreamCard';
import { TranscriptionPanel } from '../components/TranscriptionPanel';
import { MeetingDock } from '../components/MeetingDock';
import { WhiteboardCanvas } from '../components/WhiteboardCanvas';

export const MeetingRoomView: React.FC = () => {
  const { setSpeaking, addTranscript, isMuted } = useMeetingStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isMuted) {
      interval = setInterval(() => {
        if (Math.random() > 0.7) {
          setSpeaking(true);
          
          setTimeout(() => {
            setSpeaking(false);
            const phrases = [
              "I think we should align on the Q3 roadmap.",
              "Can you share the Figma link?",
              "The new generative UI approach looks solid.",
              "Let's make this an action item for next week."
            ];
            const text = phrases[Math.floor(Math.random() * phrases.length)];
            addTranscript("Sarah (Product)", text, false);
          }, 1500);
        }
      }, 5000);
    } else {
      setSpeaking(false);
    }

    return () => clearInterval(interval);
  }, [isMuted, setSpeaking, addTranscript]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="h-screen w-full flex p-6 gap-6 relative"
    >
      <div className="flex-1 relative flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl aspect-video relative flex items-center justify-center">
          <VideoStreamCard />
          <WhiteboardCanvas />
        </div>
      </div>

      <div className="w-80 flex-shrink-0 z-10">
        <TranscriptionPanel />
      </div>

      <MeetingDock />
    </motion.div>
  );
};