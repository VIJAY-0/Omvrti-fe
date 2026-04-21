import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Plane, AlertCircle, ChevronRight } from 'lucide-react';

interface DayTimelineProps {
  events: any[];
  selectedDate: Date;
  onRefresh: () => void;
}

/**
 * Revamped DayTimeline: "The Terminal Log"
 * 
 * High-granularity execution view designed with a brutalist, mission-control aesthetic.
 * Focuses on high information density and temporal precision.
 */
export const DayTimeline: React.FC<DayTimelineProps> = ({ events, selectedDate }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000); // 10s precision
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

  const hours = Array.from({ length: 25 }, (_, i) => i); // 00 to 24

  // Sort events by start time for the "log" sequence
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => a.start.localeCompare(b.start));
  }, [events]);

  return (
    <div className="relative w-full min-h-[1600px] bg-[#050505] text-[#E4E3E0] font-mono rounded-[40px] overflow-hidden border border-[#222] shadow-3xl">
      {/* SCANLINE OVERLAY - Adds terminal vibe */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      {/* 24-hour Sidebar Axis */}
      <div className="absolute left-0 top-0 bottom-0 w-16 border-r border-white/5 bg-black/40 backdrop-blur-sm z-10 flex flex-col justify-between py-6">
        {hours.map(hour => (
          <div key={hour} className="flex flex-col items-center gap-1 group">
            <span className="text-[10px] font-black text-gray-700 group-hover:text-primary transition-colors">
              {hour.toString().padStart(2, '0')}
            </span>
            <div className="w-4 h-[1px] bg-white/5" />
          </div>
        ))}
      </div>

      {/* GRID CELLS */}
      <div className="absolute left-16 right-0 top-0 bottom-0 pointer-events-none">
        {hours.map(hour => (
          <div 
            key={`grid-${hour}`} 
            className="absolute left-0 right-0 border-t border-white/[0.03] h-px w-full" 
            style={{ top: `${(hour / 24) * 100}%` }}
          >
            <span className="absolute -top-2 left-2 text-[8px] text-white/5 uppercase font-bold tracking-tighter">
              LOG_SEGMENT_{hour.toString().padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>

      {/* EVENT LOG CONTENT */}
      <div className="relative ml-16 h-full p-4">
        {sortedEvents.map((evt, idx) => {
          const startTime = new Date(evt.start);
          const endTime = new Date(evt.end);
          const startPos = getPosition(startTime);
          const endPos = getPosition(endTime);
          const duration = endPos - startPos;
          
          // Determine height - trips get full height, meetings get slivers
          const height = Math.max(duration, 1.2); 
          const isMini = height < 3;

          return (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08, type: 'spring', damping: 15 }}
              className={`absolute left-4 right-6 rounded-2xl overflow-hidden border transition-all duration-300 group z-20 ${
                evt.isTrip 
                  ? 'border-primary/40 bg-primary/10 shadow-[0_0_20px_rgba(216,67,21,0.1)]' 
                  : 'border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-white/20'
              }`}
              style={{
                top: `${startPos}%`,
                height: `${height}%`,
              }}
            >
              <div className="p-3 flex flex-col h-full overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                       <span className={`text-[12px] font-black uppercase tracking-tight truncate ${evt.isTrip ? 'text-primary' : 'text-white'}`}>
                        {evt.title}
                      </span>
                      {evt.isTrip && <Plane size={12} className="text-primary animate-pulse" />}
                    </div>
                    {!isMini && (
                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5">
                        {evt.provider} System Feedback
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-[10px] font-black text-primary font-mono">
                      {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                    {!isMini && (
                       <span className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">
                        TO: {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </span>
                    )}
                  </div>
                </div>

                {!isMini && (
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {evt.location && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/40">
                          <MapPin size={12} className="text-primary/60" />
                          <span className="truncate max-w-[150px]">{evt.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/40">
                        <Clock size={12} className="text-white/20" />
                        <span>{Math.round((endTime.getTime() - startTime.getTime()) / 60000)}m</span>
                      </div>
                    </div>
                    
                    <button className="flex items-center gap-1 text-[9px] font-black text-primary uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                      Open Log <ChevronRight size={10} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* THE "NOW" INTERCEPTION LINE */}
      {isToday && (
        <div 
          className="absolute left-0 right-0 z-40 pointer-events-none group"
          style={{ top: `${nowPosition}%` }}
        >
          <div className="relative w-full flex items-center">
             <div className="absolute left-16 bg-red-600/20 px-2 py-0.5 rounded-sm border border-red-500/30 text-[8px] font-black text-red-500 uppercase tracking-[0.2em] -top-5">
              CurrentExecutionTime_Node_01
            </div>
            <div className="h-[2px] w-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)]" />
            <div className="absolute left-0 w-16 flex items-center justify-center">
               <div className="w-3 h-3 bg-red-600 rounded-full animate-ping opacity-20" />
               <div className="absolute w-1.5 h-1.5 bg-red-600 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* CORNER DECORATIONS */}
      <div className="absolute top-4 right-4 text-[10px] font-black text-white/5 uppercase tracking-[0.4em] z-0">
        OMVRTI_SYSTEM_STASIS
      </div>
    </div>
  );
};
