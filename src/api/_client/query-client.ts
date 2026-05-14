import {
  MutationCache,
  QueryCache,
  QueryClient,
  type Mutation,
  type Query,
} from "@tanstack/react-query";
import { ApiError } from "./errors";
import type { QueryMeta } from "./types";

interface CreateQueryClientOptions {
  /** Called once when an unrefreshable 401 reaches the cache. */
  onAuthError: () => void;
  /** Display a user-facing notification (sonner, etc.). */
  notify: (message: string, kind: "error" | "info") => void;
}

function readMeta(meta: Query["meta"] | Mutation["meta"] | undefined): QueryMeta {
  return (meta as QueryMeta | undefined) ?? {};
}

export function createQueryClient(opts: CreateQueryClientOptions): QueryClient {
  const handleError = (err: unknown, meta: QueryMeta) => {
    if (!(err instanceof ApiError)) {
      opts.notify("Something went wrong", "error");
      return;
    }
    if (err.isAuth) {
      opts.onAuthError();
      return;
    }
    if (meta.silentError) return;
    // Validation errors are surfaced inline by forms — don't toast.
    if (err.isValidation) return;
    opts.notify(err.message, "error");
  };

  return new QueryClient({
    queryCache: new QueryCache({
      onError: (err, query) => handleError(err, readMeta(query.meta)),
    }),
    mutationCache: new MutationCache({
      onError: (err, _vars, _ctx, mutation) => handleError(err, readMeta(mutation.meta)),
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: (count, err) => {
          if (err instanceof ApiError) {
            if (err.isAuth || err.isForbidden || err.isNotFound || err.isValidation) {
              return false;
            }
          }
          return count < 2;
        },
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      },
      mutations: {
        // Mutations are not assumed idempotent. Opt-in per-mutation if safe.
        retry: 0,
      },
    },
  });
}
