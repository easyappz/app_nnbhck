import instance from './axios';
import './interceptors';

export async function getMe() {
  const res = await instance.get('/profile/me/');
  return res.data;
}

export async function updateMe(data) {
  const res = await instance.patch('/profile/me/', data);
  return res.data;
}
