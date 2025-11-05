'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { getCurrentUser, setCurrentUser, getUsers } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password?: string) => Promise<User | null>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password?: string): Promise<User | null> => {
    const users = getUsers();
    
    // Try to find user by phone or username
    const foundUser = users.find(
      u => u.phone === identifier || u.username === identifier
    );

    if (foundUser) {
      setUser(foundUser);
      setCurrentUser(foundUser);
      return foundUser;
    }

    return null;
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

