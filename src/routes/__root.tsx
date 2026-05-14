import {
  Outlet,
  Link,
  createRootRoute,
  useRouterState,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { AppShell } from "@/components/app-shell";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/store";
import { paths } from "@/lib/config/paths";

const AUTH_PATHS = new Set<string>([
  paths.login,
  paths.forgotPassword,
  paths.resetPassword,
]);

function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.has(pathname);
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const navigate = useNavigate();

  const onAuthRoute = isAuthPath(pathname);

  useEffect(() => {
    if (!onAuthRoute && !isAuthenticated) {
      const redirect = pathname && pathname !== paths.home ? pathname : undefined;
      navigate({
        to: paths.login,
        replace: true,
        search: redirect ? { redirect } : undefined,
      });
    }
  }, [onAuthRoute, isAuthenticated, pathname, navigate]);

  useEffect(() => {
    if (onAuthRoute && isAuthenticated) {
      navigate({ to: paths.dashboard, replace: true });
    }
  }, [onAuthRoute, isAuthenticated, navigate]);

  if (onAuthRoute) {
    return (
      <>
        <Outlet />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  if (!isAuthenticated) {
    return <Toaster richColors position="top-right" />;
  }

  return (
    <AppShell>
      <Outlet />
      <Toaster richColors position="top-right" />
    </AppShell>
  );
}
