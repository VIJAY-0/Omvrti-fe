/**
 * Demo API services for OmVrti.ai
 */

export interface Trip {
  id: string;
  name: string;
  status: 'Accepted' | 'Pending';
  category: 'Autopilot' | 'Copilot' | 'Discover';
  purpose: string;
  budget: string;
  startDate: string;
  endDate: string;
  route: string;
  traveler: string;
  duration: string;
}

export interface Integration {
  provider: string;
  status: 'Connected' | 'Connect';
  type: 'Calendar' | 'Email';
}

export interface SyncSettings {
  autoSync: boolean;
  twoWay: boolean;
  notifications: boolean;
}

const MOCK_TRIPS: Trip[] = [
  {
    id: '0',
    name: 'Annual Business Summit',
    status: 'Accepted',
    category: 'Autopilot',
    purpose: 'Strategic Growth meeting',
    budget: '$2,500',
    startDate: 'June 1',
    endDate: 'June 5',
    route: 'SFO to NYC',
    traveler: 'Mr. Sam Watson',
    duration: '5 Days'
  },
  {
    id: '1',
    name: 'Tech Leadership Conference',
    status: 'Pending',
    category: 'Autopilot',
    purpose: 'Annual tech leadership meet',
    budget: '$1,800',
    startDate: 'July 15',
    endDate: 'July 18',
    route: 'SFO to SEA',
    traveler: 'Mr. Sam Watson',
    duration: '3 Days'
  },
  {
    id: '2',
    name: 'Marketing Strategy Workshop',
    status: 'Pending',
    category: 'Autopilot',
    purpose: 'Quarterly strategy workshop',
    budget: '$3,200',
    startDate: 'August 10',
    endDate: 'August 14',
    route: 'LHR to JFK',
    traveler: 'Mr. Sam Watson',
    duration: '4 Days'
  },
  {
    id: '3',
    name: 'Product Roadmap Review',
    status: 'Pending',
    category: 'Copilot',
    purpose: 'H2 Roadmap review',
    budget: '$1,200',
    startDate: 'September 5',
    endDate: 'September 7',
    route: 'SFO to AUS',
    traveler: 'Mr. Sam Watson',
    duration: '2 Days'
  }
];

const MOCK_INTEGRATIONS: Integration[] = [
  { provider: 'Google Calendar', status: 'Connected', type: 'Calendar' },
  { provider: 'Apple Calendar', status: 'Connect', type: 'Calendar' },
  { provider: 'Outlook Calendar', status: 'Connect', type: 'Calendar' },
  { provider: 'Calendly Calendar', status: 'Connected', type: 'Calendar' }
];

export const tripsApi = {
  getTrips: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_TRIPS;
  },
  getTripById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_TRIPS.find(t => t.id === id) || MOCK_TRIPS[0];
  },
  getCategoryStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      autopilot: { total: 20, accepted: 5 },
      copilot: { total: 15, accepted: 2 },
      discover: { total: 7, accepted: 0 },
      overall: 42
    };
  }
};

export const integrationApi = {
  getIntegrations: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return MOCK_INTEGRATIONS;
  },
  getSyncSettings: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      autoSync: true,
      twoWay: true,
      notifications: true
    };
  },
  updateSyncSettings: async (settings: SyncSettings) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return settings;
  }
};
