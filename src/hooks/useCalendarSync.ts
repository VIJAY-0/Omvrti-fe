import { useState, useCallback, useEffect } from 'react';
import { 
  calendarSyncApi, 
  SyncConnection, 
  CalendarEntry, 
  CalendarEvent, 
  Vendor 
} from '../services/calendarSyncService';

/**
 * Custom hook to manage calendar synchronization state and operations.
 * Centralizes data fetching for vendors, active connections, calendars, and events.
 */
export function useCalendarSync() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [connections, setConnections] = useState<SyncConnection[]>([]);
  const [calendars, setCalendars] = useState<CalendarEntry[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches all available calendar vendors supported by the platform.
   */
  const loadVendors = useCallback(async () => {
    try {
      console.log('[useCalendarSync] FETCHING VENDORS...');
      const data = await calendarSyncApi.getVendors();
      console.log('[useCalendarSync] VENDORS RECEIVED:', data);
      setVendors(data);
      return data;
    } catch (err: any) {
      console.error('[useCalendarSync] FAILED TO FETCH VENDORS:', err);
      // We don't set global error for vendor load as it's secondary to primary connections
      return [];
    }
  }, []);

  /**
   * Fetches active sync connections established by the user.
   */
  const loadConnections = useCallback(async () => {
    try {
      console.log('[useCalendarSync] FETCHING CONNECTIONS...');
      setLoading(true);
      const data = await calendarSyncApi.getSyncConnections();
      console.log('[useCalendarSync] CONNECTIONS RECEIVED:', data);
      setConnections(data);
      return data;
    } catch (err: any) {
      console.error('[useCalendarSync] FAILED TO FETCH CONNECTIONS:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches a list of calendars for a specific connection.
   */
  const loadCalendarsForProvider = useCallback(async (provider: string) => {
    try {
      console.log(`[useCalendarSync] FETCHING CALENDARS FOR ${provider}...`);
      const data = await calendarSyncApi.listCalendars(provider);
      console.log(`[useCalendarSync] CALENDARS FOR ${provider} RECEIVED:`, data);
      return data.map(cal => ({ ...cal, provider }));
    } catch (err: any) {
      console.error(`[useCalendarSync] FAILED TO FETCH CALENDARS FOR ${provider}:`, err);
      return [];
    }
  }, []);

  /**
   * Fetches events for a specific calendar ID under a provider.
   */
  const loadEventsForCalendar = useCallback(async (provider: string, calendarId: string) => {
    try {
      console.log(`[useCalendarSync] FETCHING EVENTS FOR ${provider}/${calendarId}...`);
      const data = await calendarSyncApi.getEvents(provider, calendarId);
      console.log(`[useCalendarSync] EVENTS FOR ${provider}/${calendarId} RECEIVED:`, {
        count: data.length,
        events: data
      });
      return data.map(evt => ({ ...evt, provider, calendarId }));
    } catch (err: any) {
      console.error(`[useCalendarSync] FAILED TO FETCH EVENTS FOR ${provider}/${calendarId}:`, err);
      return [];
    }
  }, []);

  /**
   * Orchestrates a full refresh of all calendar-related data.
   */
  const refreshAll = useCallback(async () => {
    console.log('[useCalendarSync] REFRESHING ALL CALENDAR DATA...');
    setLoading(true);
    
    // Parallel load of vendors and connections
    const [_, conns] = await Promise.all([loadVendors(), loadConnections()]);
    
    const allProviders = Array.from(new Set(conns.filter(c => c.isConnected).map(c => c.vendorName)));
    console.log('[useCalendarSync] IDENTIFIED CONNECTED PROVIDERS:', allProviders);
    
    if (allProviders.length === 0) {
      console.log('[useCalendarSync] NO CONNECTED PROVIDERS FOUND.');
      setCalendars([]);
      setEvents([]);
      setLoading(false);
      return;
    }

    // Load state for all connected providers in parallel
    console.log(`[useCalendarSync] LOADING CALENDARS FOR ${allProviders.length} PROVIDERS...`);
    const calendarResults = await Promise.all(allProviders.map(p => loadCalendarsForProvider(p as string)));
    const flatCalendars = calendarResults.flat();
    console.log('[useCalendarSync] TOTAL CALENDARS LOADED:', flatCalendars.length);
    setCalendars(flatCalendars);

    // Default: Load events for primary calendars
    console.log(`[useCalendarSync] LOADING EVENTS FOR PRIMARY CALENDARS...`);
    const eventResults = await Promise.all(allProviders.map(p => loadEventsForCalendar(p as string, 'primary')));
    const flatEvents = eventResults.flat();
    console.log('[useCalendarSync] TOTAL EVENTS LOADED:', flatEvents.length);
    setEvents(flatEvents);
    
    setLoading(false);
  }, [loadVendors, loadConnections, loadCalendarsForProvider, loadEventsForCalendar]);

  // Initial data load on mount
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return {
    vendors,
    connections,
    calendars,
    events,
    loading,
    error,
    refreshAll,
    loadEventsForCalendar,
    api: calendarSyncApi
  };
}
