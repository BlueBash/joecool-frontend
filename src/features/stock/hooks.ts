import { useMemo } from "react";
import { stocks } from "@/api/stocks";
import { mapRowToStockItem } from "./map-stock";

interface UseStockDirectoryParams {
  page: number;
  pageSize: number;
  search?: string;
}

/** Paginated stock list — search is handled server-side via `ListParams.search`. */
export function useStockDirectory({ page, pageSize, search }: UseStockDirectoryParams) {
  const list = stocks.hooks.useList(
    { page, pageSize, search: search?.trim() || undefined },
    { keepPreviousData: true },
  );

  const items = useMemo(
    () => (list.data?.items ?? []).map(mapRowToStockItem),
    [list.data?.items],
  );

  return {
    items,
    meta: list.data?.meta ?? { page, pageSize, total: 0, totalPages: 1 },
    isPending: list.isPending,
    isError: list.isError,
    error: list.error,
    refetch: list.refetch,
  };
}

export function useStockDetail(id: string | undefined, enabled: boolean) {
  return stocks.hooks.useDetail(id, { enabled });
}
