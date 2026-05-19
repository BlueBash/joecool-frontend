import { useCallback, useMemo, useState } from "react";
import {
  hasActiveSettingsFilters,
  mapSettingsFiltersToApi,
  type SettingsFilterValue,
  type SettingsFilterValues,
  type SettingsListFilterConfig,
} from "../filters";

interface UseSettingsListFiltersOptions {
  /** Called after any filter value changes (e.g. reset pagination). */
  onFiltersChange?: () => void;
}

export interface SettingsListFiltersState {
  values: SettingsFilterValues;
  apiFilters: ReturnType<typeof mapSettingsFiltersToApi>;
  hasActiveFilters: boolean;
  setField: (key: string, value: SettingsFilterValue) => void;
  clearFilters: () => void;
}

/**
 * Local filter state for a settings listing, mapped to API query params on change.
 * Keystroke updates mirror the legacy FilterComponent (no debounce).
 */
export function useSettingsListFilters(
  config: SettingsListFilterConfig,
  opts?: UseSettingsListFiltersOptions,
): SettingsListFiltersState {
  const [values, setValues] = useState<SettingsFilterValues>({});

  const notify = opts?.onFiltersChange;

  const setField = useCallback(
    (key: string, value: SettingsFilterValue) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      notify?.();
    },
    [notify],
  );

  const clearFilters = useCallback(() => {
    setValues({});
    notify?.();
  }, [notify]);

  const apiFilters = useMemo(
    () => mapSettingsFiltersToApi(values, config.fields),
    [config.fields, values],
  );

  const hasActiveFilters = useMemo(() => hasActiveSettingsFilters(values), [values]);

  return {
    values,
    apiFilters,
    hasActiveFilters,
    setField,
    clearFilters,
  };
}
