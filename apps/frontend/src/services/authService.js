import { api, setAccessToken, setRefreshToken } from './api';

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  const { user, tokens } = data.data;
  setAccessToken(tokens.accessToken);
  setRefreshToken(tokens.refreshToken);
  return user;
}

export async function register(payload) {
  const { data } = await api.post('/auth/register', payload);
  const { user, tokens } = data.data;
  setAccessToken(tokens.accessToken);
  setRefreshToken(tokens.refreshToken);
  return user;
}

export async function logout() {
  try { await api.post('/auth/logout'); } catch (_) { /* ignore */ }
  setAccessToken(null);
  setRefreshToken(null);
}

export async function me() {
  const { data } = await api.get('/auth/me');
  return data.data.user;
}

export async function updateProfile(payload) {
  const { data } = await api.patch('/users/me', payload);
  return data.data.user;
}

export async function changePassword(payload) {
  const { data } = await api.patch('/users/me/password', payload);
  return data.data;
}
