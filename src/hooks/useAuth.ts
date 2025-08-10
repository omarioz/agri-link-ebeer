import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import localforage from 'localforage';
import { User, UserRole } from '@/types';
import { api, setAccessToken } from '@/services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  region: string;
  language: string;
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
    await api.login(email, password);
    const profile = await api.get('/profile/1/');

    const user: User = {
      id: profile.id,
      email: profile.email || email,
      name: profile.name || email.split('@')[0],
      role: (profile.role as UserRole) || 'buyer',
      region: 'Hargeisa',
      language: 'en',
      createdAt: new Date().toISOString(),
    };

    await localforage.setItem('user', user);
    await localforage.setItem('selectedRole', user.role);

    setAuthState(prev => ({
      ...prev,
      user,
      isAuthenticated: true,
      role: user.role,
    }));

    return user;
  };

  const register = async (userData: RegisterData) => {
    await api.register({
      username: userData.email,
      email: userData.email,
      password: userData.password,
      password2: userData.password,
      role: userData.role,
      name: userData.name,
    });

    return login(userData.email, userData.password);
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
    window.location.reload();
  };

  const logout = async () => {
    await localforage.removeItem('user');
    await localforage.removeItem('selectedRole');
    setAccessToken(null);
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

export const useAuthActions = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await localforage.removeItem('user');
    await localforage.removeItem('selectedRole');
    setAccessToken(null);
    navigate('/auth/login', { replace: true });
  };

  const switchRole = async () => {
    await localforage.removeItem('selectedRole');
    navigate('/auth/login', { replace: true });
  };

  return { logout, switchRole };
};
