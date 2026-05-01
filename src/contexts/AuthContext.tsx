import React, { createContext, useContext, useEffect, useState } from "react";

export type AppUserRole = "client" | "photographer" | "admin";

export interface AppUser {
  uid: string;
  email: string | null;
  role: AppUserRole;
  name: string | null;
}

interface AuthContextType {
  appUser: AppUser | null;
  loading: boolean;
  signIn: (email?: string, name?: string, isSignUp?: boolean, password?: string) => Promise<void>;
  login: (userData: any) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("mock_auth_user");
    if (storedUser) {
      setAppUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: any) => {
    const userToLogin: AppUser = {
      uid: userData.uid,
      email: userData.email,
      name: userData.name,
      role: userData.role as AppUserRole
    };
    setAppUser(userToLogin);
    localStorage.setItem("mock_auth_user", JSON.stringify(userToLogin));
  };

  const signIn = async (email?: string, name?: string, isSignUp?: boolean, password?: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'password123', name, isSignUp })
      });
      if (!response.ok) {
        throw new Error("Invalid credentials or server error");
      }
      const data = await response.json();
      login(data);
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const signOut = async () => {
    setAppUser(null);
    localStorage.removeItem("mock_auth_user");
  };

  return (
    <AuthContext.Provider value={{ appUser, loading, signIn, login, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
