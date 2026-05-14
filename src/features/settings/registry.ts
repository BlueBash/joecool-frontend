import { stockCategories } from "@/api/settings/stock/categories";
import { stockCategoryGroups } from "@/api/settings/stock/category-groups";
import { COMMON_FIELDS } from "./constants";
import type { SettingsResource, SettingsResourceEntry } from "./types";

/**
 * Maps a settings-section slug (see `lib/config/settings-paths.ts`) to the
 * resource + UI metadata required to render its CRUD inline. Add an entry
 * here when you wire a new settings catalog through the API.
 */
export const settingsResourceRegistry: Partial<Record<string, SettingsResourceEntry>> = {
  category: {
    resource: stockCategories as unknown as SettingsResource,
    singular: "Category",
    plural: "Categories",
    fields: COMMON_FIELDS,
  },
  "category-groups": {
    resource: stockCategoryGroups as unknown as SettingsResource,
    singular: "Category Group",
    plural: "Category Groups",
    fields: COMMON_FIELDS,
  },
};

export function getSettingsResource(slug: string): SettingsResourceEntry | undefined {
  return settingsResourceRegistry[slug];
}
