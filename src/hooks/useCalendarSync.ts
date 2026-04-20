import { useState, useCallback, useEffect } from 'react';
import { calendarSyncApi } from '../services/calendarSyncService';

export function useCalendarSync() {
  const [connections, setConnections] = useState<any[]>([]);
  const [calendars, setCalendars] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const refreshAll = useCallback(async () => {
    console.log('[useCalendarSync] REFRESHING ALL CALENDAR DATA...');
    setLoading(true);
    const conns = await loadConnections();
    
    const allProviders = Array.from(new Set(conns.filter(c => c.isConnected).map(c => c.vendorName)));
    console.log('[useCalendarSync] IDENTIFIED CONNECTED PROVIDERS:', allProviders);
    
    if (allProviders.length === 0) {
      console.log('[useCalendarSync] NO CONNECTED PROVIDERS FOUND.');
      setCalendars([]);
      setEvents([]);
      setLoading(false);
      return;
    }

    // Load all calendars for all connected providers
    console.log(`[useCalendarSync] LOADING CALENDARS FOR ${allProviders.length} PROVIDERS...`);
    const calendarPromises = allProviders.map(p => loadCalendarsForProvider(p as string));
    const calendarResults = await Promise.all(calendarPromises);
    const flatCalendars = calendarResults.flat();
    console.log('[useCalendarSync] TOTAL CALENDARS LOADED:', flatCalendars.length);
    setCalendars(flatCalendars);

    // Load events for primary calendars of each provider by default
    console.log(`[useCalendarSync] LOADING EVENTS FOR PRIMARY CALENDARS...`);
    const eventPromises = allProviders.map(p => loadEventsForCalendar(p as string, 'primary'));
    const eventResults = await Promise.all(eventPromises);
    const flatEvents = eventResults.flat();
    console.log('[useCalendarSync] TOTAL EVENTS LOADED:', flatEvents.length);
    setEvents(flatEvents);
    
    setLoading(false);
  }, [loadConnections, loadCalendarsForProvider, loadEventsForCalendar]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return {
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
