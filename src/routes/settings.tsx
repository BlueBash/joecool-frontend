import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage, SettingsSectionPage } from "@/features/settings";

export const settingsRoute = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Joe Cool" }] }),
  component: SettingsPage,
});

export const settingsSplatRoute = createFileRoute("/settings/$")({
  component: SettingsSectionPage,
});
