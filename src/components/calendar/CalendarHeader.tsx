import React from 'react';
import { Search, Settings2, Loader2 } from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: Date;
  loading: boolean;
  onRefresh: () => void;
}

/**
 * Top navigation and action bar for the Calendar view.
 */
export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentDate, loading, onRefresh }) => {
  return (
    <div className="mt-2 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col text-left">
          <h2 className="text-xl font-black text-white">
            {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-[10px] font-black uppercase tracking-widest leading-none">
              {loading ? 'Refreshing Grid...' : 'Timeline View'}
            </span>
            {loading && <Loader2 size={10} className="text-primary animate-spin" />}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onRefresh}
            disabled={loading}
            className={`p-2 bg-white/10 rounded-2xl text-white backdrop-blur-md transition-all hover:bg-white/20 border border-white/5 ${loading ? 'opacity-50' : ''}`}
            title="Refresh Calendar"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          </button>
          <button className="p-2 bg-white/10 rounded-2xl text-white backdrop-blur-md transition-all hover:bg-white/20 border border-white/5">
            <Settings2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
