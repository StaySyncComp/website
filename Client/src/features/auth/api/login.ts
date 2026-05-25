import apiClient from "@/lib/api-client";
import { setAccessToken } from "@/lib/auth-token";
import {
  LoginCredentials,
  LoginResponse,
  MutationResponse,
} from "@/types/api/auth";
import axios from "axios";

export const login = async (
  credentials: LoginCredentials
): Promise<MutationResponse<LoginResponse>> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials
    );
    console.log("Login response:", response);

    if (response.data?.accessToken) {
      setAccessToken(response.data.accessToken);
    }

    return { status: response.status, data: response.data };
  } catch (error) {
    console.error("Error during login:", error);

    if (axios.isAxiosError(error)) {
      return {
        status: error.response?.status || 500,
        error:
          error.response?.data?.message || error.message || "Unknown error",
      };
    }

    return {
      status: 500,
      error: "An unexpected error occurred",
    };
  }
};
