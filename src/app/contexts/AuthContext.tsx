import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  AUTH_SESSION_EVENT,
  clearStoredUser,
  getStoredUser,
  hasValidGoogleIdToken,
  setStoredUser,
} from '../services/googleSession';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  idToken?: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  canUseCloudSave: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const syncUserFromStorage = () => {
      const savedUser = getStoredUser();

      if (!savedUser) {
        setUser(null);
        return;
      }

      if (savedUser.idToken && !hasValidGoogleIdToken(savedUser.idToken)) {
        setUser(null);
        clearStoredUser();
        return;
      }

      setUser(savedUser);
    };

    syncUserFromStorage();
    window.addEventListener(AUTH_SESSION_EVENT, syncUserFromStorage);

    return () => {
      window.removeEventListener(AUTH_SESSION_EVENT, syncUserFromStorage);
    };
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setStoredUser(userData);
  };

  const logout = () => {
    setUser(null);
    clearStoredUser();
  };

  useEffect(() => {
    if (!user?.idToken) {
      return;
    }

    const syncGoogleSession = () => {
      if (!hasValidGoogleIdToken(user.idToken)) {
        setUser(null);
        clearStoredUser();
      }
    };

    syncGoogleSession();

    const intervalId = window.setInterval(syncGoogleSession, 60_000);

    return () => window.clearInterval(intervalId);
  }, [user]);

  const canUseCloudSave = hasValidGoogleIdToken(user?.idToken);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        canUseCloudSave,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
