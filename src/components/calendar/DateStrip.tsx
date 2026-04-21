import React from 'react';

interface DateStripProps {
  currentWeek: Date[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

/**
 * Weekly date picker strip for quick timeline navigation.
 */
export const DateStrip: React.FC<DateStripProps> = ({ currentWeek, selectedDate, onDateChange }) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl p-4 rounded-[32px] border border-white/10 shadow-2xl">
      {weekDays.map((day, idx) => {
        const date = currentWeek[idx];
        const isSelected = date.toDateString() === selectedDate.toDateString();
        const isToday = date.toDateString() === new Date().toDateString();

        return (
          <div key={`${day}-${idx}`} className="flex flex-col items-center gap-1.5 flex-1">
            <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-primary' : 'text-white/30'}`}>
              {day}
            </span>
            <button 
              onClick={() => onDateChange(date)}
              className={`relative w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-300 ${
                isSelected 
                  ? 'bg-primary text-white shadow-lg shadow-orange-500/40 scale-110' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {date.getDate()}
              {isToday && !isSelected && (
                <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_#f97316]" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};
