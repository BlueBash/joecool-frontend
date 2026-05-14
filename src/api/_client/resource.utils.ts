import type { ApiEnvelope, ListParams, Paginated, PaginationMeta } from "./types";

/** Merge default params with caller params. `filters` is shallow-merged. */
export function mergeListParams(a?: ListParams, b?: ListParams): ListParams | undefined {
  if (!a && !b) return undefined;
  return {
    ...a,
    ...b,
    filters: { ...(a?.filters ?? {}), ...(b?.filters ?? {}) },
  };
}

/** Flatten `ListParams` into a query-string-ready object, stripping null/undefined. */
export function flattenParams(p?: ListParams): Record<string, unknown> | undefined {
  if (!p) return undefined;
  const { filters, ...rest } = p;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rest)) {
    if (v !== undefined) out[k] = v;
  }
  if (filters) {
    for (const [k, v] of Object.entries(filters)) {
      if (v !== undefined && v !== null) out[k] = v;
    }
  }
  return Object.keys(out).length ? out : undefined;
}

/** Normalize a list envelope into a `Paginated<T>`. Missing meta → single-page. */
export function shapePaginated<T>(envelope: ApiEnvelope<T[]>): Paginated<T> {
  const items = Array.isArray(envelope.data) ? envelope.data : [];
  const meta: PaginationMeta = envelope.meta ?? {
    page: 1,
    pageSize: items.length,
    total: items.length,
    totalPages: 1,
  };
  return { items, meta };
}
