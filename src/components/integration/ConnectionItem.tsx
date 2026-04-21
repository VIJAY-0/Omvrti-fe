import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Mail, Apple, Unlink, Check, AlertCircle } from 'lucide-react';
import { SyncConnection } from '../../services/calendarSyncService';

interface ConnectionItemProps {
  connection: SyncConnection;
  onDisconnect: (id: number) => void;
  onViewCalendar: () => void;
}

/**
 * Displays an active synchronization connection with status details.
 * Clicking the item navigates to the calendar view.
 * Includes a distinct remove button for disconnection.
 */
export const ConnectionItem: React.FC<ConnectionItemProps> = ({ connection, onDisconnect, onViewCalendar }) => {
  const getIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName === 'google') return <Calendar className="text-orange-500" size={20} />;
    if (lowerName === 'microsoft' || lowerName === 'outlook') return <Mail className="text-blue-500" size={20} />;
    if (lowerName === 'apple') return <Apple className="text-gray-800" size={20} />;
    return <Calendar className="text-gray-400" size={20} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onViewCalendar}
      className="p-4 rounded-2xl bg-gray-50 border border-gray-100 group transition-all hover:bg-white hover:shadow-md cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl shadow-sm">
            {getIcon(connection.vendorName)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-gray-900 leading-tight">{connection.syncEmail}</span>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter ${
                connection.isTokenExpired ? 'text-red-500' : 'text-green-600'
              }`}>
                {connection.isTokenExpired ? (
                  <><AlertCircle size={10} /> Session Expired</>
                ) : (
                  <><Check size={10} /> Live Sync Active</>
                )}
              </div>
              <span className="text-[9px] text-gray-400 font-bold">•</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase truncate max-w-[80px]">
                {connection.vendorName}
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDisconnect(connection.id);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm"
          title="Disconnect Account"
        >
          <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover:inline">Remove</span>
          <Unlink size={14} />
        </button>
      </div>
    </motion.div>
  );
};
