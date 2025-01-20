import { API_URL } from "@/types/apis";
import { adminAPI } from "./api";
import { redirect } from "next/navigation";

export type AuthResponse = {
  success: boolean;
  message: string;
  token?: string;
};

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
    const { data } = await adminAPI.post<AuthResponse>(API_URL.AUTH.LOGIN, {
      username,
      password,
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutAPI = async (): Promise<AuthResponse> => {
  try {
    const { data } = await adminAPI.post<AuthResponse>(API_URL.AUTH.LOGOUT);
    return data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
