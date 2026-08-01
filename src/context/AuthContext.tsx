import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, org: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to restore session from stored token
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get<User>("/api/v1/auth/me")
      .then((u) => setUser(u))
      .catch(() => {
        localStorage.removeItem("access_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ access_token: string }>("/api/v1/auth/login", { email, password });
    localStorage.setItem("access_token", res.access_token);
    const me = await api.get<User>("/api/v1/auth/me");
    setUser(me);
  };

  const register = async (name: string, email: string, password: string, org: string) => {
    await api.post("/api/v1/auth/register", {
      name,
      email,
      password,
      organization_name: org,
    });
    // Auto-login after register
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
