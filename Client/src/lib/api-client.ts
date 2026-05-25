import axios from "axios";
import { getAccessToken } from "@/lib/auth-token";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3101";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default apiClient;
