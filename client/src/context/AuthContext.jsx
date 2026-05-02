import { createContext, useContext, useState, useEffect } from 'react';
import config from '../config/config';

// Edit admin credentials in src/config/config.js → admin.email / admin.password
const AuthContext = createContext(null);
const SESSION_KEY = 'admin_session';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on page load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch { /* corrupted storage — ignore */ }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    if (email === config.admin.email && password === config.admin.password) {
      const adminUser = { name: 'Admin', email };
      localStorage.setItem(SESSION_KEY, JSON.stringify(adminUser));
      setUser(adminUser);
      return adminUser;
    }
    throw new Error('Invalid email or password.');
  };

  const logout = () => {
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
