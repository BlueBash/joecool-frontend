import { useRouterState } from "@tanstack/react-router";
import { findSettingsRouteGroup } from "@/lib/config/settings-route-groups";
import { sectionTitles } from "@/lib/settings-nav";
import { settingsPathToSlug } from "@/lib/config/settings-paths";
import { getSettingsSection } from "../registry";
import { SettingsResourceForm } from "./SettingsResourceForm";
import { SettingsResourceListing } from "./SettingsResourceListing";
import { SettingsSectionInnerNav } from "./SettingsSectionInnerNav";
import { SettingsSectionPlaceholder } from "./SettingsSectionPlaceholder";

export function SettingsSectionPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const section = settingsPathToSlug(pathname);
  const meta = sectionTitles[section] ?? { title: section, desc: "" };
  const routeGroup = findSettingsRouteGroup(pathname);
  const config = getSettingsSection(section);

  const content = (() => {
    if (!config) return <SettingsSectionPlaceholder />;

    switch (config.view) {
      case "listing":
        return (
          <SettingsResourceListing
            slug={section}
            entry={config.entry}
            title={meta.title}
          />
        );
      case "form":
        return <SettingsResourceForm entry={config.entry} title={meta.title} />;
      case "custom": {
        const Custom = config.component;
        return <Custom slug={section} title={meta.title} />;
      }
    }
  })();

  return (
    <div>
      <div className="sticky top-12">
        <div className="border-b border-border bg-background">
          {routeGroup?.shouldShowInnerNav && (
            <SettingsSectionInnerNav
              routes={routeGroup.routes}
              activeSlug={routeGroup.activeSlug}
              ariaLabel={`${meta.title} subsections`}
            />
          )}
        </div>
        {content}
      </div>
    </div>
  );
}
