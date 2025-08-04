import { useState, useEffect } from 'react';
import localforage from 'localforage';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    role: null,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await localforage.getItem<User>('user');
      const role = await localforage.getItem<UserRole>('selectedRole');
      
      setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        role,
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
      });
    }
  };

  const login = async (email: string, password: string) => {
    // Mock authentication - replace with actual Firebase/Supabase auth
    const mockUser: User = {
      id: '1',
      email,
      name: 'John Farmer',
      role: 'buyer',
      region: 'Hargeisa',
      language: 'en',
      createdAt: new Date().toISOString(),
    };

    await localforage.setItem('user', mockUser);
    setAuthState(prev => ({
      ...prev,
      user: mockUser,
      isAuthenticated: true,
    }));

    return mockUser;
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    // Mock registration
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    await localforage.setItem('user', newUser);
    setAuthState(prev => ({
      ...prev,
      user: newUser,
      isAuthenticated: true,
    }));

    return newUser;
  };

  const setRole = async (role: UserRole) => {
    await localforage.setItem('selectedRole', role);
    setAuthState(prev => ({
      ...prev,
      role,
    }));
  };

  const switchRole = async (newRole: UserRole) => {
    await localforage.setItem('selectedRole', newRole);
    // Force page reload to reset app state
    window.location.reload();
  };

  const logout = async () => {
    await localforage.removeItem('user');
    await localforage.removeItem('selectedRole');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      role: null,
    });
  };

  return {
    ...authState,
    login,
    register,
    setRole,
    switchRole,
    logout,
    checkAuthStatus,
  };
};