import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import localforage from 'localforage';
import { User, UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';

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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.name || email.split('@')[0],
      role: data.user.user_metadata.role || 'buyer',
      region: data.user.user_metadata.region || 'Hargeisa',
      language: data.user.user_metadata.language || 'en',
      createdAt: data.user.created_at,
    };

    await localforage.setItem('user', user);
    setAuthState(prev => ({
      ...prev,
      user,
      isAuthenticated: true,
    }));

    return user;
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: 'tempPassword123', // Will be replaced by actual password from form
      options: {
        data: {
          name: userData.name,
          role: userData.role,
          region: userData.region,
          language: userData.language,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;

    const newUser: User = {
      id: data.user!.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      region: userData.region,
      language: userData.language,
      createdAt: data.user!.created_at,
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

export const useAuthActions = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    await localforage.removeItem('user');
    await localforage.removeItem('selectedRole');
    navigate('/auth/login', { replace: true });
  };

  const switchRole = async () => {
    await localforage.removeItem('selectedRole');
    navigate('/auth/login', { replace: true });
  };

  return { logout, switchRole };
};