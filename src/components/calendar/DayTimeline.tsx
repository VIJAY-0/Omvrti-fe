import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Plane } from 'lucide-react';

interface DayTimelineProps {
  events: any[];
  selectedDate: Date;
  onRefresh: () => void;
}

/**
 * High-granularity "Task List" view.
 * Looks like a terminal log with a vertical timeline and "Now" line.
 */
export const DayTimeline: React.FC<DayTimelineProps> = ({ events, selectedDate }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  // Percentage from top of the day (0-100)
  const getPosition = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return ((hours * 60 + minutes) / (24 * 60)) * 100;
  };

  const nowPosition = getPosition(now);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="relative w-full min-h-[1440px] bg-[#141414] text-[#E4E3E0] font-mono p-4 rounded-[32px] overflow-hidden border border-[#222]">
      {/* 24-hour Axis */}
      <div className="absolute left-0 top-4 bottom-4 w-12 border-r border-[#222] flex flex-col justify-between py-2 z-10 pointer-events-none">
        {hours.map(hour => (
          <span key={hour} className="text-[10px] text-gray-600 text-center">
            {hour.toString().padStart(2, '0')}
          </span>
        ))}
      </div>

      {/* Grid Lines */}
      {hours.map(hour => (
        <div 
          key={`line-${hour}`} 
          className="absolute left-12 right-0 border-t border-[#1a1a1a] h-px" 
          style={{ top: `${(hour / 24) * 100}%` }}
        />
      ))}

      {/* Events */}
      <div className="relative ml-12 h-fill">
        {events.map((evt, idx) => {
          const startPos = getPosition(new Date(evt.start));
          const endPos = getPosition(new Date(evt.end));
          const duration = endPos - startPos;
          const height = Math.max(duration, 1.5); // Minimum sliver height

          return (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="absolute left-2 right-4 rounded-lg overflow-hidden border border-white/5 transition-all hover:border-primary/50 group"
              style={{
                top: `${startPos}%`,
                height: `${height}%`,
                backgroundColor: evt.isTrip ? 'rgba(216, 67, 21, 0.2)' : 'rgba(255,255,255,0.05)',
              }}
            >
              <div 
                className="absolute left-0 top-0 bottom-0 w-1 bg-primary" 
                style={{ backgroundColor: evt.isTrip ? '#D84315' : 'rgba(255,255,255,0.2)' }}
              />
              <div className="p-2 flex flex-col h-full justify-start overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-black uppercase truncate ${evt.isTrip ? 'text-primary' : 'text-gray-300'}`}>
                    {evt.title}
                  </span>
                  <span className="text-[9px] text-gray-500 font-bold">
                    {new Date(evt.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </span>
                </div>
                
                {height > 4 && (
                  <div className="mt-1 flex flex-col gap-1 opacity-60">
                    {evt.location && (
                      <div className="flex items-center gap-1 text-[9px]">
                        <MapPin size={10} />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    )}
                    {evt.isTrip && (
                      <div className="flex items-center gap-1 text-[9px] text-primary">
                        <Plane size={10} />
                        <span>FLIGHT LOG</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Now Line */}
      {isToday && (
        <div 
          className="absolute left-12 right-0 z-20 pointer-events-none"
          style={{ top: `${nowPosition}%` }}
        >
          <div className="relative w-full">
            <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <div className="h-px w-full bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.3)]" />
          </div>
        </div>
      )}
    </div>
  );
};
