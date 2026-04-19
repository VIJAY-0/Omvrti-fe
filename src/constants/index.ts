export const COLORS = {
  primary: '#3A7BD5', // Vibrant Royal Blue
  secondary: '#FFFFFF',
  accent: '#D84315', // Action Orange
  success: '#4CAF50', // Accepted Green
  background: '#F8F9FA', // Base Canvas
  text: {
    primary: '#333333',
    secondary: '#666666',
    white: '#FFFFFF',
  },
  muted: '#C6D9F1', // Total Blue
  greenMuted: '#8BC34A',
  greenDark: '#2E7D32',
};

export const ROUTES = {
  TRIPS: {
    HOME: '/',
    PLANNING: '/trips/planning',
    AUTOPILOT: '/trips/autopilot',
    DETAILS: (id: string) => `/trips/${id}`,
    CONFIRMED: '/trips/confirmed',
  },
  INTEGRATION: {
    HOME: '/integration',
    LOGIN: '/integration/login',
    SUCCESS: '/integration/success',
    SETTINGS: '/integration/settings',
  },
};
