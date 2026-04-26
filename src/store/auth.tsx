import { createContext, useContext, useState, useEffect } from "react";
import { AuthUser, Role } from "@/types/api.types";

const STORAGE_KEY = "edu-auth-storage";

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const defaultContext: AuthContextType = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setAuth: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export function useAuth() {
  return useContext(AuthContext);
}

function loadFromStorage(): { user: AuthUser | null; token: string | null } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { user: parsed.user, token: parsed.accessToken };
    }
  } catch {
    return { user: null, token: null };
  }
  return { user: null, token: null };
}

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const { user: storedUser, token } = loadFromStorage();
    if (storedUser && token) {
      setUser(storedUser);
      setAccessToken(token);
    }
    setIsReady(true);
  }, []);

  const setAuth = (user: AuthUser, token: string) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user, accessToken: token }),
    );
    setUser(user);
    setAccessToken(token);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setAccessToken(null);
  };

  if (!isReady) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        setAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
