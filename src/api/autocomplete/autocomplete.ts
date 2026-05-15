import { queryOptions, useQuery } from "@tanstack/react-query";
import { createResourceKeys, http } from "@/api/_client";
import type { ApiError } from "@/api/_client/errors";
import type { AutocompleteOption, AutocompleteParams } from "./types";

const autocompleteKeys = createResourceKeys(["autocomplete"]);

interface AutocompleteWireResponse {
  message?: {
    message?: string;
    data?: AutocompleteOption[];
  };
}

async function fetchAutocomplete(params: AutocompleteParams): Promise<AutocompleteOption[]> {
  const res = await http.get<AutocompleteWireResponse>("/autocompletes", {
    params: { klass: params.klass, search: params.search },
  });
  return res.data.message?.data ?? [];
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
      }),
  },
};
