import type { FormValues, SettingItemLike } from "./types";

function str(v: unknown): string {
  return v == null ? "" : String(v);
}

/** Serialized fitting_message row → form values (API doc). */
export function mapFittingMessageFromRow(row: SettingItemLike): FormValues {
  return {
    audience: str(row.audience),
    description: str(row.description),
    category_id: str(row.category_id),
    fitting_size_pack_assortment_id: str(row.fitting_size_pack_assortment_id),
    fitting_size_spec_id: str(row.fitting_size_spec_id),
    fitting_size_measure_id: str(row.fitting_size_measure_id),
  };
}

/** Serialized dimension_message row → form values (API doc). */
export function mapDimensionMessageFromRow(row: SettingItemLike): FormValues {
  return {
    description: str(row.description),
    audience: str(row.audience),
    category_id: str(row.category_id),
    dimension_pack_assortment_id: str(row.dimension_pack_assortment_id),
    dimension_spec_id: str(row.dimension_spec_id),
    dimension_measure_id: str(row.dimension_measure_id),
  };
}

function flagStr(row: SettingItemLike, path: string): string {
  const v = readNested(row, path);
  return v === true || v === "true" ? "true" : "false";
}

function readNested(row: SettingItemLike, path: string): unknown {
  const parts = path.split(".");
  let cur: unknown = row;
  for (const part of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
}

export function mapOrderKindFromRow(row: SettingItemLike): FormValues {
  return {
    name: str(row.name),
    code: str(row.code),
    flags_avail_calc: flagStr(row, "flags.avail_calc"),
    flags_spare_calc: flagStr(row, "flags.spare_calc"),
    flags_likely_confirmed: flagStr(row, "flags.likely_confirmed"),
    flags_allow_allocation: flagStr(row, "flags.allow_allocation"),
  };
}
