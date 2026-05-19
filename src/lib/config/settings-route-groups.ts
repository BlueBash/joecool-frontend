import { paths } from "@/lib/config/paths";
import { isSettingsPathsRouteGroup, settingsPathToSlug } from "@/lib/config/settings-paths";
import { resolveSectionLabel } from "@/lib/config/settings-section-meta";

export type SettingsRouteNavItem = {
  path: string;
  slug: string;
  label: string;
};

export type SettingsRouteGroupMatch = {
  routes: SettingsRouteNavItem[];
  shouldShowInnerNav: boolean;
  activeSlug: string;
};

/** One settings module group derived from a `paths` route-array key. */
export type SettingsPathGroup = {
  key: string;
  basePath: string;
  routes: readonly string[];
  showInnerNav: boolean;
  slug: string;
  label: string;
  domain: string;
};

/** Derives the settings domain slug from a `paths` key prefix. */
export function domainFromPathsKey(key: string): string {
  if (key.startsWith("settingsStock")) return "stock";
  if (key.startsWith("settingsPrice")) return "price";
  if (key.startsWith("settingsAddress")) return "address";
  if (key.startsWith("settingsMessages")) return "messages";
  if (key.startsWith("settingsOthers")) return "others";
  return "other";
}

/** All settings module route groups from `paths` (single source of truth). */
export function getSettingsRouteGroups(): readonly (readonly string[])[] {
  const groups: (readonly string[])[] = [];
  for (const value of Object.values(paths)) {
    if (isSettingsPathsRouteGroup(value)) {
      groups.push(value);
    }
  }
  return groups;
}

/** Structured route groups with inner-nav flags — one entry per `paths` array key. */
export function getSettingsPathGroups(): SettingsPathGroup[] {
  const result: SettingsPathGroup[] = [];

  for (const [key, value] of Object.entries(paths)) {
    if (!isSettingsPathsRouteGroup(value)) continue;

    const routes = value;
    const basePath = routes[0];
    const slug = settingsPathToSlug(basePath);

    result.push({
      key,
      basePath,
      routes,
      showInnerNav: routes.length > 1,
      slug,
      label: resolveSectionLabel(slug),
      domain: domainFromPathsKey(key),
    });
  }

  return result;
}

/** Show in-page tabs when a route group has more than one path. */
export function shouldShowSettingsInnerNav(routeCount: number): boolean {
  return routeCount > 1;
}

/** @alias shouldShowSettingsInnerNav */
export const shouldShowInnerNav = shouldShowSettingsInnerNav;

function toNavItems(routes: readonly string[]): SettingsRouteNavItem[] {
  return routes.map((path) => {
    const slug = settingsPathToSlug(path);
    return { path, slug, label: resolveSectionLabel(slug) };
  });
}

/** Finds the route group containing `pathname` and builds inner-nav items when applicable. */
export function findSettingsRouteGroup(pathname: string): SettingsRouteGroupMatch | null {
  const activeSlug = settingsPathToSlug(pathname);

  for (const group of getSettingsRouteGroups()) {
    const isMatch = group.some((route) => settingsPathToSlug(route) === activeSlug);
    if (!isMatch) continue;

    const routes = toNavItems(group);
    return {
      routes,
      shouldShowInnerNav: shouldShowSettingsInnerNav(routes.length),
      activeSlug,
    };
  }

  return null;
}
