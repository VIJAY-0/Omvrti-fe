import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, MapPin, Grid, Layers, ZoomIn } from 'lucide-react';
import { usePinch } from '@use-gesture/react';
import { DepthLayout } from '../../components/common/DepthLayout';
import { useCalendarSync } from '../../hooks/useCalendarSync';

// New Sub-components
import { DayTimeline } from '../../components/calendar/DayTimeline';
import { MonthHeatmap } from '../../components/calendar/MonthHeatmap';
import { YearStrategic } from '../../components/calendar/YearStrategic';
import { CalendarSelector } from '../../components/calendar/CalendarSelector';
import { CalendarManagement } from '../../components/calendar/CalendarManagement';
import { DiagnosticPanel } from '../../components/integration/DiagnosticPanel';

// Static configuration for branding
const PROVIDER_COLORS: Record<string, string> = {
  'google': '#D84315',
  'microsoft': '#3A7BD5',
  'outlook': '#3A7BD5',
  'teams': '#4B53BC',
  'apple': '#555555',
  'OmVrti.ai': '#4CAF50'
};

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

type ViewType = 'day' | 'month' | 'year';

/**
 * CalendarView Page Component
 * Implements a zoomed-out navigation model for productivity.
 */
export default function CalendarView() {
  const { 
    calendars, 
    events: apiEvents, 
    loading, 
    error, 
    refreshAll, 
    makePrimary, 
    createOmVrtiCalendar, 
    connections,
    api 
  } = useCalendarSync();
  const [viewType, setViewType] = useState<ViewType>('day');
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<(string | number)[]>(['sys-cal-1']);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Data Normalization
  const allCalendars = useMemo(() => {
    const apiCals = calendars.map(cal => ({
      id: cal.id,
      name: cal.displayName,
      color: PROVIDER_COLORS[cal.provider?.toLowerCase() || 'google'] || '#888888',
      provider: cal.provider || 'google'
    }));
    return [SYSTEM_CALENDAR, ...apiCals] as any[];
  }, [calendars]);

  const allEvents = useMemo(() => {
    const normalizedApiEvents = apiEvents.map(evt => ({
      id: evt.id,
      calendarId: evt.calendarId || 0,
      title: evt.title,
      start: evt.eventStartDate || '',
      end: evt.eventEndDate || '',
      location: evt.location,
      isTrip: false,
      provider: evt.provider
    }));
    return [...SYSTEM_EVENTS, ...normalizedApiEvents];
  }, [apiEvents]);

  // Filtering for active view
  const activeEvents = useMemo(() => {
    return allEvents.filter(evt => selectedCalendarIds.includes(evt.calendarId));
  }, [allEvents, selectedCalendarIds]);

  const dailyEvents = useMemo(() => {
    return activeEvents.filter(evt => {
      const d = new Date(evt.start);
      return d.toDateString() === currentDate.toDateString();
    });
  }, [activeEvents, currentDate]);

  // View Switching Logic
  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'out') {
      if (viewType === 'day') setViewType('month');
      else if (viewType === 'month') setViewType('year');
    } else {
      if (viewType === 'year') setViewType('month');
      else if (viewType === 'month') setViewType('day');
    }
  };

  /**
   * INTERACTION: Toggles calendar visibility and triggers targeted sync.
   */
  const handleToggleCalendar = (id: string | number) => {
    console.log(`[CalendarView] TOGGLE/SYNC TARGET: ${id}`);
    
    const isNowSelected = !selectedCalendarIds.includes(id);
    
    setSelectedCalendarIds(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );

    if (isNowSelected && typeof id === 'number') {
      console.log(`[CalendarView] EXECUTING TARGETED RE-SYNC FOR ID: ${id}`);
      refreshAll(id);
    }
  };

  /**
   * MANAGEMENT: Bridge for Administrative Actions
   */
  const handleInitOmVrti = async () => {
    const activeProvider = connections.find(c => c.isConnected)?.vendorName || 'google';
    console.log(`[CalendarView] INITIALIZING OMVRTII ON: ${activeProvider}`);
    await createOmVrtiCalendar(activeProvider);
  };
  const targetRef = useRef(null);
  usePinch(
    ({ offset: [d], last }) => {
      if (last) {
        if (d > 1.2) handleZoom('in');
        else if (d < 0.8) handleZoom('out');
      }
    },
    { target: targetRef }
  );

  return (
    <DepthLayout
      title="Fleet Schedule"
      showBack
      headerContent={
        <div className="mt-2 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col text-left">
              <h2 className="text-xl font-black text-white">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] leading-none">
                  {viewType} View
                </span>
                {loading && <RefreshCw size={10} className="text-primary animate-spin" />}
              </div>
            </div>

            <div className="flex gap-1 bg-white/5 p-1 rounded-2xl backdrop-blur-sm border border-white/5">
              {(['day', 'month', 'year'] as ViewType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setViewType(type)}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    viewType === type 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <CalendarSelector 
            calendars={allCalendars} 
            selectedIds={selectedCalendarIds} 
            onToggle={handleToggleCalendar} 
          />
        </div>
      }
    >
      <div 
        ref={targetRef} 
        className="touch-none flex flex-col gap-6 mb-24 py-2"
      >
        {/* Hierarchy Level 0: Fleet Management 
            Visible primarily in 'Year' view or as a drawer (Simplified here as header-proximal section)
        */}
        {viewType === 'year' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CalendarManagement 
              calendars={allCalendars} 
              onSetPrimary={makePrimary} 
              onCreateOmVrti={handleInitOmVrti} 
            />
          </motion.div>
        )}

        {/* Error Handling with Diagnostic Panel */}
        {error && (
          <DiagnosticPanel 
            error={error} 
            baseUrl={(api as any).baseUrl} 
            onRetry={refreshAll} 
          />
        )}

        <AnimatePresence mode="wait">
          {viewType === 'day' && (
            <motion.div
              key="day-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <DayTimeline 
                events={dailyEvents} 
                selectedDate={currentDate} 
                onRefresh={refreshAll} 
              />
            </motion.div>
          )}

          {viewType === 'month' && (
            <motion.div
              key="month-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <MonthHeatmap 
                events={activeEvents} 
                currentDate={currentDate} 
                onDateSelect={(d) => {
                  setCurrentDate(d);
                  setViewType('day');
                }} 
              />
            </motion.div>
          )}

          {viewType === 'year' && (
            <motion.div
              key="year-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <YearStrategic 
                events={activeEvents} 
                currentDate={currentDate} 
                onMonthSelect={(m) => {
                  const d = new Date(currentDate);
                  d.setMonth(m);
                  setCurrentDate(d);
                  setViewType('month');
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button (FAB) for Resync */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
         onClick={() => refreshAll()}
        className="fixed bottom-24 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-40 border border-white/20 active:bg-orange-600"
      >
        <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
      </motion.button>

      {/* Zoom Hint (Visual feedback for gesture) */}
      <div className="fixed bottom-24 left-8 p-3 bg-black/50 backdrop-blur-md rounded-full text-white/40 flex items-center gap-2 border border-white/5 pointer-events-none z-40">
        <ZoomIn size={14} />
        <span className="text-[8px] font-black uppercase tracking-widest">Pinch to Zoom</span>
      </div>
    </DepthLayout>
  );
}
