import type { SettingsResourceEntry } from "../types";
import { SETTINGS_FILTER_PRESETS } from "./presets";
import type { SettingsListFilterConfig } from "./types";

const MESSAGE_BODY_KEYS = new Set([
  "general_message",
  "shipping_message",
  "payment_term_message",
  "payment_method_message",
  "bank_message",
  "web_stock_availability_message",
]);

/** Per-slug overrides when body-key defaults are not enough. */
const SETTINGS_LIST_FILTERS_BY_SLUG: Partial<Record<string, SettingsListFilterConfig>> = {
  "address/agent": SETTINGS_FILTER_PRESETS.nameOnly(),
  "address/account-manager": SETTINGS_FILTER_PRESETS.accountManager(),
  "address/country": SETTINGS_FILTER_PRESETS.country(),
  "stock/fittings/messages": SETTINGS_FILTER_PRESETS.categoryAudience(),
  "stock/dimensions/messages": SETTINGS_FILTER_PRESETS.categoryAudience(),
  "stock/sizes": SETTINGS_FILTER_PRESETS.ringSize(),
  "stock/assembly-costs": SETTINGS_FILTER_PRESETS.nameOnly(),
  "stock/packing-costs": SETTINGS_FILTER_PRESETS.nameOnly(),
};

/** Defaults keyed by Rails `bodyKey` for listing resources. */
const SETTINGS_LIST_FILTERS_BY_BODY_KEY: Partial<
  Record<string, SettingsListFilterConfig>
> = {
  fitting_message: SETTINGS_FILTER_PRESETS.categoryAudience(),
  dimension_message: SETTINGS_FILTER_PRESETS.categoryAudience(),
  marketing_blurb: SETTINGS_FILTER_PRESETS.codeBlurb(),
  ring_size: SETTINGS_FILTER_PRESETS.ringSize(),
  country: SETTINGS_FILTER_PRESETS.country(),
  cost: SETTINGS_FILTER_PRESETS.nameOnly(),
};

function resolveByBodyKey(bodyKey: string): SettingsListFilterConfig | undefined {
  if (MESSAGE_BODY_KEYS.has(bodyKey)) {
    return SETTINGS_FILTER_PRESETS.message();
  }
  return SETTINGS_LIST_FILTERS_BY_BODY_KEY[bodyKey];
}

/**
 * Resolves list filter config for a settings section. Entry-level `listFilters`
 * wins, then slug overrides, then body-key defaults, then code+name.
 */
export function getSettingsListFilters(
  slug: string,
  entry: SettingsResourceEntry,
): SettingsListFilterConfig {
  return (
    entry.listFilters ??
    SETTINGS_LIST_FILTERS_BY_SLUG[slug] ??
    resolveByBodyKey(entry.bodyKey) ??
    SETTINGS_FILTER_PRESETS.codeName()
  );
}
