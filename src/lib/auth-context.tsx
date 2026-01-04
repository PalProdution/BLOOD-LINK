"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Donor, Hospital } from './types';
import { getCurrentUser, setCurrentUser, logout as storeLogout, initializeMockData } from './store';

interface AuthContextType {
  user: Donor | Hospital | null;
  loading: boolean;
  setUser: (user: Donor | Hospital | null) => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<Donor | Hospital | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeMockData();
    const storedUser = getCurrentUser();
    setUserState(storedUser);
    setLoading(false);
  }, []);

  const setUser = (newUser: Donor | Hospital | null) => {
    setUserState(newUser);
    setCurrentUser(newUser);
  };

  const logout = () => {
    storeLogout();
    setUserState(null);
  };

  const refreshUser = () => {
    const storedUser = getCurrentUser();
    setUserState(storedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, refreshUser }}>
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
