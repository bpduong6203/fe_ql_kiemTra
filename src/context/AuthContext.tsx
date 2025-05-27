import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface AuthContextType {
  isLoggedIn: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('user'));

  const checkAuth = async () => {
    if (localStorage.getItem('user')) {
      try {
        await apiFetch('/auth/validate', { method: 'GET' });
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
        localStorage.removeItem('user');
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}