import axios from 'axios';
import { handleMockRequest, enableMock } from './mockAdapter';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Auto-enable mock if env var is set or if no backend configured
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_API_BASE_URL === '';
if (USE_MOCK) {
  enableMock(true);
}

let isRefreshing = false
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason: any) => void }> = []

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  failedQueue = []
}

const refreshApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Disable the 401 interceptor on refreshApi to avoid loops
refreshApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

const inflightRequests = new Map<string, Promise<any>>();

export function deduplicateRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
  if (inflightRequests.has(key)) {
    return inflightRequests.get(key)!;
  }
  const promise = requestFn().finally(() => {
    inflightRequests.delete(key);
  });
  inflightRequests.set(key, promise);
  return promise;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (!config.signal) {
    const controller = new AbortController();
    config.signal = controller.signal;
    const timeout = config.timeout || 30000;
    setTimeout(() => controller.abort(), timeout + 1000);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // If we're using mock and network succeeded, also cache the data shape
    return response;
  },
  async (error) => {
    if (axios.isCancel(error) || error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
      // Try mock fallback
      const mockResult = await tryMockFallback(error.config);
      if (mockResult) return mockResult;
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (!originalRequest) {
      // Try mock fallback
      const mockResult = await tryMockFallback(null);
      if (mockResult) return mockResult;
      return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (error.response?.status === 429 && originalRequest._retryCount < 3) {
      originalRequest._retryCount += 1;
      const delayMs = Math.min(originalRequest._retryCount * 2000, 10000);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return api(originalRequest);
    }

    // Network error or timeout → try mock fallback
    if (!error.response || error.code === 'ECONNABORTED') {
      const mockResult = await tryMockFallback(originalRequest);
      if (mockResult) return mockResult;

      if (originalRequest._retryCount < 1) {
        originalRequest._retryCount += 1;
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return api(originalRequest);
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await refreshApi.post('/auth/refresh-token', {});
        const newToken = data.data?.accessToken
        if (newToken) {
          localStorage.setItem('accessToken', newToken);
          processQueue(null, newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
        throw new Error('No access token in refresh response')
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('accessToken');
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error);
  }
);

async function tryMockFallback(config: any | null): Promise<any | null> {
  if (!config) return null;
  const method = (config.method || 'get').toUpperCase();
  const url = config.url || '';
  const result = await handleMockRequest(method, url, config.params, config.data);
  if (result.handled) return result.response;
  return null;
}

export default api;
export { API_BASE_URL, refreshApi };
