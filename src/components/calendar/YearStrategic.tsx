import React from 'react';
import { motion } from 'framer-motion';
import _ from 'lodash';

interface YearStrategicProps {
  events: any[];
  currentDate: Date;
  onMonthSelect: (month: number) => void;
}

/**
 * Yearly "Strategic" View.
 * Helps track tax residency rules (e.g. 180-day rule) and long-term travel intensity.
 */
export const YearStrategic: React.FC<YearStrategicProps> = ({ events, currentDate, onMonthSelect }) => {
  const currentYear = currentDate.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => i);

  // Group events by month and filter for travel days
  const eventsByMonth = _.groupBy(events, evt => {
    const d = new Date(evt.start);
    return d.getMonth();
  });

  const getTravelIntensity = (month: number) => {
    const monthEvents = eventsByMonth[month] || [];
    const travelDays = _.uniqBy(
      monthEvents.filter(e => e.isTrip),
      e => new Date(e.start).toDateString()
    ).length;
    
    // Intensity mapping
    if (travelDays >= 20) return 'bg-[#1e3a8a] text-white'; // Deep blue
    if (travelDays >= 10) return 'bg-blue-600 text-white';
    if (travelDays >= 5) return 'bg-blue-400 text-white';
    if (travelDays >= 2) return 'bg-blue-100 text-blue-900';
    return 'bg-gray-50 text-gray-400';
  };

  const getTravelDayCount = (month: number) => {
    const monthEvents = eventsByMonth[month] || [];
    return _.uniqBy(
      monthEvents.filter(e => e.isTrip),
      e => new Date(e.start).toDateString()
    ).length;
  };

  const totalTravelDays = _.sum(months.map(m => getTravelDayCount(m)));

  return (
    <div className="flex flex-col gap-6">
      {/* Yearly Highlights */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#141414] p-5 rounded-[24px] border border-white/5 flex flex-col gap-1">
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">Total Residency Out</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-primary">{totalTravelDays}</span>
            <span className="text-[10px] font-bold text-gray-600 uppercase">Days</span>
          </div>
          <p className="text-[8px] text-gray-600 font-bold leading-tight">Calculated for tax residency compliance (180-day mark)</p>
        </div>
        <div className="bg-white p-5 rounded-[24px] border border-gray-100 flex flex-col gap-1">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Flight Intensity</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">
              {events.filter(e => e.isTrip).length}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Segments</span>
          </div>
          <p className="text-[8px] text-gray-400 font-bold leading-tight">Active routes synchronized across clusters</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {months.map(m => {
          const intensityClass = getTravelIntensity(m);
          const travelDays = getTravelDayCount(m);
          const monthName = new Date(currentYear, m, 1).toLocaleString('default', { month: 'short' });

          return (
            <motion.button
              key={m}
              whileTap={{ scale: 0.95 }}
              onClick={() => onMonthSelect(m)}
              className={`flex flex-col items-center justify-center p-4 rounded-[24px] transition-all aspect-[4/5] border border-transparent hover:border-primary/20 ${intensityClass}`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">
                {monthName}
              </span>
              <span className="text-2xl font-black leading-tight">
                {travelDays}
              </span>
              <span className="text-[8px] font-bold uppercase tracking-tighter opacity-40">
                Travel Days
              </span>
              
              {/* Mini Grid representation */}
              <div className="grid grid-cols-7 gap-0.5 mt-3 opacity-20">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div key={i} className="w-[3px] h-[3px] bg-current rounded-full" />
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
