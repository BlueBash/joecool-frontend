import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { slugToSettingsPath } from "@/lib/config/settings-paths";
import type { SettingsRouteNavItem } from "@/lib/config/settings-route-groups";

type SettingsSectionInnerNavProps = {
  routes: SettingsRouteNavItem[];
  activeSlug: string;
  ariaLabel?: string;
};

export function SettingsSectionInnerNav({
  routes,
  activeSlug,
  ariaLabel = "Section navigation",
}: SettingsSectionInnerNavProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="flex items-center gap-1 -mb-px overflow-x-auto"
    >
      {routes.map((route) => {
        const active = route.slug === activeSlug;
        return (
          <Link
            key={route.slug}
            to={slugToSettingsPath(route.slug)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "px-3 py-2 text-[13px] whitespace-nowrap border-b-2 -mb-px transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
}
