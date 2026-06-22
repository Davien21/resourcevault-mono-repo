import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { PublicUser, UserRole } from "@resourcevault/types";
import { api } from "@/lib/api";

interface AuthContextValue {
  user: PublicUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (...roles: UserRole[]) => boolean;
  setUser: (user: PublicUser | null) => void;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const { user } = await api.me();
      setUser(user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const logout = async () => {
    await api.logout().catch(() => {});
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    hasRole: (...roles) => Boolean(user && roles.includes(user.role)),
    setUser,
    refresh,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
