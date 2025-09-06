// utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/',
  withCredentials: true, // send/receive cookies
});

// ---- Response interceptor: guard against loops ----
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const path = window.location.pathname;
    const reqUrl = err.config?.url || '';

    if (status === 401) {
      // 1) Don't redirect if you're already on /login
      // 2) Don't redirect because of the is-auth ping itself
      const isAuthCheck = reqUrl.includes('/user/is-auth');

      if (!isAuthCheck && !path.startsWith('/login')) {
        // use replace to avoid stacking history & remount loops
        window.location.replace('/login');
      }
    }
    return Promise.reject(err);
  }
);

export default api;
