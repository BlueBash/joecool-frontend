import type { ID, ListParams } from "./types";

export interface ResourceKeys {
  all: () => readonly unknown[];
  lists: () => readonly unknown[];
  list: (params?: ListParams) => readonly unknown[];
  infinite: (params?: ListParams) => readonly unknown[];
  details: () => readonly unknown[];
  detail: (id: ID) => readonly unknown[];
  actions: (name: string, args?: unknown) => readonly unknown[];
}

/**
 * Builds a hierarchical query-key factory for a resource.
 *
 * Hierarchy lets you invalidate broadly or precisely:
 *   - `keys.all()`     → everything for this resource
 *   - `keys.lists()`   → every paginated/filtered list (keeps details warm)
 *   - `keys.detail(id)`→ one entity
 *   - `keys.actions(name)` → custom action endpoints (e.g. /clone, /barcode)
 */
export function createResourceKeys(scope: readonly string[]): ResourceKeys {
  const all = () => scope;
  const lists = () => [...scope, "list"] as const;
  const details = () => [...scope, "detail"] as const;

  return {
    all,
    lists,
    list: (params) => [...lists(), normalizeParams(params)] as const,
    infinite: (params) => [...scope, "infinite", normalizeParams(params)] as const,
    details,
    detail: (id) => [...details(), id] as const,
    actions: (name, args) =>
      args === undefined
        ? ([...scope, "action", name] as const)
        : ([...scope, "action", name, args] as const),
  };
}

function normalizeParams(params?: ListParams): Record<string, unknown> {
  if (!params) return {};
  // Strip undefined values so equivalent calls share a key.
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    if (k === "filters" && v && typeof v === "object") {
      const filters: Record<string, unknown> = {};
      for (const [fk, fv] of Object.entries(v as Record<string, unknown>)) {
        if (fv !== undefined) filters[fk] = fv;
      }
      if (Object.keys(filters).length) out.filters = filters;
      continue;
    }
    out[k] = v;
  }
  return out;
}
