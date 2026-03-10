// Standardized API Base URL. 
// In development, we point to the local server on 3000.
// In production, we use an empty string so requests are relative to the current domain.
export const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:3000' : '';
