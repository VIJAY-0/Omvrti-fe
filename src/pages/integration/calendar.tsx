import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DepthLayout } from '../../components/common/DepthLayout';
import { Card } from '../../components/common/Card';
import { motion, AnimatePresence } from 'motion/react';
import { useCalendarSync } from '../../hooks/useCalendarSync';
import { calendarSyncApi } from '../../services/calendarSyncService';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Check, 
  Filter, 
  Clock, 
  MapPin, 
  Users,
  Search,
  Settings2,
  Loader2,
  AlertCircle
} from 'lucide-react';

// Hardcoded colors for different providers
const PROVIDER_COLORS: Record<string, string> = {
  'google': '#D84315',
  'microsoft': '#3A7BD5',
  'apple': '#555555',
  'OmVrti.ai': '#4CAF50'
};

// System events representing OmVrti's travel itineraries
const SYSTEM_EVENTS = [
  {
    id: 'sys-evt-1',
    calendarId: 'sys-cal-1',
    title: 'Flight to JFK (UA 435)',
    start: '2026-06-01T08:30:00',
    end: '2026-06-01T16:55:00',
    location: 'SFO Terminal 3',
    isTrip: true,
    provider: 'OmVrti.ai'
  }
];

const SYSTEM_CALENDAR = { 
  id: 'sys-cal-1', 
  name: 'Travel Itinerary', 
  color: PROVIDER_COLORS['OmVrti.ai'], 
  provider: 'OmVrti.ai' 
};

export default function CalendarView() {
  const navigate = useNavigate();
  const { calendars, events: apiEvents, loading, error, refreshAll } = useCalendarSync();
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>(['sys-cal-1']);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Merge systemic calendars with API calendars
  const allCalendars = useMemo(() => {
    const apiCals = calendars.map(cal => ({
      id: cal.id,
      name: cal.summary,
      color: PROVIDER_COLORS[cal.provider.toLowerCase()] || '#888888',
      provider: cal.provider
    }));
    return [SYSTEM_CALENDAR, ...apiCals];
  }, [calendars]);

  // Initial selection of all calendars when they load
  useEffect(() => {
    if (allCalendars.length > 0 && selectedCalendarIds.length === 1 && selectedCalendarIds[0] === 'sys-cal-1') {
      console.log('[CalendarView] AUTO-SELECTING ALL LOADED CALENDARS:', allCalendars.map(c => c.name));
      setSelectedCalendarIds(allCalendars.map(c => c.id));
    }
  }, [allCalendars]);

  // Merge systemic events with API events and normalize structure
  const allEvents = useMemo(() => {
    console.log('[CalendarView] COMPUTING ALL EVENTS FROM API AND SYSTEM...');
    const normalizedApiEvents = apiEvents.map(evt => ({
      id: evt.id,
      calendarId: evt.calendarId || 'primary', // Fallback for safety
      title: evt.summary,
      start: evt.startDateTime || evt.startDate,
      end: evt.endDateTime || evt.endDate,
      location: evt.location,
      isTrip: false,
      provider: evt.provider
    }));
    return [...SYSTEM_EVENTS, ...normalizedApiEvents];
  }, [apiEvents]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const currentWeek = useMemo(() => {
    console.log('[CalendarView] UPDATING WEEK VIEW FOR DATE:', currentDate.toDateString());
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const toggleCalendar = (id: string) => {
    console.log(`[CalendarView] TOGGLING CALENDAR FILTER: ${id}`);
    setSelectedCalendarIds(prev => {
      const next = prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id];
      console.log(`[CalendarView] ACTIVE CALENDAR FILTERS:`, next);
      return next;
    });
  };

  const filteredEvents = allEvents.filter(evt => {
    const isSelected = selectedCalendarIds.includes(evt.calendarId);
    return isSelected;
  });

  const eventsForCurrentDay = useMemo(() => {
    console.log(`[CalendarView] FILTERING EVENTS FOR DAY: ${currentDate.toDateString()}`);
    const results = filteredEvents
      .filter(evt => {
        const evtDate = new Date(evt.start);
        return evtDate.toDateString() === currentDate.toDateString();
      })
      .sort((a, b) => a.start.localeCompare(b.start));
    
    console.log(`[CalendarView] FOUND ${results.length} EVENTS FOR THE SELECTED DAY.`);
    return results;
  }, [filteredEvents, currentDate]);

  const handleRefresh = async () => {
    console.log('[CalendarView] USER TRIGGERED MANUAL REFRESH');
    await refreshAll();
  };

  return (
    <DepthLayout
      title="Calendar"
      showBack
      headerContent={
        <div className="mt-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-white">
                {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
              </h2>
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                {loading ? 'Refreshing...' : 'Active Schedule'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleRefresh}
                disabled={loading}
                className={`p-2 bg-white/10 rounded-xl text-white transition-all ${loading ? 'animate-spin opacity-50' : ''}`}
              >
                {loading ? <Loader2 size={18} /> : <Search size={18} />}
              </button>
              <button className="p-2 bg-white/10 rounded-xl text-white">
                <Settings2 size={18} />
              </button>
            </div>
          </div>
          
          {/* Calendar Selector Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {allCalendars.map(cal => (
              <button
                key={cal.id}
                onClick={() => toggleCalendar(cal.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                  selectedCalendarIds.includes(cal.id) 
                    ? 'bg-white text-gray-900 shadow-lg' 
                    : 'bg-white/10 text-white/50 border border-white/5'
                }`}
              >
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: cal.color }}
                />
                <span className="text-[10px] font-black uppercase tracking-tight">{cal.name}</span>
                {selectedCalendarIds.includes(cal.id) && <Check size={12} className="text-primary" />}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6 mb-24">
        {/* Date Strip */}
        <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-4 rounded-[32px] border border-white/10 shadow-inner">
          {weekDays.map((day, idx) => {
            const date = currentWeek[idx];
            const isToday = date.toDateString() === currentDate.toDateString();
            return (
              <div key={day} className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold text-white/40 uppercase">{day}</span>
                <button 
                  onClick={() => setCurrentDate(date)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black transition-all ${
                    isToday ? 'bg-primary text-white shadow-lg shadow-orange-500/20' : 'text-white hover:bg-white/10'
                  }`}
                >
                  {date.getDate()}
                </button>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-100 text-xs font-bold">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Schedule */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2">
            Schedule for {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getDate()}
          </h3>
          
          <div className="flex flex-col gap-3">
            {eventsForCurrentDay.map((evt, idx) => {
                const calendar = allCalendars.find(c => c.id === evt.calendarId);
                const startTime = new Date(evt.start);
                const endTime = new Date(evt.end);
                const durationHours = Math.round((endTime.getTime() - startTime.getTime()) / 3600000);

                return (
                  <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all border-none bg-white/95 backdrop-blur-sm">
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1.5"
                        style={{ backgroundColor: calendar?.color }}
                      />
                      
                      <div className="flex flex-col gap-3 text-left pl-2">
                        <div className="flex justify-between items-start">
                          <h4 className={`text-base font-black leading-tight flex-1 mr-4 ${evt.isTrip ? 'text-primary' : 'text-gray-800'}`}>
                            {evt.title}
                          </h4>
                          <span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded">
                            {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {evt.location && (
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                              <MapPin size={14} className="text-gray-300" />
                              <span className="line-clamp-1">{evt.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                              <Clock size={12} />
                              <span>{durationHours > 0 ? `${durationHours} hours` : 'Short event'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <div 
                            className="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest text-white shadow-sm"
                            style={{ backgroundColor: calendar?.color }}
                          >
                            {calendar?.name || evt.provider}
                          </div>
                          {evt.isTrip && (
                            <div className="bg-primary/10 text-primary text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                              AutoPilot Itinerary
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            
            {!loading && eventsForCurrentDay.length === 0 && (
              <div className="py-20 flex flex-col items-center gap-4 text-white/30">
                <CalendarIcon size={48} strokeWidth={1} />
                <span className="text-sm font-bold uppercase tracking-widest">No events scheduled</span>
              </div>
            )}

            {loading && eventsForCurrentDay.length === 0 && (
              <div className="py-20 flex flex-col items-center gap-4 text-white/20">
                <Loader2 size={48} className="animate-spin" strokeWidth={1} />
                <span className="text-sm font-bold uppercase tracking-widest">Connecting to calendars...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          // Future: Quick add event logic
        }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center z-50 border-4 border-white"
      >
        <Plus size={28} />
      </motion.button>
    </DepthLayout>
  );
}
