import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasInitializedAuth = useRef(false);

  useEffect(() => {
    if (hasInitializedAuth.current) {
      return;
    }
    hasInitializedAuth.current = true;

    const token = localStorage.getItem('dreamerportal_token');
    if (!token || token === 'undefined' || token === 'null') {
      localStorage.removeItem('dreamerportal_token');
      setIsLoading(false);
      return;
    }

    authService
      .verify()
      .then((response) => setUser(response.user))
      .catch(() => {
        localStorage.removeItem('dreamerportal_token');
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setIsLoading(false);
    };

    window.addEventListener('dreamerportal:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('dreamerportal:unauthorized', handleUnauthorized);
  }, []);

  const signup = async (payload) => {
    const response = await authService.signup(payload);
    localStorage.setItem('dreamerportal_token', response.token);
    setUser(response.user);
  };

  const login = async (payload) => {
    const response = await authService.login(payload);
    localStorage.setItem('dreamerportal_token', response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('dreamerportal_token');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isLoading, isAuthenticated: Boolean(user), signup, login, logout }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
