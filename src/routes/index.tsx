import { createFileRoute, Navigate } from "@tanstack/react-router";
import { HOME_REDIRECT } from "@/lib/config/paths";

export const Route = createFileRoute("/")({
  component: HomeRedirect,
});

function HomeRedirect() {
  return <Navigate to={HOME_REDIRECT} replace />;
}
