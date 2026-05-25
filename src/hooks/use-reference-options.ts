import { useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createResourceKeys } from "@/api/_client";
import type { ApiError } from "@/api/_client/errors";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { fetchReferenceOptions } from "@/lib/reference-sources";
import type { ReferenceDisplayConfig } from "@/lib/reference-display";
import type { ReferenceOption } from "@/lib/reference";

const referenceKeys = createResourceKeys(["reference-options"]);

export interface UseReferenceOptionsParams {
  klass: string;
  search: string;
  enabled?: boolean;
  displayConfig?: ReferenceDisplayConfig;
}

export function useReferenceOptions({
  klass,
  search,
  enabled = true,
  displayConfig,
}: UseReferenceOptionsParams) {
  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  const query = useQuery<ReferenceOption[], ApiError>({
    queryKey: referenceKeys.actions("list", { klass, search: debouncedSearch }),
    queryFn: () => fetchReferenceOptions(klass, debouncedSearch || undefined, displayConfig),
    enabled: enabled && klass.length > 0,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });

  const options = useMemo(() => query.data ?? [], [query.data]);

  return {
    options,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
