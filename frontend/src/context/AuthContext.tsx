import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authAPI } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "worker" | "admin";
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  isApproved?: boolean;
  workerProfile?: {
    jobCategories: string[];
    experience: number;
    hourlyRate: number;
    skills: string[];
    availability: string;
    serviceAreas: string[];
    averageRating?: number;
    numberOfRatings?: number;
  };
  stripeAccountId?: string;
  stripeOnboardingComplete?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  register: (data: any) => Promise<any>;
  verifyOTP: (email: string, otp: string) => Promise<any>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        const response = await authAPI.getMe();
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem("token");
        setTokenState(null);
        setUser(null);
      }
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      await refreshUser();
      setLoading(false);
    };
    loadUser();
  }, []);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  const register = async (data: any) => {
    const response = await authAPI.register(data);
    return response.data;
  };

  const verifyOTP = async (email: string, otp: string) => {
    const response = await authAPI.verifyOTP({ email, otp });
    const { token: newToken, user: newUser } = response.data;
    setToken(newToken);
    setUser(newUser);
    return response.data;
  };

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    const { token: newToken, user: newUser } = response.data;
    setToken(newToken);
    setUser(newUser);
    return response.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
        verifyOTP,
        setUser,
        setToken,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
