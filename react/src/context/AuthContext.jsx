import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { obtainToken, refreshToken as refreshTokenApi, register as registerApi } from '../api/auth';
import { getMe } from '../api/profile';

const AuthContext = createContext({
  accessToken: null,
  refreshToken: null,
  user: null,
  loading: true,
  login: async (_email, _password) => {},
  register: async (_data) => {},
  logout: () => {},
  setUser: (_user) => {},
});

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveTokens = useCallback((access, refresh) => {
    // axios instance expects token under key 'token'
    if (access) {
      localStorage.setItem('token', access);
      setAccessToken(access);
    }
    if (refresh) {
      localStorage.setItem('refreshToken', refresh);
      setRefreshToken(refresh);
    }
  }, []);

  const clearTokens = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setRefreshToken(null);
  }, []);

  const fetchProfile = useCallback(async () => {
    const { data } = await getMe();
    setUser(data);
    return data;
  }, []);

  const tryRefresh = useCallback(async () => {
    const storedRefresh = localStorage.getItem('refreshToken');
    if (!storedRefresh) return false;
    try {
      const { data } = await refreshTokenApi(storedRefresh);
      if (data?.access) {
        saveTokens(data.access, storedRefresh);
        return true;
      }
      return false;
    } catch (_e) {
      return false;
    }
  }, [saveTokens]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await obtainToken(email, password);
      saveTokens(data.access, data.refresh);
      await fetchProfile();
      return true;
    } catch (error) {
      clearTokens();
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchProfile, saveTokens, clearTokens]);

  const register = useCallback(async (formData) => {
    // formData should include email and password according to spec
    setLoading(true);
    try {
      await registerApi(formData);
      await login(formData.email, formData.password);
      return true;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setLoading(false);
  }, [clearTokens]);

  const loadFromStorage = useCallback(async () => {
    setLoading(true);
    const storedAccess = localStorage.getItem('token');
    const storedRefresh = localStorage.getItem('refreshToken');

    if (!storedAccess && !storedRefresh) {
      setLoading(false);
      return;
    }

    if (storedAccess) {
      setAccessToken(storedAccess);
    }
    if (storedRefresh) {
      setRefreshToken(storedRefresh);
    }

    try {
      await fetchProfile();
    } catch (e) {
      // try refresh once if profile fetch fails
      const refreshed = await tryRefresh();
      if (refreshed) {
        try {
          await fetchProfile();
        } catch (_e) {
          logout();
        }
      } else {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [fetchProfile, tryRefresh, logout]);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const value = useMemo(() => ({
    accessToken,
    refreshToken,
    user,
    loading,
    login,
    logout,
    register,
    setUser,
  }), [accessToken, refreshToken, user, loading, login, logout, register]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
