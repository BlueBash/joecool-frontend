import type { SettingsResourceEntry, SettingsSectionConfig } from "../types";
import { readFieldValue } from "../utils";

/** Wrap a resource entry as a listing section config. */
export function listing(entry: SettingsResourceEntry): SettingsSectionConfig {
  return { view: "listing", entry };
}