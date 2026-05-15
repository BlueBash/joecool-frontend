/** First settings leaf URL when visiting `/settings` only */
export const SETTINGS_DEFAULT_PATH = "/settings/stock/category/categories";

/**
 * Maps the current pathname to the canonical settings section id (path after
 * `/settings/`), e.g. `/settings/stock/colors` → `stock/colors`.
 */
export function settingsPathToSlug(pathname: string): string {
  const trimmed = pathname.replace(/\/$/, "") || "/";
  const without = trimmed.replace(/^\/settings\/?/, "");
  return without || "stock/category/categories";
}

/** Builds a settings URL from a section id returned by `settingsPathToSlug`. */
export function slugToSettingsPath(slug: string): string {
  const s = slug.replace(/^\//, "");
  if (!s) return SETTINGS_DEFAULT_PATH;
  return `/settings/${s}`;
}
