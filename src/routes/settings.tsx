import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { SettingsPage, SettingsSectionPage } from "@/features/settings";
import { paths } from "@/lib/config/paths";
import {
  isKnownSettingsPath,
  SETTINGS_DEFAULT_PATH,
} from "@/lib/config/settings-paths";

export const settingsRoute = createFileRoute("/settings")({
  beforeLoad: ({ location }) => {
    const normalized = location.pathname.replace(/\/$/, "") || "/";
    if (normalized === paths.settings) {
      throw redirect({ href: SETTINGS_DEFAULT_PATH });
    }
  },
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
