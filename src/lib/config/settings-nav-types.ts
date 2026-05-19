import type { LucideIcon } from "lucide-react";

export type SettingsSection = {
  slug: string;
  resourceKey: string;
  label: string;
  /** Mock-store key for sidebar counts (`useSettings` seed). Defaults to `slug`. */
  countKey?: string;
};

export type SettingsGroup = {
  slug: string;
  label: string;
  icon?: LucideIcon;
  sections?: SettingsSection[];
  groups?: SettingsGroup[];
};

export type SettingsTrail = {
  groups: SettingsGroup[];
  section: SettingsSection;
  siblings: SettingsSection[];
};
