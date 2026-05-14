import type { ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { ApiError } from "@/api/_client";
import { Loader2 } from "lucide-react";

interface QueryStateProps<T> {
  query: UseQueryResult<T, unknown>;
  children: (data: T) => ReactNode;
  empty?: ReactNode;
  isEmpty?: (data: T) => boolean;
  loadingFallback?: ReactNode;
}

export function QueryState<T>({
  query,
  children,
  empty,
  isEmpty,
  loadingFallback,
}: QueryStateProps<T>) {
  if (query.isPending) {
    return (
      loadingFallback ?? (
        <div
          role="status"
          aria-live="polite"
          aria-label="Loading"
          className="flex items-center gap-2 px-4 py-8 text-sm text-muted-foreground"
        >
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Loading…
        </div>
      )
    );
  }

  if (query.isError) {
    const err = query.error;
    const apiErr = err instanceof ApiError ? err : null;
    return (
      <div
        role="alert"
        className="m-4 rounded-md border border-destructive/40 bg-destructive/5 p-4"
      >
        <p className="text-sm font-medium text-destructive">
          {apiErr?.code ?? "Error"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {apiErr?.message ?? "Something went wrong"}
        </p>
        <button
          type="button"
          onClick={() => query.refetch()}
          className="mt-3 inline-flex h-8 items-center rounded-md border border-input bg-background px-3 text-xs font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Try again
        </button>
      </div>
    );
  }

  const data = query.data as T;
  if (isEmpty?.(data) && empty !== undefined) {
    return <>{empty}</>;
  }

  return <>{children(data)}</>;
}
