import React from 'react';
import { Settings2 } from 'lucide-react';

interface IntegrationHeaderProps {
  loading: boolean;
}

/**
 * Standard header for the Integration settings page.
 */
export const IntegrationHeader: React.FC<IntegrationHeaderProps> = ({ loading }) => {
  return (
    <div className="flex items-center justify-between mt-2">
      <div className="flex flex-col gap-1 text-left">
        <h2 className="text-xl font-black text-white">Sync Hub</h2>
        <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-none">
          {loading ? 'Polling Status...' : 'Connected Services'}
        </span>
      </div>
      <button className="p-2 bg-white/10 rounded-xl text-white backdrop-blur-sm transition-all hover:bg-white/20">
        <Settings2 size={18} />
      </button>
    </div>
  );
};
