import { useQuery } from "@tanstack/react-query";
import { stocks } from "@/api/stocks";
import type { ApiError } from "@/api/_client";
import { parseOrderKindSummary } from "./order-kind-summary";

export function useOrderKindSummary(stockId: string, enabled: boolean) {
  const query = useQuery<unknown, ApiError>({
    queryKey: stocks.keys.actions("order-kind-summary", stockId),
    queryFn: () => stocks.api.orderKindSummary(stockId),
    enabled: enabled && stockId !== "new",
  });

  const grids = parseOrderKindSummary(query.data);

  return {
    ...query,
    grids,
  };
}
