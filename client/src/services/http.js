import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const http = axios.create({
  baseURL
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('dreamerportal_token');
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('dreamerportal_token');
      window.dispatchEvent(new CustomEvent('dreamerportal:unauthorized'));
    }

    return Promise.reject(error);
  }
);
