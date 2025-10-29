/**
 * Application Configuration
 * Centralized configuration for API endpoints and environment-specific settings
 */

// Determine the API base URL based on environment
const getApiBaseUrl = (): string => {
  // 1. Check for explicit VITE_API_URL environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // 2. In development with Vite proxy, use relative path
  // This works for both local dev and GitHub Codespaces
  if (import.meta.env.DEV) {
    return '/api';
  }

  // 3. Fallback for production (should be set via VITE_API_URL)
  return '/api';
};

export const config = {
  apiBaseUrl: getApiBaseUrl(),
  
  // API timeout in milliseconds
  apiTimeout: 30000,
  
  // Environment flags
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

// Log configuration in development
if (config.isDev) {
  console.log('📝 App Configuration:', {
    apiBaseUrl: config.apiBaseUrl,
    mode: import.meta.env.MODE,
  });
}
