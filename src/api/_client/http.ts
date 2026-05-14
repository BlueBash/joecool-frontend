import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/app/env";
import { authStorage } from "./auth-storage";
import { toApiError } from "./errors";

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const http: AxiosInstance = axios.create({
  baseURL: `${env.apiRoot}${env.apiBase}`,
  // This app uses bearer tokens (localStorage) rather than cookie-based auth.
  // Sending credentialed requests can trigger stricter CORS checks on the BE.
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
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// Single-flight refresh: many parallel 401s collapse into one /auth/refresh
let refreshPromise: Promise<string | null> | null = null;

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;
    const status = error.response?.status;

    const isRefreshCall = original?.url?.includes("/auth/refresh");
    if (status === 401 && original && !original._retry && !isRefreshCall) {
      original._retry = true;
      refreshPromise ??= authStorage.refresh().finally(() => {
        refreshPromise = null;
      });
      const newToken = await refreshPromise;
      if (newToken) {
        original.headers.set("Authorization", `Bearer ${newToken}`);
        return http(original);
      }
    }

    return Promise.reject(toApiError(error));
  },
);
