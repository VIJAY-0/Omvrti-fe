import React from 'react';
import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';
import _ from 'lodash';

interface MonthHeatmapProps {
  events: any[];
  currentDate: Date;
  onDateSelect: (date: Date) => void;
}

/**
 * Monthly "Heatmap" View.
 * Focuses on identifying travel clusters and busy periods.
 */
export const MonthHeatmap: React.FC<MonthHeatmapProps> = ({ events, currentDate, onDateSelect }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Group events by date for heatmap dot density
  const eventsByDate = _.groupBy(events, evt => {
    const d = new Date(evt.start);
    return d.toDateString();
  });

  const daysInMonth = Array.from({ length: lastDay.getDate() }, (_, i) => new Date(year, month, i + 1));
  
  // Padding for starting day of week
  const startPadding = Array.from({ length: firstDay.getDay() }, (_, i) => null);
  const calendarCells = [...startPadding, ...daysInMonth];

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-2xl border border-gray-100 font-sans">
      <div className="grid grid-cols-7 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} className="text-center text-[10px] font-black text-gray-300 py-2">
            {d}
          </div>
        ))}

        {calendarCells.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} />;

          const dateStr = date.toDateString();
          const dayEvents = eventsByDate[dateStr] || [];
          const tripEvents = dayEvents.filter(e => e.isTrip);
          const hasTrip = tripEvents.length > 0;
          const isSelected = date.toDateString() === currentDate.toDateString();
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <motion.button
              key={dateStr}
              whileHover={{ scale: 0.95 }}
              onClick={() => onDateSelect(date)}
              className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                isSelected 
                  ? 'bg-primary text-white shadow-lg' 
                  : hasTrip 
                    ? 'bg-orange-50 border border-orange-100' 
                    : 'bg-white hover:bg-gray-50'
              }`}
            >
              <span className={`text-[11px] font-black ${isSelected ? 'text-white' : isToday ? 'text-primary' : 'text-gray-900'}`}>
                {date.getDate()}
              </span>

              {/* Dot Density */}
              <div className="flex gap-0.5 mt-0.5 mt-1 overflow-hidden max-w-[80%]">
                {dayEvents.slice(0, 3).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-gray-400'}`} 
                  />
                ))}
                {dayEvents.length > 3 && <div className="text-[6px] font-bold">+</div>}
              </div>

              {/* Travel Indicator */}
              {hasTrip && (
                <div className="absolute top-1 right-1">
                  <Plane size={8} className="text-primary rotate-45" />
                </div>
              )}

              {isToday && !isSelected && (
                <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
              )}
            </motion.button>
          );
        })}
      </div>
      
      <div className="mt-6 flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-50 border border-orange-200" />
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Travel Cluster</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              <div className="w-1 h-1 rounded-full bg-gray-400" />
              <div className="w-1 h-1 rounded-full bg-gray-400" />
            </div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Active Schedule</span>
          </div>
        </div>
      </div>
    </div>
  );
};
