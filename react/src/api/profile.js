import instance from './axios';

export const getMe = async () => {
  const res = await instance.get('/api/profile/me/');
  return res.data; // UserWithProfile
};

export const updateMe = async (payload) => {
  const res = await instance.patch('/api/profile/me/', payload);
  return res.data; // UserWithProfile
};

export default {
  getMe,
  updateMe,
};
