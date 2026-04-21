import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Mail, Apple, Loader2, Link2 } from 'lucide-react';
import { Vendor } from '../../services/calendarSyncService';

interface VendorItemProps {
  vendor: Vendor;
  isConnected: boolean;
  onConnect: (name: string) => void;
}

/**
 * A standalone component for displaying a calendar vendor/provider.
 */
export const VendorItem: React.FC<VendorItemProps> = ({ vendor, isConnected, onConnect }) => {
  // Map vendor names to appropriate icons
  const getIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('google')) return <Calendar className="text-orange-500" size={24} />;
    if (lowerName.includes('outlook') || lowerName.includes('microsoft') || lowerName.includes('teams')) 
      return <Mail className="text-blue-500" size={24} />;
    if (lowerName.includes('apple')) return <Apple className="text-gray-800" size={24} />;
    return <Calendar className="text-gray-400" size={24} />;
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`p-4 rounded-3xl border transition-all ${
        isConnected 
          ? 'bg-gray-50 border-gray-100 opacity-60 pointer-events-none' 
          : 'bg-white border-gray-100 hover:shadow-lg hover:border-primary/20'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-50 rounded-2xl">
            {getIcon(vendor.name)}
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm font-black text-gray-900">{vendor.displayName}</h4>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {vendor.isNewConnection ? 'Support Available' : 'Legacy Connection'}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => onConnect(vendor.name.toLowerCase().split(' ')[0])}
          disabled={isConnected}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            isConnected
              ? 'bg-green-50 text-green-600'
              : 'bg-primary text-white shadow-lg shadow-orange-500/20 hover:bg-primary/90'
          }`}
        >
          {isConnected ? (
            'Connected'
          ) : (
            <>
              Connect <Link2 size={14} />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
