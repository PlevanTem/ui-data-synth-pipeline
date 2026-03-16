import React from 'react';
import { motion } from 'framer-motion';
import { useMeetingStore } from '../store/useMeetingStore';
import { CheckCircle2, ArrowLeft, Sparkles, Send } from 'lucide-react';

export const SummaryView: React.FC = () => {
  const { actionItems, setView } = useMeetingStore();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-6"
    >
      <div className="w-full max-w-2xl bg-surface/90 backdrop-blur-xl p-8 rounded-3xl shadow-floating border border-border/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent-blue to-accent-amber opacity-80" />
        
        <button 
          onClick={() => setView('hub')}
          className="flex items-center gap-2 text-text_secondary hover:text-primary transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Hub
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-accent-amber/10 flex items-center justify-center text-accent-amber">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-primary">AI Meeting Summary</h1>
            <p className="text-text_secondary text-sm">Generated 1 min ago</p>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-text_secondary uppercase tracking-wider mb-3">Key Decisions</h3>
            <div className="p-4 bg-gray-50 rounded-xl text-primary text-sm leading-relaxed border border-border/50">
              The team aligned on the Q3 roadmap. Generative UI approach is approved for the new dashboard. Needs a final review from the engineering team by Friday.
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-text_secondary uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Action Items</span>
              <span className="text-xs font-normal bg-accent-blue/10 text-accent-blue px-2 py-0.5 rounded-full">
                {actionItems.length} tasks
              </span>
            </h3>
            
            {actionItems.length === 0 ? (
              <p className="text-sm text-text_secondary italic">No explicit action items captured.</p>
            ) : (
              <ul className="space-y-2">
                {actionItems.map(item => (
                  <li key={item.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                    <CheckCircle2 size={18} className="text-gray-300 group-hover:text-green-500 mt-0.5 flex-shrink-0 transition-colors" />
                    <span className="text-sm text-primary">{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="pt-6 border-t border-border/50 flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary_highlight transition-all shadow-sm">
              <Send size={16} /> Sync to Task Manager
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};