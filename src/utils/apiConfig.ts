// In production, the API is served from the same domain under '/api'.
// In development, the Vite server proxies requests to the local Node server on port 3000.
// We use a blank string for production so it pings its own domain, and localhost:3000 for local testing.
export const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:3000/api' : '/api';
