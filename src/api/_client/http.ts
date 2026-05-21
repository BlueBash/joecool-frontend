import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/app/env";
import { authStorage } from "./auth-storage";
import { toApiError } from "./errors";
import { toast } from "sonner";

export const http: AxiosInstance = axios.create({
  baseURL: `${env.apiRoot}${env.apiBase}`,
  withCredentials: false,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken();
  if (token) {
    config.headers.set("Authorization", `${token}`);
  }
  return config;
});

http.interceptors.response.use(
  (res) => {
    return res;
  },
  (error: AxiosError) => {
    const errorMessage = (error.response?.data as { error?: string }).error || "";
    const status = error.response?.status;
    toast.error(errorMessage || "An unknown error occurred");
    if (status === 401) {
      authStorage.clear();
      window.location.href = "/login"; // redirect user to login page
    }
    return Promise.reject(toApiError(error));
  },
);
