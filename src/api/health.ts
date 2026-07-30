import { api } from "@/api/client";
import type { HealthStatus } from "@/types/api";

/**
 * Health API — endpoints for service health checks.
 */
export const healthApi = {
  /** GET / — root info */
  root: () => api.get<{ message: string; version: string; docs: string }>("/"),

  /** GET /ping — liveness check */
  ping: () => api.get<{ ping: string }>("/ping"),

  /** GET /health — deep health check (mongo + redis) */
  check: () => api.get<HealthStatus>("/health"),
};
