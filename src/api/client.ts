import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";

// =============================================================================
// API Configuration
// =============================================================================

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? "https://feedbackiq-backend-zteb.onrender.com"
    : "http://localhost:8000");

const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 10000);

// =============================================================================
// Axios Instance
// =============================================================================

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// =============================================================================
// Request Interceptor
// =============================================================================

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

// =============================================================================
// Response Interceptor
// =============================================================================

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const status = error.response?.status;
    const detail =
      error.response?.data?.detail ??
      error.message ??
      "Something went wrong.";

    if (status === 401) {
      localStorage.removeItem("access_token");
      toast.error("Session expired. Please login again.");
    } else if (status === 403) {
      toast.error("Access denied.");
    } else if (status === 404) {
      toast.error("API endpoint not found.");
    } else if (status === 429) {
      toast.warning("Too many requests.");
    } else if (status >= 500) {
      toast.error("Server error.");
    } else {
      toast.error(detail);
    }

    return Promise.reject(error);
  }
);

// =============================================================================
// Typed API Helpers
// =============================================================================

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};

export default api;