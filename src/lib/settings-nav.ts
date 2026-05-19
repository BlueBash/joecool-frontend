// Settings navigation tree — supports arbitrary nesting.
//
// A "group" is a collapsible bucket in the sidebar.
// A "section" is a leaf navigable page (renders /settings/$section).
// A group can contain sections, nested groups, or both.
import { buildSettingsNavTreeFromPaths } from "@/lib/config/settings-route-nav";
import type { SettingsGroup, SettingsSection, SettingsTrail } from "@/lib/config/settings-nav-types";

export type { SettingsGroup, SettingsSection, SettingsTrail } from "@/lib/config/settings-nav-types";
export { sectionTitles } from "@/lib/config/settings-section-meta";

/** Top-level Stock group: nested sub-areas list in sidebar; their sections use in-page tabs only */
export const SETTINGS_STOCK_SIDEBAR_ROOT_SLUG = "stock";

export const settingsTree: SettingsGroup[] = buildSettingsNavTreeFromPaths();

export function findSettingsTrail(
  slug: string,
  tree: SettingsGroup[] = settingsTree,
  ancestors: SettingsGroup[] = [],
): SettingsTrail | undefined {
  for (const g of tree) {
    const chain = [...ancestors, g];
    const hit = g.sections?.find((s) => s.slug === slug);
    if (hit) return { groups: chain, section: hit, siblings: g.sections ?? [] };
    if (g.groups) {
      const nested = findSettingsTrail(slug, g.groups, chain);
      if (nested) return nested;
    }
  }
  return undefined;
}

export function firstSection(group: SettingsGroup): SettingsSection | undefined {
  if (group.sections?.length) return group.sections[0];
  if (group.groups?.length) {
    for (const g of group.groups) {
      const s = firstSection(g);
      if (s) return s;
    }
  }
  return undefined;
}

export function countSections(group: SettingsGroup): number {
  let n = group.sections?.length ?? 0;
  group.groups?.forEach((g) => {
    n += countSections(g);
  });
  return n;
}
