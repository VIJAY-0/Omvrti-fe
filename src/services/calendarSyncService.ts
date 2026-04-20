/**
 * Calendar Sync API Client
 */

class CalendarSyncClient {
  private baseUrl: string;

  constructor(baseUrl: string = (import.meta as any).env.VITE_CALENDAR_SYNC_API_BASE_URL || 'http://localhost:8080') {
    this.baseUrl = baseUrl;
  }

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

  async getAuthUrl(provider: string): Promise<string> {
    const response = await this.request<{ url: string }>('GET', `/api/auth/${provider}/url`);
    return response.url;
  }

  async checkAuthStatus(provider: string): Promise<boolean> {
    const response = await this.request<{ authenticated: boolean }>(
      'GET',
      `/api/auth/${provider}/status`
    );
    return response.authenticated;
  }

  async logout(provider: string): Promise<boolean> {
    const response = await this.request<{ success: boolean }>(
      'POST',
      `/api/auth/${provider}/logout`
    );
    return response.success;
  }

  // ============ Sync Endpoints ============

  async getSyncConnections(): Promise<any[]> {
    return this.request<any[]>('GET', '/api/sync/connections');
  }

  async getSyncConnection(id: number): Promise<any> {
    return this.request<any>('GET', `/api/sync/connections/${id}`);
  }

  async triggerSync(syncId: number, provider: string): Promise<string> {
    return this.request<string>('POST', `/api/sync/sync/${syncId}?provider=${provider}`);
  }

  async getSyncStatus(id: number): Promise<string> {
    return this.request<string>('GET', `/api/sync/status/${id}`);
  }

  async disconnectVendor(id: number): Promise<string> {
    return this.request<string>('DELETE', `/api/sync/connections/${id}`);
  }

  // ============ Calendar Endpoints ============

  async listCalendars(provider: string): Promise<any[]> {
    const response = await this.request<{ calendars: any[] }>(
      'GET',
      `/api/calendar/${provider}/list`
    );
    return response.calendars;
  }

  async getEvents(
    provider: string,
    calendarId: string = 'primary'
  ): Promise<any[]> {
    const response = await this.request<{ events: any[] }>(
      'GET',
      `/api/calendar/${provider}/events?calendarId=${calendarId}`
    );
    return response.events;
  }

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

  async registerWebhook(
    cuSyncCalendarId: number,
    provider: string
  ): Promise<string> {
    return this.request(
      'POST',
      `/api/webhooks/calendar/register?cuSyncCalendarId=${cuSyncCalendarId}&provider=${provider}`
    );
  }

  async unregisterWebhook(webhookId: string): Promise<string> {
    return this.request('DELETE', `/api/webhooks/calendar/${webhookId}`);
  }
}

export const calendarSyncApi = new CalendarSyncClient();
export default CalendarSyncClient;
