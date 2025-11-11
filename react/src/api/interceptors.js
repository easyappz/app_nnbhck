import instance from './axios';

// Configure baseURL from environment or fallback
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';
if (instance.defaults.baseURL !== API_BASE_URL) {
  instance.defaults.baseURL = API_BASE_URL;
}

let isRefreshing = false;
let subscribers = [];

const subscribeTokenRefresh = (callback) => {
  subscribers.push(callback);
};

const onRefreshed = (newToken) => {
  subscribers.forEach((cb) => cb(newToken));
  subscribers = [];
};

const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

// Add a response interceptor to handle 401 and refresh token
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config || {};
    const status = error?.response?.status;

    // Only handle 401 errors with a valid original request
    if (status === 401 && originalRequest && !originalRequest._retry) {
      // Avoid refresh loop for auth endpoints
      const url = typeof originalRequest.url === 'string' ? originalRequest.url : '';
      if (
        url.includes('/auth/token/') ||
        url.includes('/auth/token/refresh/')
      ) {
        clearAuth();
        return Promise.reject(error);
      }

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        clearAuth();
        return Promise.reject(error);
      }

      // Mark request so we don't try to refresh multiple times for the same request
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue the request until the token refresh is done
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            try {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              resolve(instance(originalRequest));
            } catch (e) {
              reject(e);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await instance.post('/auth/token/refresh/', { refresh: refreshToken });
        const newAccess = res?.data?.access;
        if (!newAccess) {
          clearAuth();
          isRefreshing = false;
          return Promise.reject(error);
        }

        localStorage.setItem('token', newAccess);
        isRefreshing = false;
        onRefreshed(newAccess);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
        return instance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        clearAuth();
        return Promise.reject(refreshError);
      }
    }

    // If it's not a 401 or already retried, reject
    return Promise.reject(error);
  }
);

export default instance;
