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
  const [syncedCalendarIds, setSyncedCalendarIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches all available calendar vendors supported by the platform.
   */
  const loadVendors = useCallback(async () => {
    console.log('[useCalendarSync] FETCHING VENDORS...'); 
    console.log('[useCalendarSync] FETCHING VENDORS...'); 
    console.log('[useCalendarSync] FETCHING VENDORS...'); 
    console.log('[useCalendarSync] FETCHING VENDORS...'); 
    console.log('[useCalendarSync] FETCHING VENDORS...'); 
    console.log('[useCalendarSync] FETCHING VENDORS...'); 
    console.log('[useCalendarSync] FETCHING VENDORS...'); 
    try {
      console.log('[useCalendarSync] FETCHING VENDORS...');
      const data = await calendarSyncApi.getVendors();
      setVendors(data);
      return data;
    } catch (err: any) {
      console.error('[useCalendarSync] FAILED TO FETCH VENDORS:', err);
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
   * Fetches the calendar list directly from the local DB (GET).
   */
  const loadLocalCalendarsForProvider = useCallback(async (provider: string) => {
    try {
      console.log(`[useCalendarSync] FETCHING LOCAL CALENDARS FOR ${provider}...`);
      const data = await calendarSyncApi.listLocalCalendars(provider);
      return data;
    } catch (err: any) {
      console.error(`[useCalendarSync] FAILED TO FETCH LOCAL CALENDARS FOR ${provider}:`, err);
      return [];
    }
  }, []);

  /**
   * Explicitly triggers a discovery request (POST) to fetch/upsert from provider.
   */
  const discoverCalendarsForProvider = useCallback(async (provider: string) => {
    try {
      console.log(`[useCalendarSync] DISCOVERING CALENDARS FOR ${provider}...`);
      const data = await calendarSyncApi.discoverCalendars(provider);
      return data;
    } catch (err: any) {
      console.error(`[useCalendarSync] FAILED TO DISCOVER CALENDARS FOR ${provider}:`, err);
      return [];
    }
  }, []);

  /**
   * Fetches events for a specific calendar ID (numeric) using Smart Fetch.
   */
  const loadEventsForCalendar = useCallback(async (cuSyncCalendarId: number, provider?: string) => {
    try {
      console.log(`[useCalendarSync] SMART FETCHING EVENTS FOR ID: ${cuSyncCalendarId}...`);
      const data = await calendarSyncApi.getSmartEvents(cuSyncCalendarId, provider);
      return data;
    } catch (err: any) {
      console.error(`[useCalendarSync] SMART FETCH FAILED FOR ID ${cuSyncCalendarId}:`, err);
      return [];
    }
  }, []);

  /**
   * Orchestrates a refresh of calendar data.
   * By default, it lists from DB (GET). Use forceDiscovery to hit provider (POST).
   */
  const refreshAll = useCallback(async (targetCuSyncCalendarId?: number, forceDiscovery = false) => {
    console.log('[useCalendarSync] REFRESHING DATA...', { targetCuSyncCalendarId, forceDiscovery });
    setLoading(true);
    
    // 1. Identify providers
    const vv = await loadVendors();   // 👈 ADD THIS
    const conns = await loadConnections();
    const allProviders = Array.from(new Set(conns.filter(c => c.isConnected).map(c => c.vendorName)));
    
    if (allProviders.length === 0) {
      setCalendars([]);
      setEvents([]);
      setLoading(false);
      return;
    }

    // 2. Load calendar lists (GET or POST)
    const calendarResults = await Promise.all(
      allProviders.map(p => 
        forceDiscovery 
          ? discoverCalendarsForProvider(p as string) 
          : loadLocalCalendarsForProvider(p as string)
      )
    );
    const flatCalendars = calendarResults.flat();
    setCalendars(flatCalendars);

    // Update syncedCalendarIds state based on DB status
    setSyncedCalendarIds(flatCalendars.filter(c => c.isSyncOn).map(c => c.id));

    // 3. Fetch events for active syncs
    let eventResults: CalendarEvent[][] = [];
    
    if (targetCuSyncCalendarId) {
      // Fetch specifically for the requested calendar
      const targetCal = flatCalendars.find(c => c.id === targetCuSyncCalendarId);
      const evts = await loadEventsForCalendar(targetCuSyncCalendarId, targetCal?.provider);
      eventResults = [evts];
    } else {
      // Fetch for ALL calendars that have sync toggled ON
      const activeSyncCalendars = flatCalendars.filter(c => c.isSyncOn);
      eventResults = await Promise.all(activeSyncCalendars.map(c => loadEventsForCalendar(c.id, c.provider)));
    }
    
    setEvents(eventResults.flat());
    setLoading(false);
  }, [loadConnections, loadLocalCalendarsForProvider, discoverCalendarsForProvider, loadEventsForCalendar]);

  /**
   * Toggles the sync state for a specific calendar.
   */
  const toggleSync = useCallback(async (cuSyncCalendarId: number) => {
    try {
      console.log(`[useCalendarSync] TOGGLING SYNC FOR ID: ${cuSyncCalendarId}`);
      
      // Determine next state
      const isCurrentlySynced = syncedCalendarIds.includes(cuSyncCalendarId);
      const nextSyncOn = !isCurrentlySynced;
      
      const result = await calendarSyncApi.toggleCalendarSync(cuSyncCalendarId, nextSyncOn);
      
      setSyncedCalendarIds(prev => 
        nextSyncOn ? [...prev, cuSyncCalendarId] : prev.filter(id => id !== cuSyncCalendarId)
      );

      // Reflect in local calendar list
      setCalendars(prev => prev.map(c => c.id === cuSyncCalendarId ? { ...c, isSyncOn: nextSyncOn } : c));

      // If enabled, fetch events immediately
      if (nextSyncOn) {
        await refreshAll(cuSyncCalendarId);
      } else {
        // If disabled, remove those events from local state
        setEvents(prev => prev.filter(e => e.calendarId !== cuSyncCalendarId));
      }
    } catch (err: any) {
      console.error('[useCalendarSync] TOGGLE SYNC FAILED:', err);
      setError(err.message);
    }
  }, [syncedCalendarIds, refreshAll]);

  /**
   * Performs a full hydration sync across all providers.
   */
  const fullSync = useCallback(async () => {
    try {
      setLoading(true);
      console.log('[useCalendarSync] INITIATING FULL PROVIDER HYDRATION');
      const conns = await loadConnections();
      const allProviders = Array.from(new Set(conns.filter(c => c.isConnected).map(c => c.vendorName)));
      await Promise.all(allProviders.map(p => calendarSyncApi.performFullHydration(p as string)));
      await refreshAll();
    } catch (err: any) {
      console.error('[useCalendarSync] FULL SYNC FAILED:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadConnections, refreshAll]);

  /**
   * Management Actions
   */
  const makePrimary = useCallback(async (provider: string, calendarId: string) => {
    try {
      setLoading(true);
      await calendarSyncApi.setPrimaryCalendar(provider, calendarId);
      await refreshAll();
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
    syncedCalendarIds,
    loading,
    error,
    refreshAll,
    toggleSync,
    fullSync,
    loadEventsForCalendar,
    makePrimary,
    createOmVrtiCalendar,
    api: calendarSyncApi
  };
}
