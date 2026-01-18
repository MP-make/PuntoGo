'use client'

import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  savedAddress: string;
  phone?: string;
  reference?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string) => {
    const newUser = {
      name: 'Marlon Pecho',
      email,
      savedAddress: 'Calle Ficticia 123',
      phone: '987654321',
      reference: ''
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => {
      const updated = prev ? { ...prev, ...updates } : null;
      if (updated) {
        localStorage.setItem('user', JSON.stringify(updated));
      } else {
        localStorage.removeItem('user');
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};