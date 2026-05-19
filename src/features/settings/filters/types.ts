import type { FilterValue } from "@/api/_client";
import type { FieldSelectOption } from "../types";

export type SettingsFilterPredicate = "cont" | "eq" | "in";

export type SettingsFilterValue = string | boolean;

export type SettingsFilterValues = Record<string, SettingsFilterValue>;

interface SettingsFilterFieldBase {
  /** Local state key and default API attribute name. */
  key: string;
  /** Ransack attribute when it differs from `key` (e.g. `category_name`). */
  param?: string;
  predicate?: SettingsFilterPredicate;
  placeholder?: string;
  label?: string;
}

export interface SettingsTextFilterField extends SettingsFilterFieldBase {
  kind: "text";
}

export interface SettingsSelectFilterField extends SettingsFilterFieldBase {
  kind: "select";
  options: FieldSelectOption[];
  clearable?: boolean;
}

export interface SettingsBooleanFilterField extends SettingsFilterFieldBase {
  kind: "boolean";
  /** Label shown beside the toggle. */
  toggleLabel?: string;
}

export type SettingsFilterField =
  | SettingsTextFilterField
  | SettingsSelectFilterField
  | SettingsBooleanFilterField;

export interface SettingsListFilterConfig {
  fields: SettingsFilterField[];
  /**
   * When true, filter values are mirrored to URL search params (reserved for
   * future route schemas). Defaults to false — reference app did not sync URLs.
   */
  persistInUrl?: boolean;
}

export type SettingsApiFilters = Record<string, FilterValue>;
