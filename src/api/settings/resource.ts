import { createResource } from "@/api/_client";
import type { ListParams } from "@/api/_client";
import { denormalizeJsonApiEntity, paginatedFromJsonApi } from "./json-api";
import type { JsonApiListMeta } from "./json-api";
import type { StockSettingRow } from "./stock/types";

export type SettingsRow = StockSettingRow;

export function mkSettingsResource(
  scope: readonly string[],
  path: string,
  bodyKey: string,
  defaultListParams?: ListParams,
) {
  const defaultDetailParams =
    defaultListParams?.include != null ? { include: defaultListParams.include } : undefined;

  return createResource<SettingsRow, Record<string, unknown>, Record<string, unknown>>({
    scope,
    path,
    bodyKey,
    defaultListParams,
    defaultDetailParams,
    transform: {
      entity: (raw, includedMap) => denormalizeJsonApiEntity(raw, includedMap) as SettingsRow,
      list: (envelope, params) =>
        paginatedFromJsonApi(
          envelope as { data?: unknown; meta?: JsonApiListMeta },
          params,
          (row, includedMap) => denormalizeJsonApiEntity(row, includedMap) as SettingsRow,
        ),
    },
  });
}
