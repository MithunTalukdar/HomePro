import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { fetchApi } from '../services/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN' | 'SUPER_ADMIN';
  profileImage?: string;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isValidating: boolean;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (partialData: Partial<User>) => void;
  validateSession: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const authEventTarget = new EventTarget();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  }, []);

  const login = useCallback((userData: User, authToken: string) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(authToken);
  }, []);

  const updateUser = useCallback((partialData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...partialData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Active session validation against backend
  const validateSession = useCallback(async (): Promise<boolean> => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      return false;
    }

    setIsValidating(true);
    try {
      const freshUser = await fetchApi('/users/profile');
      if (freshUser && freshUser._id) {
        setUser((prev) => {
          const merged = { ...prev, ...freshUser };
          localStorage.setItem('user', JSON.stringify(merged));
          return merged;
        });
        return true;
      }
      return false;
    } catch (err: any) {
      if (err.status === 401) {
        console.warn('Session expired or unauthorized. Logging out.');
        logout();
      }
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [logout]);

  const refreshUser = useCallback(async () => {
    await validateSession();
  }, [validateSession]);

  // Global logout event listener
  useEffect(() => {
    const handleGlobalLogout = () => {
      logout();
    };

    authEventTarget.addEventListener('logout', handleGlobalLogout);
    return () => {
      authEventTarget.removeEventListener('logout', handleGlobalLogout);
    };
  }, [logout]);

  // Cross-tab synchronization via storage event
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        if (!e.newValue) {
          setUser(null);
          setToken(null);
        } else {
          setToken(e.newValue);
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch {
              // Ignore parse error
            }
          }
        }
      } else if (e.key === 'user' && e.newValue) {
        try {
          setUser(JSON.parse(e.newValue));
        } catch {
          // Ignore parse error
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Initialize auth on mount & validate session
  useEffect(() => {
    const initializeAuth = async () => {
      let hasCredentials = false;
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setToken(storedToken);
          hasCredentials = true;
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }

      // Background session validation if credentials existed
      if (hasCredentials) {
        validateSession();
      }
    };

    initializeAuth();
  }, [validateSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isValidating,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        updateUser,
        validateSession,
        refreshUser,
      }}
    >
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
