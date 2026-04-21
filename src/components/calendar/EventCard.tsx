import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { Card } from '../common/Card';

interface EventCardProps {
  event: any;
  calendarColor?: string;
  calendarName?: string;
}

/**
 * Renders a single calendar event in the schedule list.
 */
export const EventCard: React.FC<EventCardProps> = ({ event, calendarColor, calendarName }) => {
  const startTime = new Date(event.start);
  const endTime = new Date(event.end);
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMins = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <Card className="relative overflow-hidden group hover:shadow-xl transition-all border-none bg-white/95 backdrop-blur-sm p-4">
        {/* Color Strip Indicator */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1.5"
          style={{ backgroundColor: calendarColor || '#888888' }}
        />
        
        <div className="flex flex-col gap-3 text-left pl-2">
          {/* Header Area */}
          <div className="flex justify-between items-start gap-4">
            <h4 className={`text-base font-black leading-tight flex-1 ${event.isTrip ? 'text-primary' : 'text-gray-800'}`}>
              {event.title}
            </h4>
            <span className="text-[10px] font-black text-gray-400 uppercase whitespace-nowrap bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
              {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          {/* Metadata Area */}
          <div className="flex flex-col gap-2">
            {event.location && (
              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                <MapPin size={14} className="text-gray-300" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-tight">
                <Clock size={12} />
                <span>
                  {durationHours > 0 ? `${durationHours}h ` : ''}
                  {durationMins > 0 ? `${durationMins}m` : (durationHours === 0 ? 'All Day' : '')}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Area with Badges */}
          <div className="flex items-center gap-2 mt-1">
            <div 
              className="text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest text-white shadow-sm"
              style={{ backgroundColor: calendarColor || '#888888' }}
            >
              {calendarName || event.provider}
            </div>
            
            {event.isTrip && (
              <div className="bg-primary/10 text-primary text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-primary/10">
                AutoPilot Flow
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
