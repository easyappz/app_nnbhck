import instance from './axios';

// Auth API based on openapi.yml
export const login = async (email, password) => {
  const res = await instance.post('/api/auth/token/', { email, password });
  return res.data; // { access, refresh }
};

export const register = async (payload) => {
  // payload should match RegisterRequest schema
  const res = await instance.post('/api/auth/register/', payload);
  return res.data; // UserWithProfile
};

export const refreshToken = async (refresh) => {
  const res = await instance.post('/api/auth/token/refresh/', { refresh });
  return res.data; // { access }
};

export default {
  login,
  register,
  refreshToken,
};
