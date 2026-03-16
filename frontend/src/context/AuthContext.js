import React, { createContext, useContext, useState, useCallback } from 'react';
import * as api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const stored = localStorage.getItem('userInfo');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.login({ email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUserInfo(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (username, email, password, fullName) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.register({ username, email, password, fullName });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUserInfo(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  }, []);

  const updateUserInfo = useCallback((updatedData) => {
    const merged = { ...userInfo, ...updatedData };
    localStorage.setItem('userInfo', JSON.stringify(merged));
    setUserInfo(merged);
  }, [userInfo]);

  return (
    <AuthContext.Provider
      value={{ userInfo, loading, error, login, register, logout, updateUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
