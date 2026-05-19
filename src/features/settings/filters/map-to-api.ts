import type { FilterValue } from "@/api/_client";
import type {
  SettingsApiFilters,
  SettingsFilterField,
  SettingsFilterPredicate,
  SettingsFilterValues,
} from "./types";

function isActiveValue(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
}

function defaultPredicate(field: SettingsFilterField): SettingsFilterPredicate {
  if (field.predicate) return field.predicate;
  switch (field.kind) {
    case "select":
      return "in";
    case "boolean":
      return "eq";
    default:
      return "cont";
  }
}

function toApiValue(field: SettingsFilterField, value: unknown): FilterValue {
  if (field.kind === "boolean") {
    return value === true || value === "true" ? 1 : 0;
  }
  return String(value).trim();
}

/** Maps UI filter values to Ransack-style `filter[attr_predicate]` query params. */
export function mapSettingsFiltersToApi(
  values: SettingsFilterValues,
  fields: SettingsFilterField[],
): SettingsApiFilters {
  const out: SettingsApiFilters = {};

  for (const field of fields) {
    const raw = values[field.key];
    if (!isActiveValue(raw)) continue;

    const param = field.param ?? field.key;
    const predicate = defaultPredicate(field);
    out[`filter[${param}_${predicate}]`] = toApiValue(field, raw);
  }

  return out;
}

export function hasActiveSettingsFilters(values: SettingsFilterValues): boolean {
  return Object.values(values).some(isActiveValue);
}
