import React from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, ShieldCheck } from 'lucide-react';

interface CalendarManagementProps {
  calendars: any[];
  onSetPrimary: (provider: string, id: string) => void;
  onCreateOmVrti: () => void;
}

/**
 * A specialized panel for administrative calendar tasks.
 */
export const CalendarManagement: React.FC<CalendarManagementProps> = ({ calendars, onSetPrimary, onCreateOmVrti }) => {
  return (
    <div className="flex flex-col gap-4 bg-white/5 backdrop-blur-xl rounded-[32px] p-6 border border-white/10">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex flex-col">
          <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none">Management</h3>
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-tight mt-1">Configure your sync clusters</span>
        </div>
        <button 
          onClick={onCreateOmVrti}
          className="flex items-center gap-2 px-3 py-1.5 bg-primary rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
        >
          <Plus size={12} /> Init OmVrti
        </button>
      </div>

      <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-2 no-scrollbar">
        {calendars.filter(c => c.id !== 'sys-cal-1').map(cal => (
          <div key={cal.id} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 group">
            <div className="flex items-center gap-3">
              <div 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: cal.color }}
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white truncate max-w-[150px]">{cal.name}</span>
                <span className="text-[9px] font-bold text-white/30 uppercase">{cal.provider}</span>
              </div>
            </div>
            
            <button
              onClick={() => onSetPrimary(cal.provider, cal.id)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg border border-white/10 text-[9px] font-black text-white/40 uppercase hover:text-white hover:border-primary transition-all"
            >
              <Star size={10} /> Set Primary
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest px-2">
        <ShieldCheck size={10} />
        <span>Enterprise Sync Protocol Active</span>
      </div>
    </div>
  );
};
