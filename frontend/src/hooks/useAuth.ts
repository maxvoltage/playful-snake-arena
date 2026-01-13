import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '@/types/game';
import { api } from '@/api/mockApi';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const result = await api.auth.getCurrentUser();
      if (result.success && result.data) {
        setAuthState({
          user: result.data,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const result = await api.auth.login(username, password);
    if (result.success && result.data) {
      setAuthState({
        user: result.data,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const signup = useCallback(async (username: string, email: string, password: string) => {
    const result = await api.auth.signup(username, email, password);
    if (result.success && result.data) {
      setAuthState({
        user: result.data,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const logout = useCallback(async () => {
    await api.auth.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return {
    ...authState,
    login,
    signup,
    logout,
  };
}
