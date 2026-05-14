import { createFileRoute } from "@tanstack/react-router";
import { TimeKeepingPage } from "@/features/time-keeping/TimeKeepingPage";

export const Route = createFileRoute("/timekeeping")({
  head: () => ({ meta: [{ title: "Time Keeping — Joe Cool" }] }),
  component: TimeKeepingPage,
});
