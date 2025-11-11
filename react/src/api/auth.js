import instance from './axios';
import './interceptors';

export async function login({ email, password }) {
  const res = await instance.post('/auth/token/', { email, password });
  const { access, refresh } = res?.data || {};
  if (access) localStorage.setItem('token', access);
  if (refresh) localStorage.setItem('refreshToken', refresh);
  return res.data;
}

export async function refresh(refreshToken) {
  const res = await instance.post('/auth/token/refresh/', { refresh: refreshToken });
  const { access } = res?.data || {};
  if (access) localStorage.setItem('token', access);
  return res.data;
}

export async function register(payload) {
  const res = await instance.post('/auth/register/', payload);
  return res.data;
}
