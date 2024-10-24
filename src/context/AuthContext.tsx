import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  signup: (email: string, username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const login = useCallback((user: User) => {
    setAuthState({
      user,
      isAuthenticated: true,
    });
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
  }, []);

  const signup = async (email: string, username: string, password: string) => {
    try {
      // In a real app, this would make an API call to create the user
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        username,
        createdAt: new Date(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      };
      
      login(newUser);
    } catch (error) {
      throw new Error('Failed to create account');
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, signup }}>
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