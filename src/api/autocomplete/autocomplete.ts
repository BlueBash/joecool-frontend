import { queryOptions, useQuery } from "@tanstack/react-query";
import { createResourceKeys } from "@/api/_client";
import type { ApiError } from "@/api/_client/errors";
import { fetchReferenceOptions } from "@/lib/reference-sources";
import type { AutocompleteOption, AutocompleteParams } from "./types";

const autocompleteKeys = createResourceKeys(["autocomplete"]);

/** @deprecated Uses platform list APIs — `/autocompletes` is not available on the backend. */
async function fetchAutocomplete(params: AutocompleteParams): Promise<AutocompleteOption[]> {
  return fetchReferenceOptions(params.klass, params.search);
}

export const autocomplete = {
  keys: autocompleteKeys,
  api: { list: fetchAutocomplete },
  queries: {
    list: (params: AutocompleteParams) =>
      queryOptions<AutocompleteOption[], ApiError>({
        queryKey: autocompleteKeys.actions("list", params),
        queryFn: () => fetchAutocomplete(params),
      }),
  },
  hooks: {
    useList: (params: AutocompleteParams | null | undefined, opts?: { enabled?: boolean }) =>
      useQuery({
        queryKey: autocompleteKeys.actions("list", params),
        queryFn: () => fetchAutocomplete(params as AutocompleteParams),
        enabled: (opts?.enabled ?? true) && params != null && params.klass.length > 0,
        staleTime: 60_000,
      }),
  },
};
