import { createResource } from "./resource";
import type { ListParams } from "./types";
import type { Resource } from "./resource.types";
import { denormalizeJsonApiEntity, paginatedFromJsonApi } from "./json-api";
import type { JsonApiListMeta } from "./json-api";

export type JsonApiRow = {
  id: string;
  name: string;
  [key: string]: unknown;
};

/** Factory for standard JSON:API list/detail resources (settings, stocks, addresses, …). */
export function createJsonApiResource<
  TRow extends JsonApiRow = JsonApiRow,
  TWrite extends Record<string, unknown> = Record<string, unknown>,
>(
  scope: readonly string[],
  path: string,
  bodyKey: string,
  options?: { defaultListParams?: ListParams; defaultDetailParams?: ListParams },
): Resource<TRow, TWrite, TWrite> {
  const mapRow = (raw: unknown) => denormalizeJsonApiEntity(raw) as TRow;

  return createResource<TRow, TWrite, TWrite>({
    scope,
    path,
    bodyKey,
    defaultListParams: options?.defaultListParams,
    defaultDetailParams: options?.defaultDetailParams,
    transform: {
      entity: mapRow,
      list: (envelope, params) =>
        paginatedFromJsonApi(
          envelope as { data?: unknown; meta?: JsonApiListMeta },
          params,
          mapRow,
        ),
    },
  });
}
