import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);
const SESSION_KEY = 'admin_session';
const TOKEN_KEY = 'token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch { /* corrupted storage — ignore */ }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { token, user: userData } = res.data.data;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
