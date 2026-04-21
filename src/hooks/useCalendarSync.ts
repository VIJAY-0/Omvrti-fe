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
  const refreshAll = useCallback(async (targetCalendarId?: string) => {
    console.log('[useCalendarSync] REFRESHING CALENDAR DATA...', targetCalendarId ? `(Target: ${targetCalendarId})` : '(Full)');
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

    // Load calendars for all connected providers
    const calendarResults = await Promise.all(allProviders.map(p => loadCalendarsForProvider(p as string)));
    const flatCalendars = calendarResults.flat();
    setCalendars(flatCalendars);

    // Dynamic Event Loading: If a target ID is provided, we only sync that. Otherwise, we sync primaries.
    const eventResults = await Promise.all(allProviders.map(p => {
      // If targetCalendarId is provided, we use it. Otherwise, default to 'primary'.
      // Note: In a multi-provider setup, we might need more complex logic to map ID to provider.
      return loadEventsForCalendar(p as string, targetCalendarId || 'primary');
    }));
    
    const flatEvents = eventResults.flat();
    setEvents(flatEvents);
    
    setLoading(false);
  }, [loadVendors, loadConnections, loadCalendarsForProvider, loadEventsForCalendar]);

  /**
   * Management Actions
   */
  const makePrimary = useCallback(async (provider: string, calendarId: string) => {
    try {
      setLoading(true);
      await calendarSyncApi.setPrimaryCalendar(provider, calendarId);
      await refreshAll(calendarId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [refreshAll]);

  const createOmVrtiCalendar = useCallback(async (provider: string) => {
    try {
      setLoading(true);
      await calendarSyncApi.createOmVrtiCalendar(provider);
      await refreshAll();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [refreshAll]);

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
    makePrimary,
    createOmVrtiCalendar,
    api: calendarSyncApi
  };
}
