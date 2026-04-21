/**
 * Calendar Sync API Client
 * This client provides methods to interact with the Calendar Sync backend service.
 * It handles authentication, synchronization, and calendar event management.
 */

export interface Vendor {
  id: number;
  name: string;
  displayName: string;
  vendorType: string;
  isNewConnection: boolean;
  authType: string;
}

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

export interface CalendarEntry {
  id: string;
  summary: string;
  timeZone: string;
  provider: string; // Unified provider field for UI
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  startDateTime?: string;
  endDateTime?: string;
  startDate?: string;
  endDate?: string;
  provider: string; // Unified provider field for UI
  calendarId: string; // Source calendar ID
}

class CalendarSyncClient {
  private baseUrl: string;

  constructor(baseUrl: string = (import.meta as any).env.VITE_CALENDAR_SYNC_API_BASE_URL || 'http://localhost:8080') {
    this.baseUrl = baseUrl;
  }

  /**
   * Universal request handler with centralized logging and error management.
   */
  private async request<T>(
    method: string,
    endpoint: string,
    body?: any
  ): Promise<T> {
    const requestId = Math.random().toString(36).substring(7);
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log(`[API REQUEST][${requestId}] ${method} ${url}`, {
      body,
      timestamp: new Date().toISOString()
    });

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        console.error(`[API ERROR][${requestId}] ${response.status}`, {
          data,
          timestamp: new Date().toISOString()
        });
        
        // Handle the standardized error format
        const error = new Error(data.message || `API Error: ${response.status}`);
        (error as any).code = data.code;
        (error as any).details = data.details;
        throw error;
      }

      console.log(`[API RESPONSE][${requestId}] SUCCESS`, {
        data,
        timestamp: new Date().toISOString()
      });

      return data.data;
    } catch (error) {
      if (!(error as any).code) {
        console.error(`[NETWORK ERROR][${requestId}]`, error);
      }
      throw error;
    }
  }

  // ============ Auth Endpoints ============

  /**
   * Generates a provider-specific OAuth URL to initiate authentication.
   */
  async getAuthUrl(provider: string): Promise<string> {
    const response = await this.request<{ url: string }>('GET', `/api/auth/${provider}/url`);
    return response.url;
  }

  /**
   * Checks if the user is currently authenticated with a specific provider.
   */
  async checkAuthStatus(provider: string): Promise<boolean> {
    const response = await this.request<{ authenticated: boolean }>(
      'GET',
      `/api/auth/${provider}/status`
    );
    return response.authenticated;
  }

  /**
   * Logs out from a specific calendar provider.
   */
  async logout(provider: string): Promise<boolean> {
    const response = await this.request<{ success: boolean }>(
      'POST',
      `/api/auth/${provider}/logout`
    );
    return response.success;
  }

  // ============ Sync Endpoints ============

  /**
   * Fetches the list of all available calendar vendors (Google, Outlook, etc.)
   */
  async getVendors(): Promise<Vendor[]> {
    return this.request<Vendor[]>('GET', '/api/sync/vendors');
  }

  /**
   * Fetches all active sync connections established by the user.
   */
  async getSyncConnections(): Promise<SyncConnection[]> {
    return this.request<SyncConnection[]>('GET', '/api/sync/connections');
  }

  /**
   * Fetches detailed information for a specific sync connection.
   */
  async getSyncConnection(id: number): Promise<SyncConnection> {
    return this.request<SyncConnection>('GET', `/api/sync/connections/${id}`);
  }

  /**
   * Manually triggers a synchronization cycle for a specific connection.
   */
  async triggerSync(syncId: number, provider: string): Promise<string> {
    return this.request<string>('POST', `/api/sync/sync/${syncId}?provider=${provider}`);
  }

  /**
   * Polls the synchronization status of a specific connection.
   */
  async getSyncStatus(id: number): Promise<string> {
    return this.request<string>('GET', `/api/sync/status/${id}`);
  }

  /**
   * Permenantly removes a sync connection.
   */
  async disconnectVendor(id: number): Promise<string> {
    return this.request<string>('DELETE', `/api/sync/connections/${id}`);
  }

  // ============ Calendar Endpoints ============

  /**
   * Lists all calendars available under a specific provider account.
   */
  async listCalendars(provider: string): Promise<CalendarEntry[]> {
    const response = await this.request<{ calendars: CalendarEntry[] }>(
      'GET',
      `/api/calendar/${provider}/list`
    );
    return response.calendars;
  }

  /**
   * Retrieves events from a specific calendar.
   */
  async getEvents(
    provider: string,
    calendarId: string = 'primary'
  ): Promise<CalendarEvent[]> {
    const response = await this.request<{ events: CalendarEvent[] }>(
      'GET',
      `/api/calendar/${provider}/events?calendarId=${calendarId}`
    );
    return response.events;
  }

  /**
   * Creates a new event in the target calendar.
   */
  async createEvent(
    provider: string,
    event: {
      title: string;
      description?: string;
      location?: string;
      start: string;
      end: string;
    },
    calendarId: string = 'primary'
  ): Promise<any> {
    return this.request('POST', `/api/calendar/${provider}/events?calendarId=${calendarId}`, event);
  }

  /**
   * Quickly creates an event using natural language processing (provider dependent).
   */
  async quickAddEvent(
    provider: string,
    text: string,
    calendarId: string = 'primary'
  ): Promise<any> {
    return this.request(
      'POST',
      `/api/calendar/${provider}/quick-add?calendarId=${calendarId}`,
      { text }
    );
  }

  /**
   * Sets a specific calendar as the primary calendar for the provider account.
   */
  async setPrimaryCalendar(provider: string, calendarId: string): Promise<boolean> {
    return this.request<boolean>(
      'POST',
      `/api/calendar/${provider}/primary?calendarId=${encodeURIComponent(calendarId)}`
    );
  }

  /**
   * Creates a specialized "OmVrti.ai" system calendar in the provider's ecosystem.
   */
  async createOmVrtiCalendar(provider: string): Promise<CalendarEntry> {
    return this.request<CalendarEntry>(
      'POST',
      `/api/calendar/${provider}/create`,
      { 
        summary: 'OmVrti.ai',
        description: 'Auto-pilot travel itineraries and logistics' 
      }
    );
  }

  /**
   * Deletes an event by its ID.
   */
  async deleteEvent(
    provider: string,
    eventId: string,
    calendarId: string = 'primary'
  ): Promise<boolean> {
    const response = await this.request<{ success: boolean }>(
      'DELETE',
      `/api/calendar/${provider}/events/${eventId}?calendarId=${calendarId}`
    );
    return response.success;
  }

  // ============ Webhook Endpoints ============

  /**
   * Registers a webhook to receive real-time updates from the calendar provider.
   */
  async registerWebhook(
    cuSyncCalendarId: number,
    provider: string
  ): Promise<string> {
    return this.request(
      'POST',
      `/api/webhooks/calendar/register?cuSyncCalendarId=${cuSyncCalendarId}&provider=${provider}`
    );
  }

  /**
   * Unregisters a previously active webhook.
   */
  async unregisterWebhook(webhookId: string): Promise<string> {
    return this.request('DELETE', `/api/webhooks/calendar/${webhookId}`);
  }
}

export const calendarSyncApi = new CalendarSyncClient();
export default CalendarSyncClient;
