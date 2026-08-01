import React, { createContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setToken(storedToken);
      } catch (err) {
        console.error('Failed to parse stored auth user', err);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
    // Default to unauthenticated session requiring explicit login
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    const role = userData.role || 'Employee';
    const formattedUser = {
      ...userData,
      role: role,
      name: userData.name || (role.toLowerCase() === 'director' ? 'Sarah Vance (Director)' : 'Vrushali Nalawade'),
    };
    setUser(formattedUser);
    setToken(authToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(formattedUser));
    localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  };

  const hasRole = (role) => {
    if (!user || !user.role) return false;
    return user.role.toLowerCase() === role.toLowerCase();
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;