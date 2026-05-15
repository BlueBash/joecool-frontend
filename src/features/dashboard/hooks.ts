import { useMemo } from "react";
import { addresses } from "@/api/address";
import { stocks } from "@/api/stocks";

/** Lightweight dashboard aggregates from list endpoints (no dedicated dashboard API). */
export function useDashboardSummary() {
  const stockList = stocks.hooks.useList({ page: 1, pageSize: 1 });
  const supplierList = addresses.hooks.useList("supplier", { page: 1, pageSize: 1 });
  const customerList = addresses.hooks.useList("customer", { page: 1, pageSize: 1 });

  const isPending =
    stockList.isPending || supplierList.isPending || customerList.isPending;

  const isError = stockList.isError || supplierList.isError || customerList.isError;

  const summary = useMemo(
    () => ({
      stockTotal: stockList.data?.meta.total ?? 0,
      supplierTotal: supplierList.data?.meta.total ?? 0,
      customerTotal: customerList.data?.meta.total ?? 0,
    }),
    [stockList.data?.meta.total, supplierList.data?.meta.total, customerList.data?.meta.total],
  );

  const refetch = () => {
    void Promise.all([stockList.refetch(), supplierList.refetch(), customerList.refetch()]);
  };

  return { summary, isPending, isError, refetch };
}
