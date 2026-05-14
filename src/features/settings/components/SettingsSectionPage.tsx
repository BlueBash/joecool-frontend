import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { findSettingsTrail, sectionTitles } from "@/lib/settings-nav";
import { settingsPathToSlug, slugToSettingsPath } from "@/lib/config/settings-paths";
import { SettingsResourceListing } from "./SettingsResourceListing";

export function SettingsSectionPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const section = settingsPathToSlug(pathname);
  const meta = sectionTitles[section] ?? { title: section, desc: "" };
  const trail = findSettingsTrail(section);
  const siblings = trail?.siblings ?? [];

  return (
    <div>
      <div className="sticky top-12">
        <div className="border-b border-border bg-background">
          {siblings.length > 1 && (
            <nav
              aria-label={`${meta.title} subsections`}
              className="flex items-center gap-1 -mb-px overflow-x-auto"
            >
              {siblings.map((t) => {
                const active = t.slug === section;
                return (
                  <Link
                    key={t.slug}
                    to={slugToSettingsPath(t.slug)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "px-3 py-2 text-[13px] whitespace-nowrap border-b-2 -mb-px transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "border-primary text-primary font-medium"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
        <SettingsResourceListing slug={section} title={meta.title} />
      </div>
    </div>
  );
}
