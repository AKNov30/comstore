// API configuration
export const API_CONFIG = {
  baseUrl: 'https://68ea4d48f1eeb3f856e6da56.mockapi.io/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 123',
  },
} as const;

// Environment-based configuration
export const getApiConfig = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || API_CONFIG.baseUrl;
  const authToken = import.meta.env.VITE_API_TOKEN || '123';
  
  return {
    baseUrl,
    timeout: API_CONFIG.timeout,
    headers: {
      ...API_CONFIG.headers,
      'Authorization': `Bearer ${authToken}`,
    },
  };
};
