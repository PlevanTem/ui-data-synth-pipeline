import React from 'react';
import { motion } from 'framer-motion';
import { useMeetingStore } from '../store/useMeetingStore';
import { Calendar, Users, MonitorSmartphone, ArrowRight } from 'lucide-react';

export const HubView: React.FC = () => {
  const setView = useMeetingStore((state) => state.setView);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="min-h-screen flex items-center justify-center p-6"
    >
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium">
            <MonitorSmartphone size={16} />
            Harmony Spatial Workspace
          </div>
          <h1 className="text-5xl font-semibold text-primary leading-tight">
            Seamless meetings <br/>
            <span className="text-text_secondary">across devices.</span>
          </h1>
          <p className="text-text_secondary text-lg max-w-md">
            Your AI copilot is ready. One touch to transfer the meeting to any screen.
          </p>
          
          <button 
            onClick={() => setView('meeting')}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary_highlight transition-all hover:shadow-floating group"
          >
            Start Meeting
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="bg-surface/60 backdrop-blur-xl p-6 rounded-3xl shadow-floating border border-border/50">
          <h3 className="font-medium text-text_secondary mb-4 flex items-center gap-2">
            <Calendar size={18} /> Today's Schedule
          </h3>
          <div className="space-y-3">
            {[
              { title: 'Weekly Sync', time: '10:00 AM', attendees: 5 },
              { title: 'Design Review', time: '2:30 PM', attendees: 3 },
            ].map((meeting, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-border/30 hover:border-accent-blue/30 transition-colors cursor-pointer">
                <div>
                  <h4 className="font-medium text-primary">{meeting.title}</h4>
                  <p className="text-sm text-text_secondary">{meeting.time}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-text_secondary">
                  <Users size={14} /> {meeting.attendees}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};