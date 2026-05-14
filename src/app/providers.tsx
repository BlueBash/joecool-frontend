import { ReactNode, useEffect, useMemo } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { authStorage, createQueryClient } from "@/api/_client";
import { useAuth } from "@/store";
import { router } from "./router";
import { paths } from "@/lib/config/paths";

// Backend has no refresh endpoint — wire the seam to a no-op so the
// interceptor stops trying, then let `onAuthError` clear state.
authStorage.registerRefresh(async () => null);

// Lets the TanStack Query DevTools browser extension attach in development.
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const queryClient = useMemo(
    () =>
      createQueryClient({
        onAuthError: () => {
          authStorage.clear();
          useAuth.getState().clear();
          router.navigate({ to: paths.login, replace: true });
        },
        notify: (msg, kind) => {
          if (kind === "error") toast.error(msg);
          else toast(msg);
        },
      }),
    [],
  );

  useEffect(() => {
    if (import.meta.env.DEV) {
      window.__TANSTACK_QUERY_CLIENT__ = queryClient;
    }
  }, [queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
