import { paths } from "@/lib/config/paths";

/** First settings leaf URL when visiting `/settings` only */
export const SETTINGS_DEFAULT_PATH = paths.settingsStockDetailsCategoryRoutes[0];

const SETTINGS_DEFAULT_SLUG = SETTINGS_DEFAULT_PATH.replace(/^\/settings\/?/, "");

export function isSettingsPathsRouteGroup(value: unknown): value is readonly string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (item) => typeof item === "string" && item.startsWith(`${paths.settings}/`),
    )
  );
}

/** Every leaf settings URL from `paths`. */
export function getAllSettingsPaths(): readonly string[] {
  const leafPaths: string[] = [];
  for (const value of Object.values(paths)) {
    if (isSettingsPathsRouteGroup(value)) {
      leafPaths.push(...value);
    }
  }
  return leafPaths;
}

export function isKnownSettingsPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return getAllSettingsPaths().some((path) => path === normalized);
}

/**
 * Maps the current pathname to the canonical settings section id (path after
 * `/settings/`), e.g. `/settings/stock/colors` → `stock/colors`.
 */
export function settingsPathToSlug(pathname: string): string {
  const trimmed = pathname.replace(/\/$/, "") || "/";
  const without = trimmed.replace(/^\/settings\/?/, "");
  return without || SETTINGS_DEFAULT_SLUG;
}

/** Builds a settings URL from a section id returned by `settingsPathToSlug`. */
export function slugToSettingsPath(slug: string): string {
  const s = slug.replace(/^\//, "");
  if (!s) return SETTINGS_DEFAULT_PATH;
  return `/settings/${s}`;
}
