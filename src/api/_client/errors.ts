import { AxiosError } from "axios";

export type FieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly fieldErrors?: FieldErrors;
  public readonly cause?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    fieldErrors?: FieldErrors,
    cause?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.cause = cause;
  }

  get isAuth() {
    return this.status === 401;
  }
  get isForbidden() {
    return this.status === 403;
  }
  get isNotFound() {
    return this.status === 404;
  }
  get isValidation() {
    return this.status === 422 || !!this.fieldErrors;
  }
  get isServer() {
    return this.status >= 500;
  }
  get isNetwork() {
    return this.status === 0;
  }
}

interface ApiErrorBody {
  message?: string;
  error?: string;
  code?: string;
  errors?: FieldErrors;
}

export function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;

  if (err instanceof AxiosError) {
    const status = err.response?.status ?? 0;
    const body = (err.response?.data ?? {}) as ApiErrorBody;
    const message =
      body.message ??
      body.error ??
      err.message ??
      (status === 0 ? "Network error" : "Request failed");
    const code = body.code ?? (status ? `HTTP_${status}` : "NETWORK_ERROR");
    return new ApiError(status, code, message, body.errors, err);
  }

  if (err instanceof Error) {
    return new ApiError(0, "UNKNOWN", err.message, undefined, err);
  }

  return new ApiError(0, "UNKNOWN", "Unknown error", undefined, err);
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}
