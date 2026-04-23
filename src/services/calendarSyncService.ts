/**
 * Calendar Sync API Client
 * Auto-generated against the actual backend. Copy to your frontend project and use directly.
 *
 * All methods return the unwrapped `data` field from ApiResponse<T>.
 * On error the request throws with { message, code, details } attached.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Response shapes — matched 1-to-1 with backend DTOs
// ─────────────────────────────────────────────────────────────────────────────

/** GET /api/calendar/connections/vendors */
export interface Vendor {
  id: number;
  name: string;
  displayName: string;
  vendorType: string;
  isNewConnection: boolean;
  authType: string;
}

/** GET /api/calendar/connections  |  GET /api/calendar/connections/{id} */
export interface SyncConnection {
  id: number;
  vendorName: string;
  syncEmail: string;
  displayName: string;
  isConnected: boolean;
  isTokenExpired: boolean;
  lastSyncDate: string;
  accessTokenExpiryDate: string;
}

/**
 * DB-synced calendar record.
 * Returned by the /sync/* endpoints (POST & GET /api/calendar/sync/{provider}/calendars
 * and PUT /api/calendar/sync/calendars/{id}/toggle).
 */
export interface CalendarEntry {
  id: number;  
  summary:string;          // DB primary key (cuSyncCalendarId)
  syncCalendarId: string; // Provider-assigned calendar ID
  displayName: string;
  color?: string;
  timeZone: string;
  isPrimary: boolean;
  isWritable: boolean;
  isSyncOn: boolean;
  provider?: string;     // Appended client-side for UI routing
}

/**
 * DB-synced event record.
 * Returned by GET /api/calendar/sync/calendars/{id}/events.
 */
export interface CalendarEvent {
  id: number;
  syncEventId: string;
  title: string;
  description?: string;
  location?: string;
  eventStartDate: string;
  eventEndDate: string;
  eventTimeZone: string;
  isAllDayEvent: boolean;
  lastSyncDate: string;
  provider?: string;   // Appended client-side for UI routing
  calendarId?: number; // DB id of the source CalendarEntry
}

/**
 * Pass-through calendar item.
 * Returned by GET /api/calendar/{provider}/list — live from the provider, not persisted.
 * Fields match CalendarListResponse.CalendarItem in the backend.
 */
export interface ProviderCalendar {
  id: string;
  summary: string;
  description: string | null;
  timeZone: string | null;
  color: string | null;
  primary: boolean;
  writable: boolean;
}

/**
 * Pass-through event item.
 * Returned by GET /api/calendar/{provider}/events — live from the provider, not persisted.
 * Fields match EventResponse in the backend.
 */
export interface ProviderEvent {
  id: string;
  summary: string;
  description: string | null;
  location: string | null;
  startDateTime: string | null; // ISO OffsetDateTime — null for all-day events
  endDateTime: string | null;
  startDate: string | null;     // ISO LocalDate — set for all-day events
  endDate: string | null;
}

/**
 * Created / quick-added event.
 * Returned by POST /api/calendar/{provider}/events and POST /api/calendar/{provider}/quick-add.
 * Fields match CreateEventResponse in the backend.
 */
export interface CreatedEvent {
  id: string;
  summary: string;
  status: string;
  htmlLink: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Client
// ─────────────────────────────────────────────────────────────────────────────

class CalendarSyncClient {
  private baseUrl: string;

  constructor(
    baseUrl: string =
      (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_CALENDAR_SYNC_API_BASE_URL : undefined) ||
      'http://localhost:8080'
  ) {
    this.baseUrl = baseUrl;
  }

  /** Universal request handler — unwraps ApiResponse<T>.data and logs every call. */
  private async request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
    const requestId = Math.random().toString(36).substring(7);
    const url = `${this.baseUrl}${endpoint}`;

    console.log(`[API][${requestId}] ${method} ${url}`, { body, ts: new Date().toISOString() });

    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body !== undefined) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      console.error(`[API][${requestId}] ERROR ${response.status}`, data);
      const err = new Error(data.message || `API Error: ${response.status}`);
      (err as any).code = data.code;
      (err as any).details = data.details;
      throw err;
    }

    console.log(`[API][${requestId}] OK`, { data, ts: new Date().toISOString() });
    return data.data as T;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // AUTH  —  /api/auth/{provider}/...
  // ─────────────────────────────────────────────────────────────────────────────

  /** Returns the OAuth authorisation URL to open in a popup. */
  async getAuthUrl(provider: string): Promise<string> {
    const res = await this.request<{ url: string }>('GET', `/api/auth/${provider}/url`);
    return res.url;
  }

  /** Returns true when the user has a live (non-expired) token for this provider. */
  async checkAuthStatus(provider: string): Promise<boolean> {
    const res = await this.request<{ authenticated: boolean }>('GET', `/api/auth/${provider}/status`);
    return res.authenticated;
  }

  /** Revokes tokens and removes the sync connection for this provider. */
  async logout(provider: string): Promise<boolean> {
    const res = await this.request<{ success: boolean }>('POST', `/api/auth/${provider}/logout`);
    return res.success;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CONNECTIONS  —  /api/calendar/connections/...
  // ─────────────────────────────────────────────────────────────────────────────

  /** Lists all available OAuth vendors (Google, Outlook, etc.). */
  async getVendors(): Promise<Vendor[]> {
    return this.request<Vendor[]>('GET', '/api/calendar/connections/vendors');
  }

  /** Returns all OAuth connections the user has established. */
  async getSyncConnections(): Promise<SyncConnection[]> {
    return this.request<SyncConnection[]>('GET', '/api/calendar/connections');
  }

  /** Returns a single connection by its DB id. */
  async getSyncConnection(id: number): Promise<SyncConnection> {
    return this.request<SyncConnection>('GET', `/api/calendar/connections/${id}`);
  }

  /**
   * Triggers a full sync for a connection (re-fetches all calendars + events
   * for every isSyncOn=true calendar). Uses the connection's stored token — no
   * provider param needed.
   */
  async triggerSync(connectionId: number): Promise<string> {
    return this.request<string>('POST', `/api/calendar/connections/${connectionId}/sync`);
  }

  /** Returns "Active" or "Token Expired" for the given connection. */
  async getConnectionStatus(id: number): Promise<string> {
    return this.request<string>('GET', `/api/calendar/connections/${id}/status`);
  }

  /** Permanently removes a sync connection and all associated data. */
  async disconnectVendor(id: number): Promise<string> {
    return this.request<string>('DELETE', `/api/calendar/connections/${id}`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CALENDAR SYNC (DB-backed)  —  /api/calendar/sync/...
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Fetches the user's calendars from the provider and upserts them into the DB.
   * New calendars default to isSyncOn=false.
   */
  async discoverCalendars(provider: string): Promise<CalendarEntry[]> {
    const data = await this.request<CalendarEntry[]>('POST', `/api/calendar/sync/${provider}/calendars`);
    return data.map(cal => ({ ...cal, provider }));
  }

  /**
   * Returns all calendars stored in DB for this user.
   * Does NOT call the provider.
   */
  async listLocalCalendars(provider: string): Promise<CalendarEntry[]> {
    const data = await this.request<CalendarEntry[]>('GET', `/api/calendar/sync/${provider}/calendars`);
    return data.map(cal => ({ ...cal, provider }));
  }

  /**
   * Toggles sync on/off for a specific calendar.
   * ON  → immediately fetches all events from the provider into DB.
   * OFF → marks isSyncOn=false; existing events are preserved.
   */
  async toggleCalendarSync(cuSyncCalendarId: number, syncOn: boolean): Promise<CalendarEntry> {
    return this.request<CalendarEntry>(
      'PUT',
      `/api/calendar/sync/calendars/${cuSyncCalendarId}/toggle`,
      { syncOn }
    );
  }

  /**
   * Full hydration: re-fetches all calendars, then syncs events for every
   * calendar that has isSyncOn=true. Updates sync cursor and lastSyncDate.
   */
  async performFullHydration(provider: string): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>(
      'POST',
      `/api/calendar/sync/${provider}/full`
    );
  }

  /**
   * Smart event fetch (DB-backed).
   * Returns events from DB if data is fresh (<15 min). Re-syncs from provider if stale.
   * Throws if sync is disabled for this calendar.
   */
  async getSmartEvents(cuSyncCalendarId: number, provider?: string): Promise<CalendarEvent[]> {
    const data = await this.request<CalendarEvent[]>(
      'GET',
      `/api/calendar/sync/calendars/${cuSyncCalendarId}/events`
    );
    return data.map(evt => ({ ...evt, provider, calendarId: cuSyncCalendarId }));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CALENDAR PASS-THROUGH  —  /api/calendar/{provider}/...
  // Live calls to the provider — data is NOT persisted. Use the /sync/* endpoints above
  // to persist data and avoid hitting provider rate limits on every render.
  // ─────────────────────────────────────────────────────────────────────────────

  /** Returns the user's calendars live from the provider (no DB write). */
  async listCalendars(provider: string): Promise<ProviderCalendar[]> {
    const res = await this.request<{ calendars: ProviderCalendar[] }>(
      'GET',
      `/api/calendar/${provider}/list`
    );
    return res.calendars;
  }

  /** Returns events live from the provider for the given calendar. */
  async getEvents(provider: string, calendarId: string = 'primary'): Promise<ProviderEvent[]> {
    const res = await this.request<{ events: ProviderEvent[] }>(
      'GET',
      `/api/calendar/${provider}/events?calendarId=${calendarId}`
    );
    return res.events;
  }

  /** Creates a new event in the target calendar. */
  async createEvent(
    provider: string,
    event: { title: string; description?: string; location?: string; start: string; end: string },
    calendarId: string = 'primary'
  ): Promise<CreatedEvent> {
    return this.request<CreatedEvent>(
      'POST',
      `/api/calendar/${provider}/events?calendarId=${calendarId}`,
      event
    );
  }

  /** Creates an event from a natural language string (provider-dependent). */
  async quickAddEvent(
    provider: string,
    text: string,
    calendarId: string = 'primary'
  ): Promise<CreatedEvent> {
    return this.request<CreatedEvent>(
      'POST',
      `/api/calendar/${provider}/quick-add?calendarId=${calendarId}`,
      { text }
    );
  }

  /** Deletes an event by its provider ID. */
  async deleteEvent(
    provider: string,
    eventId: string,
    calendarId: string = 'primary'
  ): Promise<boolean> {
    const res = await this.request<{ success: boolean }>(
      'DELETE',
      `/api/calendar/${provider}/events/${eventId}?calendarId=${calendarId}`
    );
    return res.success;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // NOT YET IMPLEMENTED — backend endpoints do not exist yet
  // ─────────────────────────────────────────────────────────────────────────────

  // TODO: POST /api/calendar/{provider}/primary
  // async setPrimaryCalendar(provider: string, calendarId: string): Promise<boolean>

  // TODO: POST /api/calendar/{provider}/create
  // async createOmVrtiCalendar(provider: string): Promise<CalendarEntry>

  // TODO: POST /api/webhooks/calendar/register
  // async registerWebhook(cuSyncCalendarId: number, provider: string): Promise<string>

  // TODO: DELETE /api/webhooks/calendar/{webhookId}
  // async unregisterWebhook(webhookId: string): Promise<string>
}

export const calendarSyncApi = new CalendarSyncClient();
export default CalendarSyncClient;

// ─────────────────────────────────────────────────────────────────────────────
// Usage examples
// ─────────────────────────────────────────────────────────────────────────────

/*

const api = new CalendarSyncClient('http://localhost:8080');

// 1. Auth flow (popup)
async function connectGoogle() {
  const url = await api.getAuthUrl('google');
  const popup = window.open(url, 'auth', 'width=500,height=600');
  window.addEventListener('message', async (event) => {
    if (event.data.type === 'OAUTH_AUTH_SUCCESS') {
      popup?.close();
      // Calendars are already synced to DB by the backend post-auth hook.
      // Just list them:
      const calendars = await api.listLocalCalendars('google');
      console.log('Calendars in DB:', calendars);
    }
  });
}

// 2. List connections
const connections = await api.getSyncConnections();
connections.forEach(c => console.log(`${c.vendorName}: ${c.syncEmail}`));

// 3. Toggle sync on for a calendar
const updated = await api.toggleCalendarSync(42, true);
console.log('Sync ON for', updated.displayName);

// 4. Fetch events from DB (smart — auto re-syncs if stale)
const events = await api.getSmartEvents(42, 'google');
events.forEach(e => console.log(e.title, e.eventStartDate));

// 5. Create event via provider (pass-through)
const created = await api.createEvent('google', {
  title: 'Team Meeting',
  description: 'Weekly sync',
  location: 'Room A',
  start: '2026-04-22T10:00:00+00:00',
  end:   '2026-04-22T11:00:00+00:00',
});
console.log('Created:', created.id);

// 6. Full sync for a connection by its DB id
await api.triggerSync(1);

// 7. Disconnect
await api.disconnectVendor(1);

*/

// ─────────────────────────────────────────────────────────────────────────────
// React hook example
// ─────────────────────────────────────────────────────────────────────────────

/*

import { useState, useCallback, useEffect } from 'react';

export function useCalendarSync(provider: string) {
  const [api] = useState(() => new CalendarSyncClient());
  const [connections, setConnections] = useState<SyncConnection[]>([]);
  const [calendars, setCalendars] = useState<CalendarEntry[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async <T>(fn: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadConnections = useCallback(
    () => run(async () => setConnections(await api.getSyncConnections())),
    [api, run]
  );

  const loadCalendars = useCallback(
    () => run(async () => setCalendars(await api.listLocalCalendars(provider))),
    [api, provider, run]
  );

  const loadEvents = useCallback(
    (calendarId: number) =>
      run(async () => setEvents(await api.getSmartEvents(calendarId, provider))),
    [api, provider, run]
  );

  useEffect(() => { loadConnections(); }, [loadConnections]);

  return { connections, calendars, events, loading, error, api, loadConnections, loadCalendars, loadEvents };
}

*/
