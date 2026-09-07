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
        if (token.startsWith('demo_')) {
          const savedUser = localStorage.getItem('fraudshield_user');
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch {
              setUser(getFallbackDemoUser(token));
            }
          } else {
            setUser(getFallbackDemoUser(token));
          }
          setIsLoading(false);
          return;
        }

        const res = await fetchApi('/auth/me');
        if (res.success && res.data?.user) {
          setUser(res.data.user);
        } else {
          // If backend isn't available, allow demo mode fallback
          setUser(getFallbackDemoUser('demo_analyst'));
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [token]);

  const getFallbackDemoUser = (t: string): IUser => ({
    id: 'demo-user-1',
    email: t.includes('admin') ? 'admin@fraudshield.io' : 'analyst@fraudshield.io',
    fullName: t.includes('admin') ? 'System Administrator' : 'Senior Fraud Analyst',
    role: (t.includes('admin') ? 'ADMIN' : 'ANALYST') as any,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const login = (newToken: string, refreshToken: string, newUser: IUser) => {
    localStorage.setItem('fraudshield_token', newToken);
    localStorage.setItem('fraudshield_refresh', refreshToken);
    localStorage.setItem('fraudshield_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('fraudshield_token');
    localStorage.removeItem('fraudshield_refresh');
    localStorage.removeItem('fraudshield_user');
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
