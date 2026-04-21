import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { EventCard } from './EventCard';

interface ScheduleListProps {
  events: any[];
  calendars: any[];
  loading: boolean;
  selectedDate: Date;
}

/**
 * Orchestrates the list of events for the currently selected day.
 */
export const ScheduleList: React.FC<ScheduleListProps> = ({ events, calendars, loading, selectedDate }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
          Schedule Summary
        </h3>
        <span className="text-[9px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">
          {selectedDate.toLocaleDateString('default', { day: 'numeric', month: 'short' })}
        </span>
      </div>
      
      <div className="flex flex-col gap-3 min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {events.length > 0 ? (
            events.map((evt) => {
              const calendar = calendars.find(c => c.id === evt.calendarId);
              return (
                <EventCard 
                  key={evt.id} 
                  event={evt} 
                  calendarColor={calendar?.color}
                  calendarName={calendar?.name}
                />
              );
            })
          ) : !loading ? (
            /* Empty State */
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-24 flex flex-col items-center justify-center gap-4 text-white/20"
            >
              <div className="p-6 bg-white/5 rounded-full backdrop-blur-sm border border-white/5">
                <CalendarIcon size={48} strokeWidth={1} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-black uppercase tracking-[0.1em]">Clean Slate</span>
                <span className="text-[10px] font-bold text-white/10 uppercase">No scheduled events for this day</span>
              </div>
            </motion.div>
          ) : (
            /* Loading State */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 flex flex-col items-center justify-center gap-4 text-white/10"
            >
              <Loader2 size={48} className="animate-spin" strokeWidth={1} />
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Syncing Feed</span>
                <span className="text-[8px] font-bold text-white/5 uppercase">Contacting Primary Node</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
