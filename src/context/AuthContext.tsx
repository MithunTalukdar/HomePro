import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN' | 'SUPER_ADMIN';
  profileImage?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Event target to trigger global logout from outside React components (e.g., api.ts)
export const authEventTarget = new EventTarget();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleGlobalLogout = () => {
      logout();
    };

    authEventTarget.addEventListener('logout', handleGlobalLogout);
    return () => {
      authEventTarget.removeEventListener('logout', handleGlobalLogout);
    };
  }, []);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: User, authToken: string) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
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
