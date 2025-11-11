import instance from './axios';

export const getMe = async () => {
  const res = await instance.get('/api/profile/me/');
  return res.data; // UserWithProfile
};

export const updateMe = async (payload, method = 'patch') => {
  const httpMethod = method.toLowerCase() === 'put' ? 'put' : 'patch';
  const res = await instance[httpMethod]('/api/profile/me/', payload);
  return res.data; // UserWithProfile
};

export default {
  getMe,
  updateMe,
};
