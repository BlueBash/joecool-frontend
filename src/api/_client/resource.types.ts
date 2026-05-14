import type {
  InfiniteData,
  QueryClient,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import type { ApiError } from "./errors";
import type { ID, ListParams, Paginated } from "./types";
import type { ResourceKeys } from "./query-keys";

/**
 * Per-resource configuration consumed by `createResource`.
 *
 * Keep this minimal — anything beyond CRUD belongs in a sibling file
 * that composes the resource (see `stocks/stocks.ts` for the pattern).
 */
export interface ResourceConfig<TEntity, TCreate, TUpdate> {
  /** Hierarchical query-key scope, e.g. ["stock-settings", "categories"]. */
  scope: readonly string[];
  /** REST path relative to the platform base, e.g. "/stock_settings/categories". */
  path: string;
  /** Override the per-id path. Defaults to `${path}/${id}`. */
  pathFor?: (id: ID) => string;
  /** HTTP verb for update. Defaults to PATCH (matches JoeCool spec). */
  idempotentUpdate?: "PATCH" | "PUT";
  /** Cross-resource invalidation hook (e.g. invalidate parent on child mutations). */
  onMutate?: (qc: QueryClient) => void;
  /** Params applied to every list call (e.g. a hardcoded type filter). */
  defaultListParams?: ListParams;
  /** Optional runtime shaping of API responses. */
  transform?: {
    entity?: (raw: unknown) => TEntity;
    list?: (raw: unknown) => Paginated<TEntity>;
  };
}

export interface ResourceApi<TEntity, TCreate, TUpdate> {
  list: (params?: ListParams) => Promise<Paginated<TEntity>>;
  detail: (id: ID) => Promise<TEntity>;
  create: (payload: TCreate) => Promise<TEntity>;
  update: (id: ID, payload: TUpdate) => Promise<TEntity>;
  remove: (id: ID) => Promise<void>;
}

export interface ResourceQueryFactories<TEntity> {
  list: (params?: ListParams) => UseQueryOptions<Paginated<TEntity>, ApiError>;
  detail: (id: ID) => UseQueryOptions<TEntity, ApiError>;
}

export interface ResourceHookOptions {
  enabled?: boolean;
  silentError?: boolean;
  staleTime?: number;
  /** Keep last page data while fetching next. */
  keepPreviousData?: boolean;
}

export type UpdateVariables<TUpdate> = { id: ID; data: TUpdate };

export type DeleteVariables = { id: ID };

export interface ResourceHooks<TEntity, TCreate, TUpdate> {
  useList: (
    params?: ListParams,
    opts?: ResourceHookOptions,
  ) => UseQueryResult<Paginated<TEntity>, ApiError>;

  useDetail: (
    id: ID | null | undefined,
    opts?: ResourceHookOptions,
  ) => UseQueryResult<TEntity, ApiError>;

  useInfinite: (
    params?: ListParams,
    opts?: Omit<
      UseInfiniteQueryOptions<
        Paginated<TEntity>,
        ApiError,
        InfiniteData<Paginated<TEntity>>,
        readonly unknown[],
        number
      >,
      "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
    >,
  ) => UseInfiniteQueryResult<InfiniteData<Paginated<TEntity>>, ApiError>;

  useCreate: (
    opts?: UseMutationOptions<TEntity, ApiError, TCreate>,
  ) => UseMutationResult<TEntity, ApiError, TCreate>;

  useUpdate: (
    opts?: UseMutationOptions<TEntity, ApiError, UpdateVariables<TUpdate>>,
  ) => UseMutationResult<TEntity, ApiError, UpdateVariables<TUpdate>>;

  useDelete: (
    opts?: UseMutationOptions<void, ApiError, DeleteVariables>,
  ) => UseMutationResult<void, ApiError, DeleteVariables>;
}

export interface Resource<TEntity, TCreate, TUpdate> {
  keys: ResourceKeys;
  api: ResourceApi<TEntity, TCreate, TUpdate>;
  queries: ResourceQueryFactories<TEntity>;
  hooks: ResourceHooks<TEntity, TCreate, TUpdate>;
}
