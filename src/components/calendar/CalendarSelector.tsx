import React from 'react';
import { Check } from 'lucide-react';

interface CalendarSelectorProps {
  calendars: any[];
  selectedIds: (string | number)[];
  onToggle: (id: string | number) => void;
}

/**
 * A horizontal pill-based selector to filter visible calendars.
 */
export const CalendarSelector: React.FC<CalendarSelectorProps> = ({ calendars, selectedIds, onToggle }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 pt-1 -mx-1 px-1 scrollbar-hide no-scrollbar">
      {calendars.map(cal => {
        const isSelected = selectedIds.includes(cal.id);
        
        return (
          <button
            key={cal.id}
            onClick={() => onToggle(cal.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 border ${
              isSelected 
                ? 'bg-white text-gray-900 shadow-xl shadow-white/5 border-white' 
                : 'bg-white/10 text-white/50 border-white/5 hover:bg-white/15'
            }`}
          >
            <div 
              className="w-2.5 h-2.5 rounded-full shadow-sm" 
              style={{ backgroundColor: cal.color }}
            />
            <span className="text-[10px] font-black uppercase tracking-tight">{cal.name}</span>
            {isSelected && <Check size={12} className="text-primary ml-1" />}
          </button>
        );
      })}
    </div>
  );
};
