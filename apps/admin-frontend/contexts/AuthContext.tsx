import React, { createContext, useContext, useMemo } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { AuthResponse, loginAPI, logoutAPI } from "@/utils/auth";
import { adminAPI } from "@/utils/api";
import { API_URL } from "@/types/apis";

type AuthContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: {
    id: number;
    username: string;
  };
  login: (username: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<AuthResponse>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const fetcher = async (url: string) => {
  const response = await adminAPI.get(url);
  return response.data;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data, error, mutate } = useSWR(API_URL.AUTH.CHECK, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  const isLoading = !data && !error;
  const isAuthenticated = data?.isAuthenticated ?? false;
  const user = data?.user;

  const login = async (username: string, password: string) => {
    const result = await loginAPI(username, password);
    if (result.success) {
      await mutate();
      router.push("/student");
    }
    return result;
  };

  const logout = async () => {
    const result = await logoutAPI();
    if (result.success) {
      await mutate(null, false);
      router.push("/login", undefined, { shallow: true });
    }
    return result;
  };

  const value = useMemo(
    () => ({ isLoading, isAuthenticated, user, login, logout }),
    [isAuthenticated, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
