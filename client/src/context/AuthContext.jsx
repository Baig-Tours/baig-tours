import { createContext, useState, useEffect, useCallback } from 'react';
import { loginRequest, logoutRequest, getMeRequest } from '../api/authApi';

export const AuthContext = createContext(undefined);

/**
 * AuthContext — the single source of truth for admin session state.
 * On mount it calls GET /api/auth/me (via getMeRequest) to check whether
 * the httpOnly cookie still represents a valid session, since the
 * frontend never reads the JWT itself. ProtectedRoute reads `isLoading`
 * and `admin` from this context to decide whether to render or redirect.
 */
export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getMeRequest();
      setAdmin(res.data);
    } catch {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (email, password) => {
    const res = await loginRequest(email, password);
    setAdmin(res.data);
    return res.data;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setAdmin(null);
    }
  };

  const value = {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    login,
    logout,
    refreshSession: checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
