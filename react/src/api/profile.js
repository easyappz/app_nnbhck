import instance from './axios';

// GET /api/profile/me/
export const getMe = () => {
  return instance.get('/api/profile/me/');
};
