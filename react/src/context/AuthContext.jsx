import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import * as authApi from '../api/auth';
import * as profileApi from '../api/profile';

const AuthContext = createContext({
  user: null,
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [initTried, setInitTried] = useState(false);

  const setTokens = useCallback((access, refresh) => {
    setAccessToken(access || null);
    if (access) {
      localStorage.setItem('token', access);
    } else {
      localStorage.removeItem('token');
    }

    if (typeof refresh !== 'undefined') {
      setRefreshToken(refresh || null);
      if (refresh) {
        localStorage.setItem('refreshToken', refresh);
      } else {
        localStorage.removeItem('refreshToken');
      }
    }
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const data = await profileApi.getMe();
      setUser(data);
    } catch (e) {
      console.error('Failed to fetch profile', e);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const storedAccess = localStorage.getItem('token');
    const storedRefresh = localStorage.getItem('refreshToken');
    if (storedAccess) {
      setTokens(storedAccess, storedRefresh || null);
      fetchMe().finally(() => setInitTried(true));
    } else {
      setInitTried(true);
    }
  }, [fetchMe, setTokens]);

  const login = useCallback(async (email, password) => {
    const tokens = await authApi.login(email, password);
    setTokens(tokens.access, tokens.refresh);
    await fetchMe();
    message.success('Вы успешно вошли');
  }, [fetchMe, setTokens]);

  const register = useCallback(async (payload) => {
    await authApi.register(payload);
    // After register, perform login using provided credentials
    const tokens = await authApi.login(payload.email, payload.password);
    setTokens(tokens.access, tokens.refresh);
    await fetchMe();
    message.success('Регистрация прошла успешно');
  }, [fetchMe, setTokens]);

  const logout = useCallback(() => {
    setUser(null);
    setTokens(null, null);
    message.info('Вы вышли из аккаунта');
  }, [setTokens]);

  const value = useMemo(() => ({
    user,
    accessToken,
    refreshToken,
    login,
    register,
    logout,
    initTried,
  }), [user, accessToken, refreshToken, login, register, logout, initTried]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
