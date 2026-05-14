import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/features/dashboard/DashboardPage";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Joe Cool" }] }),
  component: DashboardPage,
});
