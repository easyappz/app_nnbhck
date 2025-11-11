import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth';
import * as profileApi from '../api/profile';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [initTried, setInitTried] = useState(false);

  const loadProfile = useCallback(async () => {
    const me = await profileApi.getMe();
    setUser(me);
    return me;
  }, []);

  const login = useCallback(async (email, password) => {
    const tokens = await authApi.login(email, password);
    localStorage.setItem('token', tokens.access);
    localStorage.setItem('refresh', tokens.refresh);
    setAccessToken(tokens.access);
    setRefreshToken(tokens.refresh);
    await loadProfile();
  }, [loadProfile]);

  const register = useCallback(async (payload) => {
    // Register user, then login using provided credentials
    await authApi.register(payload);
    await login(payload.email, payload.password);
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const lsAccess = localStorage.getItem('token');
        const lsRefresh = localStorage.getItem('refresh');
        if (lsAccess) setAccessToken(lsAccess);
        if (lsRefresh) setRefreshToken(lsRefresh);

        if (lsAccess) {
          await loadProfile();
        } else if (lsRefresh) {
          try {
            const res = await authApi.refreshToken(lsRefresh);
            localStorage.setItem('token', res.access);
            if (!mounted) return;
            setAccessToken(res.access);
            await loadProfile();
          } catch (e) {
            logout();
          }
        }
      } catch (e) {
        // If anything goes wrong, ensure clean state
        logout();
      } finally {
        if (mounted) setInitTried(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [loadProfile, logout]);

  const value = useMemo(() => ({
    user,
    setUser,
    accessToken,
    refreshToken,
    initTried,
    login,
    register,
    logout,
  }), [user, accessToken, refreshToken, initTried, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
