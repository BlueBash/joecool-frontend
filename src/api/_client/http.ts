import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/app/env";
import { authStorage } from "./auth-storage";
import { toApiError } from "./errors";

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
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      authStorage.clear();
      window.location.href = "/login"; // redirect user to login page
    }
    return Promise.reject(toApiError(error));
  },
);
