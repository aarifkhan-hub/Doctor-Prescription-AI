import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' },
});

/* Token storage */
export const setAccessToken = (t) => {
  if (t) localStorage.setItem('accessToken', t);
  else localStorage.removeItem('accessToken');
};
export const setRefreshToken = (t) => {
  if (t) localStorage.setItem('refreshToken', t);
  else localStorage.removeItem('refreshToken');
};
export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

/* Request interceptor */
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* Response interceptor with refresh flow */
let isRefreshing = false;
let queue = [];
const flushQueue = (err, token = null) => {
  queue.forEach((p) => (err ? p.reject(err) : p.resolve(token)));
  queue = [];
};

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry && getRefreshToken()) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => queue.push({ resolve, reject }))
          .then((t) => { original.headers.Authorization = `Bearer ${t}`; return api(original); });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const { data } = await axios.post(`${API}/auth/refresh`, { refreshToken: getRefreshToken() });
        const { accessToken, refreshToken } = data.data.tokens;
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        flushQueue(null, accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (err) {
        flushQueue(err, null);
        setAccessToken(null);
        setRefreshToken(null);
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
