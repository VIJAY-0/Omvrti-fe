import React from 'react';
import { ToggleLeft, ToggleRight, Star, Calendar } from 'lucide-react';
import { CalendarEntry } from '../../services/calendarSyncService';

interface ConnectionCalendarManagerProps {
  calendars: CalendarEntry[];
  syncedIds: number[];
  onToggleSync: (id: number) => void;
  onMakePrimary: (provider: string, id: string) => void;
}

/**
 * A mobile-first, simplified view for managing individual calendars within a specific account connection.
 * Allows toggling sync status and promoting a calendar to primary status.
 */
export const ConnectionCalendarManager: React.FC<ConnectionCalendarManagerProps> = ({ 
  calendars, 
  syncedIds, 
  onToggleSync, 
  onMakePrimary 
}) => {

  console.log('Rendering ConnectionCalendarManager with calendars:', calendars);
  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1 px-1">
        <Calendar size={12} className="text-gray-400" />
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Calendars</span>
      </div>
      
      {calendars.length === 0 ? (
        <div className="p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-[10px] font-bold text-gray-400 text-center italic uppercase tracking-tighter">No sub-calendars identified</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {calendars.map(cal => {
            const isSynced = syncedIds.includes(cal.id);
            return (
              <div 
                key={cal.id} 
                className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-2xl hover:border-primary/20 transition-all group shadow-sm"
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="text-xs font-black text-gray-900 truncate leading-tight uppercase tracking-tight">{cal.displayName}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter truncate max-w-[120px]">ID: {cal.id}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onMakePrimary(cal.provider || '', cal.syncCalendarId);
                    }}
                    className="p-1.5 text-gray-300 hover:text-primary transition-colors active:scale-90"
                    title="Set as Account Primary"
                  >
                    <Star size={14} />
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSync(cal.id);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      isSynced 
                        ? 'bg-primary text-white shadow-lg shadow-orange-500/20' 
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    Sync
                    {isSynced ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {calendars.length > 0 && (
        <div className="mt-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-[9px] font-bold text-blue-600 leading-tight uppercase tracking-tighter">
            PRO TIP: Toggle sync off for non-essential calendars to keep your mission timeline clean.
          </p>
        </div>
      )}
    </div>
  );
};
