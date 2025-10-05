import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('jwt_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/login`;
  },
  
  logout: () => api.post('/auth/logout'),
  
  getCurrentUser: () => api.get('/auth/me')
};

// Household endpoints
export const households = {
  getAll: () => api.get('/api/households')
};

// Device endpoints
export const devices = {
  getGroups: (householdId) => api.get(`/api/households/${householdId}/groups`),
  
  getVolume: (groupId) => api.get(`/api/groups/${groupId}/volume`),
  
  setVolume: (groupId, volumeData) => api.post(`/api/groups/${groupId}/volume`, volumeData)
};

// Service endpoints
export const services = {
  getAll: (householdId) => api.get(`/api/households/${householdId}/services`)
};

export default api;
