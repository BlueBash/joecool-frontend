import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { createResourceKeys } from "@/api/_client";
import type { ApiError } from "@/api/_client/errors";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { fetchReferenceOptions } from "@/lib/reference-sources";
import type { ReferenceOption } from "@/lib/reference";

const referenceKeys = createResourceKeys(["reference-options"]);

export interface UseReferenceOptionsParams {
  klass: string;
  search: string;
  enabled?: boolean;
}

export function useReferenceOptions({ klass, search, enabled = true }: UseReferenceOptionsParams) {
  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  const query = useQuery<ReferenceOption[], ApiError>({
    queryKey: referenceKeys.actions("list", { klass, search: debouncedSearch }),
    queryFn: () => fetchReferenceOptions(klass, debouncedSearch || undefined),
    enabled: enabled && klass.length > 0,
    staleTime: 60_000,
  });

  const options = useMemo(() => query.data ?? [], [query.data]);

  return {
    options,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
