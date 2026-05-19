import type { SettingsResourceEntry, SettingsSectionConfig } from "../types";
import { addressSettingsSections } from "./address";
import { messagesSettingsSections } from "./messages";
import { priceSettingsSections } from "./price";
import { stockSettingsSections } from "./stock";
import { systemSettingsSections } from "./system";

const settingsSectionRegistry: Partial<Record<string, SettingsSectionConfig>> = {
  ...stockSettingsSections,
  ...priceSettingsSections,
  ...addressSettingsSections,
  ...messagesSettingsSections,
  ...systemSettingsSections,
};

export function getSettingsSection(slug: string): SettingsSectionConfig | undefined {
  return settingsSectionRegistry[slug];
}

/** @deprecated Use `getSettingsSection` — returns the listing entry when the section is a listing. */
export function getSettingsResource(slug: string): SettingsResourceEntry | undefined {
  const config = getSettingsSection(slug);
  return config?.view === "listing" ? config.entry : undefined;
}

/** @deprecated Use per-module maps under `registry/` — listing entries only. */
export const settingsResourceRegistry: Partial<Record<string, SettingsResourceEntry>> =
  Object.fromEntries(
    Object.entries(settingsSectionRegistry).flatMap(([slug, config]) =>
      config?.view === "listing" ? [[slug, config.entry]] : [],
    ),
  );

export {
  stockSettingsSections,
  priceSettingsSections,
  addressSettingsSections,
  messagesSettingsSections,
  systemSettingsSections,
};
