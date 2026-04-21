import { useState, useMemo, useEffect } from 'react';
import { DepthLayout } from '../../components/common/DepthLayout';
import { useCalendarSync } from '../../hooks/useCalendarSync';

// Sub-components for better hierarchy and readability
import { CalendarHeader } from '../../components/calendar/CalendarHeader';
import { CalendarSelector } from '../../components/calendar/CalendarSelector';
import { DateStrip } from '../../components/calendar/DateStrip';
import { ScheduleList } from '../../components/calendar/ScheduleList';

// Static configuration for branding and systemic integration
const PROVIDER_COLORS: Record<string, string> = {
  'google': '#D84315',
  'microsoft': '#3A7BD5',
  'outlook': '#3A7BD5',
  'teams': '#4B53BC',
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

/**
 * CalendarView Page Component
 * 
 * This component provides a comprehensive schedule management interface.
 * It integrates live feeds from third-party providers with OmVrti's internal travel itineraries.
 * 
 * Refactored into a modular architecture:
 * - Logic managed by useCalendarSync hook.
 * - Presentation split into specialized components: Header, Selector, DateStrip, ScheduleList.
 */
export default function CalendarView() {
  const { calendars, events: apiEvents, loading, error, refreshAll } = useCalendarSync();
  
  // Local state for view control
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>(['sys-cal-1']);
  const [currentDate, setCurrentDate] = useState(new Date());

  /**
   * Data Normalization: Merge systemic calendars with API-fetched calendars.
   */
  const allCalendars = useMemo(() => {
    const apiCals = calendars.map(cal => ({
      id: cal.id,
      name: cal.summary,
      color: PROVIDER_COLORS[cal.provider.toLowerCase()] || '#888888',
      provider: cal.provider
    }));
    return [SYSTEM_CALENDAR, ...apiCals];
  }, [calendars]);

  /**
   * Effect: Auto-select all calendars on initial load for a "full view" start.
   */
  useEffect(() => {
    if (allCalendars.length > 0 && selectedCalendarIds.length === 1 && selectedCalendarIds[0] === 'sys-cal-1') {
      console.log('[CalendarView] AUTO-SELECTING ALL DISCOVERED CALENDARS');
      setSelectedCalendarIds(allCalendars.map(c => c.id));
    }
  }, [allCalendars]);

  /**
   * Data Normalization: Merge systemic events with API events and normalize schema for UI consumption.
   */
  const allEvents = useMemo(() => {
    console.log('[CalendarView] SYNCING EVENTS FOR RENDER GRID...');
    const normalizedApiEvents = apiEvents.map(evt => ({
      id: evt.id,
      calendarId: evt.calendarId || 'primary',
      title: evt.summary,
      start: evt.startDateTime || evt.startDate || '',
      end: evt.endDateTime || evt.endDate || '',
      location: evt.location,
      isTrip: false,
      provider: evt.provider
    }));
    return [...SYSTEM_EVENTS, ...normalizedApiEvents];
  }, [apiEvents]);

  /**
   * View Logic: Compute the 7-day strip based on the currently selected date.
   */
  const currentWeek = useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [currentDate]);

  /**
   * Interaction: Toggles calendar visibility in the filter list.
   */
  const toggleCalendar = (id: string) => {
    console.log(`[CalendarView] FILTER TOGGLE: ${id}`);
    setSelectedCalendarIds(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  /**
   * Filtering: Extract events that match selected calendars and the chosen date.
   */
  const eventsForCurrentDay = useMemo(() => {
    const results = allEvents
      .filter(evt => selectedCalendarIds.includes(evt.calendarId))
      .filter(evt => {
        const evtDate = new Date(evt.start);
        return evtDate.toDateString() === currentDate.toDateString();
      })
      .sort((a, b) => a.start.localeCompare(b.start));
    
    console.log(`[CalendarView] CALCULATED ${results.length} EVENTS FOR ${currentDate.toDateString()}`);
    return results;
  }, [allEvents, selectedCalendarIds, currentDate]);

  return (
    <DepthLayout
      title="Calendar"
      showBack
      headerContent={
        <CalendarHeader 
          currentDate={currentDate} 
          loading={loading} 
          onRefresh={refreshAll} 
        />
      }
    >
      <div className="flex flex-col gap-8 mb-24 py-2">
        {/* Hierarchy Level 1: Navigation Context */}
        <div className="flex flex-col gap-2">
          <CalendarSelector 
            calendars={allCalendars} 
            selectedIds={selectedCalendarIds} 
            onToggle={toggleCalendar} 
          />
          <DateStrip 
            currentWeek={currentWeek} 
            selectedDate={currentDate} 
            onDateChange={setCurrentDate} 
          />
        </div>

        {/* Hierarchy Level 2: Primary Data Display 
            The ScheduleList handles internal loading and empty states.
        */}
        <ScheduleList 
          events={eventsForCurrentDay} 
          calendars={allCalendars}
          loading={loading}
          selectedDate={currentDate}
        />
      </div>
    </DepthLayout>
  );
}
