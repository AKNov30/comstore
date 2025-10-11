

// Application configuration
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
  },
  app: {
    name: 'ComStore',
    version: '1.0.0',
  },
  features: {
    enableAnalytics: import.meta.env.PROD,
    enableDebugMode: import.meta.env.DEV,
  },
} as const;
