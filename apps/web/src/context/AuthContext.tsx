import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../api/client';
import { IUser } from '@fraudshield/shared-types';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  login: (token: string, refreshToken: string, user: IUser) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('fraudshield_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        const res = await fetchApi('/auth/me');
        if (res.success && res.data?.user) {
          setUser(res.data.user);
        } else {
          logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [token]);

  const login = (newToken: string, refreshToken: string, newUser: IUser) => {
    localStorage.setItem('fraudshield_token', newToken);
    localStorage.setItem('fraudshield_refresh', refreshToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('fraudshield_token');
    localStorage.removeItem('fraudshield_refresh');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
