import React, { useEffect, useRef } from 'react';
import { useMeetingStore } from '../store/useMeetingStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckSquare } from 'lucide-react';

export const TranscriptionPanel: React.FC = () => {
  const { transcriptData, addActionItem, isSpeaking } = useMeetingStore();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [transcriptData, isSpeaking]);

  return (
    <div className="w-80 h-[calc(100vh-140px)] bg-surface/80 backdrop-blur-md rounded-2xl shadow-subtle border border-border/50 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <Sparkles size={18} className="text-accent-amber" />
        <h3 className="font-semibold text-primary">AI Transcription</h3>
      </div>
      
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        <AnimatePresence initial={false}>
          {transcriptData.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col gap-1 group ${item.isAi ? 'bg-blue-50/50 p-3 rounded-lg' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text_secondary">{item.speaker}</span>
                {!item.isAi && (
                  <button 
                    onClick={() => addActionItem(item.text)}
                    className="opacity-0 group-hover:opacity-100 text-xs flex items-center gap-1 text-accent-blue hover:underline transition-opacity"
                  >
                    <CheckSquare size={12} />
                    Make Todo
                  </button>
                )}
              </div>
              <p className="text-sm text-text_main leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-1 items-center h-6"
            >
              <span className="w-2 h-2 rounded-full bg-accent-amber animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-accent-amber animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-accent-amber animate-bounce" style={{ animationDelay: '300ms' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};