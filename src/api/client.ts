import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 10_000);

// ──────────────────────────────────────────────────────────────────────────────
// Axios Instance
// ──────────────────────────────────────────────────────────────────────────────
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ──────────────────────────────────────────────────────────────────────────────
// Request Interceptor — attach auth token
// ──────────────────────────────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ──────────────────────────────────────────────────────────────────────────────
// Response Interceptor — handle errors globally
// ──────────────────────────────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const status: number = error.response?.status;
    const detail: string =
      error.response?.data?.detail ?? error.message ?? "An error occurred.";

    if (status === 401) {
      localStorage.removeItem("access_token");
      toast.error("Session expired. Please log in again.");
    } else if (status === 403) {
      toast.error("You don't have permission to do that.");
    } else if (status === 429) {
      toast.warning("Too many requests. Please slow down.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (status >= 400) {
      toast.error(detail);
    }

    return Promise.reject(error);
  }
);

// ──────────────────────────────────────────────────────────────────────────────
// Typed request helpers
// ──────────────────────────────────────────────────────────────────────────────
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((r) => r.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then((r) => r.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then((r) => r.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config).then((r) => r.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((r) => r.data),
};
