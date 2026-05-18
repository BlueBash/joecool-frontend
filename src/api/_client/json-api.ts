import type { ListParams, Paginated, PaginationLinks, PaginationMeta } from "./types";

/** Pagination meta as returned by several JoeCool JSON:API list endpoints. */
export interface JsonApiListMeta {
  count?: number;
  total_count?: number;
  total_pages?: number;
  page?: number;
}

export interface JsonApiLinks {
  first?: string | null;
  last?: string | null;
  next?: string | null;
  prev?: string | null;
  self?: string | null;
}

export interface JsonApiEnvelope {
  data?: unknown;
  included?: unknown[];
  meta?: JsonApiListMeta;
  links?: JsonApiLinks;
}

/** O(1) lookup of denormalized included resources by `${type}-${id}`. */
export type IncludedMap = Map<string, Record<string, unknown>>;

/** DEV-only: logs denormalized data right before it is returned to components / query cache. */
export function logJsonApiComponentOutput(scope: string, output: unknown): void {
  if (import.meta.env.DEV) {
    console.log(`[json-api → component] ${scope}`, output);
  }
}

interface RelationRef {
  type?: string;
  id: unknown;
}

export function resourceKey(type: unknown, id: unknown): string {
  return `${String(type)}-${String(id)}`;
}

function entityResourceKey(raw: Record<string, unknown>): string | undefined {
  if (raw.type == null || raw.id == null) return undefined;
  return resourceKey(raw.type, raw.id);
}

function parseRelationData(
  relationships: Record<string, unknown> | undefined,
  relKey: string,
): { single?: RelationRef; many?: RelationRef[] } | undefined {
  if (!relationships) return undefined;
  const rel = relationships[relKey];
  if (!rel || typeof rel !== "object") return undefined;
  const data = (rel as { data?: unknown }).data;
  if (data == null) return undefined;

  if (Array.isArray(data)) {
    const many = data
      .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
      .map((item) => ({ type: item.type as string | undefined, id: item.id }))
      .filter((ref) => ref.id != null && ref.id !== "");
    return many.length ? { many } : undefined;
  }

  if (typeof data === "object" && "id" in data && data.id != null && data.id !== "") {
    const item = data as Record<string, unknown>;
    return { single: { type: item.type as string | undefined, id: item.id } };
  }

  return undefined;
}

/**
 * Indexes JSON:API `included` resources for O(1) lookup. Each entry is fully
 * denormalized (attributes, FKs, and nested included relations when present).
 */
export function buildIncludedMap(included?: unknown[]): IncludedMap {
  const rawByKey = new Map<string, unknown>();
  const map: IncludedMap = new Map();

  if (!Array.isArray(included)) return map;

  for (const item of included) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    if (r.type == null || r.id == null) continue;
    rawByKey.set(resourceKey(r.type, r.id), item);
  }

  for (const [, raw] of rawByKey) {
    const key = entityResourceKey(raw as Record<string, unknown>);
    if (key && !map.has(key)) {
      map.set(
        key,
        denormalizeJsonApiEntity(raw, map, new Set(), rawByKey),
      );
    }
  }

  return map;
}

function resolveIncludedEntity(
  ref: RelationRef,
  includedMap: IncludedMap,
  visiting: Set<string>,
  rawByKey?: Map<string, unknown>,
): Record<string, unknown> | undefined {
  const type = ref.type ?? "unknown";
  const key = resourceKey(type, ref.id);
  if (visiting.has(key)) return undefined;

  const cached = includedMap.get(key);
  if (cached) return cached;

  const raw = rawByKey?.get(key);
  if (!raw || typeof raw !== "object") return undefined;

  const denorm = denormalizeJsonApiEntity(raw, includedMap, visiting, rawByKey);
  includedMap.set(key, denorm);
  return denorm;
}

function syntheticName(out: Record<string, unknown>): string {
  return (
    (typeof out.name === "string" && out.name) ||
    (typeof out.code === "string" && out.code) ||
    (typeof out.whlsl_title === "string" && out.whlsl_title) ||
    (typeof out.short_message === "string" && out.short_message) ||
    (typeof out.blurb === "string" && String(out.blurb).slice(0, 120)) ||
    (typeof out.description === "string" && String(out.description).slice(0, 120)) ||
    (out.us_size != null && `US ${String(out.us_size)}`) ||
    String(out.id ?? "")
  );
}

/**
 * Flattens a JSON:API-style record (`id`, `attributes`, `relationships`) into a
 * single object suitable for listings and forms. Adds synthetic `name`, FK
 * fields (`*_id` / `*_ids`), and hydrates relationship objects from `includedMap`
 * when available.
 */
export function denormalizeJsonApiEntity(
  raw: unknown,
  includedMap: IncludedMap = new Map(),
  visiting: Set<string> = new Set(),
  rawByKey?: Map<string, unknown>,
): Record<string, unknown> {
  if (!raw || typeof raw !== "object") return {};
  const r = raw as Record<string, unknown>;
  const selfKey = entityResourceKey(r);

  if (selfKey) {
    if (visiting.has(selfKey)) {
      const cached = includedMap.get(selfKey);
      if (cached) return { ...cached };
    }
    visiting.add(selfKey);
  }

  try {
    const attrs = (r.attributes as Record<string, unknown>) ?? {};
    const rels = (r.relationships as Record<string, unknown>) ?? {};
    const out: Record<string, unknown> = { ...attrs };

    if (r.id != null) out.id = String(r.id);

    for (const key of Object.keys(rels)) {
      const snake = key.replace(/-/g, "_");
      const parsed = parseRelationData(rels, key);
      if (!parsed) continue;

      if (parsed.single) {
        const { id, type } = parsed.single;
        out[`${snake}_id`] = String(id);
        const hydrated = resolveIncludedEntity(
          { id, type },
          includedMap,
          visiting,
          rawByKey,
        );
        if (hydrated) out[snake] = hydrated;
        continue;
      }

      if (parsed.many) {
        const ids = parsed.many.map((ref) => String(ref.id));
        out[`${snake}_ids`] = ids;
        const hydrated = parsed.many
          .map((ref) => resolveIncludedEntity(ref, includedMap, visiting, rawByKey))
          .filter((item): item is Record<string, unknown> => item != null);
        if (hydrated.length) out[snake] = hydrated;
      }
    }

    out.name = syntheticName(out);
    return out;
  } finally {
    if (selfKey) visiting.delete(selfKey);
  }
}

/** Denormalizes a single-entity JSON:API envelope (`data` + `included`). */
export function denormalizeJsonApiEnvelope(
  envelope: { data?: unknown; included?: unknown[] },
): Record<string, unknown> {
  const includedMap = buildIncludedMap(envelope.included);
  const entity = denormalizeJsonApiEntity(envelope.data, includedMap);
  logJsonApiComponentOutput("detail", entity);
  return entity;
}

/** Denormalizes a collection envelope (`data[]` + `included`). */
export function denormalizeJsonApiCollection(
  envelope: { data?: unknown; included?: unknown[] },
): Record<string, unknown>[] {
  const includedMap = buildIncludedMap(envelope.included);
  const arr = Array.isArray(envelope.data) ? envelope.data : [];
  return arr.map((raw) => denormalizeJsonApiEntity(raw, includedMap));
}

/** Extracts `page` from a JSON:API pagination URL (`links.next`, etc.). */
export function parsePageFromUrl(url: string): number | undefined {
  try {
    const parsed = new URL(url, "http://_");
    const page = parsed.searchParams.get("page");
    if (page != null && page !== "") {
      const n = Number(page);
      if (Number.isFinite(n) && n > 0) return n;
    }
  } catch {
    /* relative URLs */
  }
  const match = url.match(/[?&]page=(\d+)/i);
  if (!match) return undefined;
  const n = Number(match[1]);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** Maps JSON:API `links` to the frontend pagination link shape. */
export function parseJsonApiLinks(links?: JsonApiLinks): PaginationLinks | undefined {
  if (!links || typeof links !== "object") return undefined;

  const next = links.next || undefined;
  const prev = links.prev || undefined;
  const self = links.self || undefined;

  if (!next && !prev && !self) return undefined;
  return { next, prev, self };
}

/** Normalizes JSON:API list `meta` + request params into `PaginationMeta`. */
export function normalizePaginationMeta(
  meta: JsonApiListMeta | undefined,
  listParams: ListParams | undefined,
  itemCount: number,
): PaginationMeta {
  const m = meta ?? {};
  const page = listParams?.page ?? m.page ?? 1;
  const pageSize =
    listParams?.pageSize ??
    (m.count != null && m.count > 0 ? m.count : undefined) ??
    (itemCount || 25);
  const total = m.total_count ?? m.count ?? itemCount;
  const totalPages =
    m.total_pages ?? (pageSize > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1);

  return { page, pageSize, total, totalPages };
}

/** Resolves the next page number for TanStack infinite queries. */
export function getNextPageParamFromPaginated<T>(last: Paginated<T>): number | undefined {
  if (last.links?.next) {
    return parsePageFromUrl(last.links.next) ?? last.meta.page + 1;
  }
  if (last.meta.page < last.meta.totalPages) {
    return last.meta.page + 1;
  }
  return undefined;
}

export function paginatedFromJsonApi<T>(
  envelope: JsonApiEnvelope,
  listParams: ListParams | undefined,
  mapRow: (raw: unknown, includedMap: IncludedMap) => T,
): Paginated<T> {
  const includedMap = buildIncludedMap(envelope.included);
  const arr = Array.isArray(envelope.data) ? envelope.data : [];
  const items = arr.map((raw) => mapRow(raw, includedMap));
  const meta = normalizePaginationMeta(envelope.meta, listParams, items.length);
  const links = parseJsonApiLinks(envelope.links);
  const result = links ? { items, meta, links } : { items, meta };
  logJsonApiComponentOutput("list", result);
  return result;
}
