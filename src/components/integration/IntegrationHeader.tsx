import React from 'react';
import { Settings2, RefreshCw } from 'lucide-react';

interface IntegrationHeaderProps {
  loading: boolean;
  onFullSync?: () => void;
}

/**
 * Standard header for the Integration settings page.
 * Includes a "Full Sync" action for global hydration.
 */
export const IntegrationHeader: React.FC<IntegrationHeaderProps> = ({ loading, onFullSync }) => {
  return (
    <div className="flex items-center justify-between mt-2">
      <div className="flex flex-col gap-1 text-left">
        <h2 className="text-xl font-black text-white">Sync Hub</h2>
        <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-none">
          {loading ? 'Executing Fetch...' : 'Connected Services'}
        </span>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={onFullSync}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 bg-primary rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'}`}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Hydrating...' : 'Full Sync'}
        </button>

        <button className="p-2 bg-white/10 rounded-xl text-white backdrop-blur-sm transition-all hover:bg-white/20">
          <Settings2 size={18} />
        </button>
      </div>
    </div>
  );
};
