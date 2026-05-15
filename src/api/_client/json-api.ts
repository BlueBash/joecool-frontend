import type { ListParams, Paginated } from "./types";

/** Pagination meta as returned by several JoeCool JSON:API list endpoints. */
export interface JsonApiListMeta {
  count?: number;
  total_count?: number;
  total_pages?: number;
  page?: number;
}

function relationFk(
  relationships: Record<string, unknown> | undefined,
  relKey: string,
): unknown {
  if (!relationships) return undefined;
  const rel = relationships[relKey];
  if (!rel || typeof rel !== "object") return undefined;
  const data = (rel as { data?: { id?: unknown } | null }).data;
  if (data && typeof data === "object" && "id" in data) return data.id;
  return undefined;
}

/**
 * Flattens a JSON:API-style record (`id`, `attributes`, `relationships`) into a
 * single object suitable for listings and forms (adds synthetic `name` when
 * the API omits it).
 */
export function denormalizeJsonApiEntity(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object") return {};
  const r = raw as Record<string, unknown>;
  const attrs = (r.attributes as Record<string, unknown>) ?? {};
  const rels = (r.relationships as Record<string, unknown>) ?? {};

  const out: Record<string, unknown> = { ...attrs };

  if (r.id != null) out.id = String(r.id);

  for (const key of Object.keys(rels)) {
    const snake = key.replace(/-/g, "_");
    const fk = relationFk(rels, key);
    if (fk != null && fk !== "") {
      out[`${snake}_id`] = fk;
    }
  }

  const name =
    (typeof out.name === "string" && out.name) ||
    (typeof out.code === "string" && out.code) ||
    (typeof out.whlsl_title === "string" && out.whlsl_title) ||
    (typeof out.short_message === "string" && out.short_message) ||
    (typeof out.blurb === "string" && String(out.blurb).slice(0, 120)) ||
    (typeof out.description === "string" && String(out.description).slice(0, 120)) ||
    (out.us_size != null && `US ${String(out.us_size)}`) ||
    String(out.id ?? "");

  out.name = name;
  return out;
}

export function paginatedFromJsonApi<T>(
  envelope: { data?: unknown; meta?: JsonApiListMeta },
  listParams: ListParams | undefined,
  mapRow: (raw: unknown) => T,
): Paginated<T> {
  const arr = Array.isArray(envelope.data) ? envelope.data : [];
  const items = arr.map(mapRow);
  const m = envelope.meta ?? {};
  const page = listParams?.page ?? m.page ?? 1;
  const pageSize = listParams?.pageSize ?? 25;
  const total = m.total_count ?? m.count ?? items.length;
  const totalPages = m.total_pages ?? Math.max(1, Math.ceil(total / pageSize));
  return { items, meta: { page, pageSize, total, totalPages } };
}
