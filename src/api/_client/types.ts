export interface ApiEnvelope<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Cursor-style pagination URLs from JSON:API `links` (subset exposed to the UI layer). */
export interface PaginationLinks {
  next?: string;
  prev?: string;
  self?: string;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
  links?: PaginationLinks;
}

export type ID = string | number;

export type FilterValue = string | number | boolean | null | undefined;

export interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  /** JSON:API-style `include` query (comma-separated associations). */
  include?: string;
  limit?: number;
  filters?: Record<string, FilterValue>;
}

/**
 * TanStack Query `meta` slot reserved fields. Opt-in per query/mutation
 * to skip the global toast on error (e.g. background polling, search hits).
 */
export interface QueryMeta {
  silentError?: boolean;
}

export interface UserInfo {
  id: string;
  name: string;
  code: string;
  username: string;
}
