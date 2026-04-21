import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Mail, Apple, Unlink, Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { SyncConnection, CalendarEntry } from '../../services/calendarSyncService';
import { ConnectionCalendarManager } from './ConnectionCalendarManager';

interface ConnectionItemProps {
  connection: SyncConnection;
  calendars: CalendarEntry[];
  syncedIds: number[];
  onDisconnect: (id: number) => void;
  onViewCalendar: () => void;
  onToggleSync: (id: number) => void;
  onMakePrimary: (provider: string, id: string) => void;
}

/**
 * Displays an active synchronization connection with status details.
 * Features a collapsible calendar management section for granular control.
 */
export const ConnectionItem: React.FC<ConnectionItemProps> = ({ 
  connection, 
  calendars,
  syncedIds,
  onDisconnect, 
  onViewCalendar,
  onToggleSync,
  onMakePrimary
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter calendars belonging to this connection provider
  const connectionCalendars = calendars.filter(c => 
    c.provider?.toLowerCase() === connection.vendorName.toLowerCase()
  );

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
      className={`rounded-[32px] border transition-all overflow-hidden ${
        isExpanded ? 'bg-white shadow-2xl border-primary/20 p-6' : 'bg-gray-50 border-gray-100 p-4 hover:shadow-md'
      }`}
    >
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl shadow-sm transition-all ${isExpanded ? 'bg-primary/5' : 'bg-white'}`}>
            {getIcon(connection.vendorName)}
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-black text-gray-900 leading-tight ${isExpanded ? 'text-lg' : ''}`}>
              {connection.syncEmail}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <div className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter ${
                connection.isTokenExpired ? 'text-red-500' : 'text-green-600'
              }`}>
                {connection.isTokenExpired ? (
                  <><AlertCircle size={10} /> Sync Halted</>
                ) : (
                  <><Check size={10} /> Active</>
                )}
              </div>
              <span className="text-[9px] text-gray-400 font-bold">•</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-primary/60">
                {connection.vendorName}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewCalendar();
              }}
              className="px-3 py-1.5 bg-white border border-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-primary transition-all"
            >
              Timeline
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDisconnect(connection.id);
            }}
            className={`p-2 transition-all rounded-xl ${
              isExpanded ? 'bg-red-50 text-red-400' : 'bg-white border border-gray-100 text-gray-300'
            } hover:text-red-500`}
            title="Terminate Connection"
          >
            <Unlink size={16} />
          </button>
          
          <div className="ml-1 text-gray-400">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="mt-6 border-t border-gray-50 pt-6">
              <ConnectionCalendarManager 
                calendars={connectionCalendars}
                syncedIds={syncedIds}
                onToggleSync={onToggleSync}
                onMakePrimary={onMakePrimary}
              />
              
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={onViewCalendar}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all"
                >
                  Enter Mission Control
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
