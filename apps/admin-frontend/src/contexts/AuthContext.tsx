import type React from "react";
import { createContext, useCallback, useContext, useMemo } from "react";
import { useRouter } from "next/router";
import { type AuthResponse, loginAPI, logoutAPI } from "@/utils/auth";
import { adminAPI } from "@/utils/api";
import { API_URL } from "@/types/apis";

type AuthContextType = {
  user?: {
    id: number;
    username: string;
  };
  login: (username: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<AuthResponse>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // useCallback으로 login 함수 캐싱
  const login = useCallback(
    async (username: string, password: string) => {
      const result = await loginAPI(username, password);
      // console.log(result);
      if (result.success) {
        router.push("/student");
      }
      return result;
    },
    [router],
  );

  const logout = useCallback(async () => {
    const result = await logoutAPI();
    if (result.success) {
      router.push("/login", undefined, { shallow: true });
    }
    return result;
  }, [router]);

  const value = useMemo(() => ({ login, logout }), [login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
