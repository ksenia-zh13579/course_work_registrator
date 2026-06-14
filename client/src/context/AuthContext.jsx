import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProfile()
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const res = await api.authLogin(credentials);
    const profile = await api.getProfile();
    setUser(profile.data);
    return res;
  };

  const register = async (userData) => {
    const res = await api.authRegister(userData);
    return res;
  };

  const logout = async () => {
    await api.authLogout();
    setUser(null);
  };

  const updateUser = (data) => setUser(prev => ({ ...prev, ...data }));

  const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
