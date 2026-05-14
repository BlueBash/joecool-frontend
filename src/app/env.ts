import { z } from "zod";

const RawEnvSchema = z.object({
  VITE_API_ROOT: z.string().url().optional(),
  VITE_API_PROTOCOL: z.string().optional(),
  VITE_API_DOMAIN: z.string().optional(),
  VITE_ENABLE_MOCKS: z.enum(["true", "false"]).optional(),
});

const parsed = RawEnvSchema.parse(import.meta.env);

export const SUBDOMAIN =
  typeof window !== "undefined" ? window.location.hostname.split(".")[0] : "";

function resolveApiRoot(): string {
  if (parsed.VITE_API_ROOT) return parsed.VITE_API_ROOT.replace(/\/$/, "");
  if (parsed.VITE_API_PROTOCOL && parsed.VITE_API_DOMAIN) {
    return `${parsed.VITE_API_PROTOCOL}${SUBDOMAIN}.${parsed.VITE_API_DOMAIN}`.replace(/\/$/, "");
  }
  throw new Error(
    "Missing API config: set VITE_API_ROOT or both VITE_API_PROTOCOL + VITE_API_DOMAIN",
  );
}

export const env = {
  apiRoot: resolveApiRoot(),
  apiBase: "/api/v1/platform",
  enableMocks: parsed.VITE_ENABLE_MOCKS === "true",
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
