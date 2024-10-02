import { API_URL } from "@/types/apis";
import { adminAPI } from "./api";

export type AuthResponse = {
  success: boolean;
  message: string;
  token?: string;
};

// TODO: URL들을 상수 객체로 관리하도록 리팩토링
export const registerAPI = async (
  username: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const response = await adminAPI.post<AuthResponse>(API_URL.AUTH.REGISTER, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const loginAPI = async (
  username: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const response = await adminAPI.post<AuthResponse>(API_URL.AUTH.LOGIN, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutAPI = async (): Promise<AuthResponse> => {
  try {
    const response = await adminAPI.post<AuthResponse>(API_URL.AUTH.LOGOUT);
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
