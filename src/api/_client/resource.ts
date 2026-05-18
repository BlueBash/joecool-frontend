import {
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { http } from "./http";
import { createResourceKeys } from "./query-keys";
import type { ApiError } from "./errors";
import type { ApiEnvelope, ID, Paginated, QueryMeta } from "./types";
import { buildIncludedMap, getNextPageParamFromPaginated } from "./json-api";
import { flattenParams, mergeListParams, shapePaginated } from "./resource.utils";
import type {
  Resource,
  ResourceApi,
  ResourceConfig,
  ResourceHooks,
  ResourceQueryFactories,
} from "./resource.types";

export function createResource<
  TEntity,
  TCreate = Partial<TEntity>,
  TUpdate = Partial<TEntity>,
 >(cfg: ResourceConfig<TEntity, TCreate, TUpdate>): Resource<TEntity, TCreate, TUpdate> {
  const keys = createResourceKeys(cfg.scope);

  const pathFor = cfg.pathFor ?? ((id: ID) => `${cfg.path}/${id}`);
  const updateVerb = cfg.idempotentUpdate ?? "PATCH";

  const api: ResourceApi<TEntity, TCreate, TUpdate> = {
    async list(params) {
      const merged = mergeListParams(cfg.defaultListParams, params);
      const res = await http.get<ApiEnvelope<TEntity[]>>(cfg.path, {
        params: flattenParams(merged),
      });
      return cfg.transform?.list
        ? cfg.transform.list(res.data, merged)
        : shapePaginated(res.data);
    },
    async detail(id, params) {
      const merged = mergeListParams(cfg.defaultDetailParams, params);
      const res = await http.get<ApiEnvelope<TEntity>>(pathFor(id), {
        params: flattenParams(merged),
      });
      const includedMap = buildIncludedMap(
        (res.data as { included?: unknown[] }).included,
      );
      const raw = res.data.data;
      return cfg.transform?.entity ? cfg.transform.entity(raw, includedMap) : raw;
    },
    async create(payload) {
      const body = cfg.bodyKey ? { [cfg.bodyKey]: payload } : payload;
      const res = await http.post<ApiEnvelope<TEntity>>(cfg.path, body);
      const includedMap = buildIncludedMap(
        (res.data as { included?: unknown[] }).included,
      );
      const raw = res.data.data;
      return cfg.transform?.entity ? cfg.transform.entity(raw, includedMap) : raw;
    },
    async update(id, payload) {
      const data = cfg.bodyKey ? { [cfg.bodyKey]: payload } : payload;
      const res = await http.request<ApiEnvelope<TEntity>>({
        method: updateVerb,
        url: pathFor(id),
        data,
      });
      const includedMap = buildIncludedMap(
        (res.data as { included?: unknown[] }).included,
      );
      const raw = res.data.data;
      return cfg.transform?.entity ? cfg.transform.entity(raw, includedMap) : raw;
    },
    async delete(id) {
      await http.delete(pathFor(id));
    },
  };

  const queries: ResourceQueryFactories<TEntity> = {
    list: (params) =>
      queryOptions<Paginated<TEntity>, ApiError>({
        queryKey: keys.list(mergeListParams(cfg.defaultListParams, params)),
        queryFn: () => api.list(params),
      }),
    detail: (id) =>
      queryOptions<TEntity, ApiError>({
        queryKey: keys.detail(id),
        queryFn: () => api.detail(id),
      }),
  };

  const buildMeta = (opts?: { silentError?: boolean }) =>
    opts?.silentError ? ({ silentError: true } satisfies QueryMeta) : undefined;

  const hooks: ResourceHooks<TEntity, TCreate, TUpdate> = {
    useList: (params, opts) => {
      const base = queries.list(params);
      return useQuery<Paginated<TEntity>, ApiError>({
        ...base,
        enabled: opts?.enabled ?? true,
        staleTime: opts?.staleTime,
        placeholderData: opts?.keepPreviousData
          ? (prev) => prev as Paginated<TEntity> | undefined
          : undefined,
        meta: buildMeta(opts),
      });
    },

    useDetail: (id, opts) => {
      const enabled = (opts?.enabled ?? true) && id !== null && id !== undefined;
      return useQuery<TEntity, ApiError>({
        queryKey: keys.detail((id ?? "") as ID),
        queryFn: () => api.detail(id as ID),
        enabled,
        staleTime: opts?.staleTime,
        meta: buildMeta(opts),
      });
    },

    useInfinite: (params, opts) => {
      const merged = mergeListParams(cfg.defaultListParams, params);
      return useInfiniteQuery<
        Paginated<TEntity>,
        ApiError,
        InfiniteData<Paginated<TEntity>>,
        readonly unknown[],
        number
      >({
        ...opts,
        queryKey: keys.infinite(merged),
        queryFn: ({ pageParam }) => api.list({ ...params, page: pageParam ?? 1 }),
        initialPageParam: 1,
        getNextPageParam: getNextPageParamFromPaginated,
      });
    },

    useCreate: (opts) => {
      const qc = useQueryClient();
      return useMutation<TEntity, ApiError, TCreate>({
        ...opts,
        mutationFn: (payload) => api.create(payload),
        onSuccess: (...args) => {
          qc.invalidateQueries({ queryKey: keys.lists() });
          cfg.onMutate?.(qc);
          return opts?.onSuccess?.(...args);
        },
      });
    },

    useUpdate: (opts) => {
      const qc = useQueryClient();
      return useMutation<TEntity, ApiError, { id: ID; data: TUpdate }>({
        ...opts,
        mutationFn: ({ id, data }) => api.update(id, data),
        onSuccess: (...args) => {
          const [data, vars] = args;
          qc.setQueryData(keys.detail(vars.id), data);
          qc.invalidateQueries({ queryKey: keys.lists() });
          cfg.onMutate?.(qc);
          return opts?.onSuccess?.(...args);
        },
      });
    },

    useDelete: (opts) => {
      const qc = useQueryClient();
      return useMutation<void, ApiError, { id: ID }>({
        ...opts,
        mutationFn: ({ id }) => api.delete(id),
        onSuccess: (...args) => {
          const [, vars] = args;
          qc.removeQueries({ queryKey: keys.detail(vars.id) });
          qc.invalidateQueries({ queryKey: keys.lists() });
          cfg.onMutate?.(qc);
          return opts?.onSuccess?.(...args);
        },
      });
    },
  };

  return { keys, api, queries, hooks };
}
