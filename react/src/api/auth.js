import instance from './axios';

// POST /api/auth/token/
export const obtainToken = (email, password) => {
  return instance.post('/api/auth/token/', { email, password });
};

// POST /api/auth/token/refresh/
export const refreshToken = (refresh) => {
  return instance.post('/api/auth/token/refresh/', { refresh });
};

// POST /api/auth/register/
export const register = (data) => {
  // data: { email, password, first_name?, last_name?, phone?, birth_date?, about? }
  return instance.post('/api/auth/register/', data);
};
