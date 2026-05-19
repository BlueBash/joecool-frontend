import { createFileRoute, notFound } from "@tanstack/react-router";
import { SettingsPage, SettingsSectionPage } from "@/features/settings";
import { isKnownSettingsPath } from "@/lib/config/settings-paths";

export const settingsRoute = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Joe Cool" }] }),
  component: SettingsPage,
});

export const settingsSplatRoute = createFileRoute("/settings/$")({
  beforeLoad: ({ location }) => {
    if (!isKnownSettingsPath(location.pathname)) {
      throw notFound();
    }
  },
  component: SettingsSectionPage,
});
