import { useMemo } from "react";
import { addresses, type AddressTypeParam } from "@/api/address";
import type { ApiError } from "@/api/_client/errors";
import type { Address, AddressType } from "@/lib/types";
import { addressTypeToApiParam, mapRowToAddress } from "./map-address";

export type AddressListFilter = "all" | AddressType;

interface UseAddressDirectoryParams {
  page: number;
  pageSize: number;
  search?: string;
  typeFilter?: AddressListFilter;
}

function listParams(page: number, pageSize: number, search?: string) {
  return { page, pageSize, search: search?.trim() || undefined };
}

export function addressRowKey(address: Address): string {
  return `${address.type}-${address.id}`;
}

function mergeAddressRows(...groups: Address[][]): Address[] {
  const seen = new Set<string>();
  const rows: Address[] = [];
  for (const group of groups) {
    for (const row of group) {
      const key = addressRowKey(row);
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push(row);
    }
  }
  return rows;
}

/**
 * Loads address directory rows. When `typeFilter` is `all`, fetches supplier and
 * customer lists in parallel (each with server pagination/search). Combined totals
 * are approximate — prefer a single-type filter for accurate paging.
 */
export function useAddressDirectory({
  page,
  pageSize,
  search,
  typeFilter = "all",
}: UseAddressDirectoryParams) {
  const params = listParams(page, pageSize, search);
  const fetchSuppliers = typeFilter !== "Customer";
  const fetchCustomers = typeFilter !== "Supplier";

  const supplierQuery = addresses.hooks.useList("supplier", params, {
    enabled: fetchSuppliers,
    keepPreviousData: true,
  });

  const customerQuery = addresses.hooks.useList("customer", params, {
    enabled: fetchCustomers,
    keepPreviousData: true,
  });

  const supplierFallback = addresses.hooks.useListSuppliers(params, {
    enabled:
      fetchSuppliers &&
      supplierQuery.isError &&
      (supplierQuery.error as ApiError)?.isNotFound === true,
  });

  const supplierData =
    supplierQuery.isSuccess || !supplierFallback.isEnabled
      ? supplierQuery.data
      : supplierFallback.data;

  const isPending =
    (fetchSuppliers && (supplierQuery.isPending || supplierFallback.isFetching)) ||
    (fetchCustomers && customerQuery.isPending);

  const isError =
    typeFilter === "Supplier"
      ? supplierQuery.isError && !supplierFallback.isSuccess && supplierFallback.isError
      : typeFilter === "Customer"
        ? customerQuery.isError
        : fetchSuppliers &&
          fetchCustomers &&
          supplierQuery.isError &&
          customerQuery.isError &&
          !supplierFallback.isSuccess &&
          supplierFallback.isError;

  const error = supplierQuery.error ?? customerQuery.error ?? supplierFallback.error;

  const items = useMemo(() => {
    const suppliers =
      fetchSuppliers && supplierData?.items ? supplierData.items.map(mapRowToAddress) : [];
    const customers =
      fetchCustomers && customerQuery.data?.items
        ? customerQuery.data.items.map(mapRowToAddress)
        : [];
    return mergeAddressRows(suppliers, customers);
  }, [fetchSuppliers, fetchCustomers, supplierData?.items, customerQuery.data?.items]);

  const meta = useMemo(() => {
    if (typeFilter === "Supplier" && supplierData?.meta) return supplierData.meta;
    if (typeFilter === "Customer" && customerQuery.data?.meta) return customerQuery.data.meta;

    const total =
      (fetchSuppliers ? (supplierData?.meta.total ?? 0) : 0) +
      (fetchCustomers ? (customerQuery.data?.meta.total ?? 0) : 0);
    return {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }, [typeFilter, supplierData?.meta, customerQuery.data?.meta, fetchSuppliers, fetchCustomers, page, pageSize]);

  const refetch = () => {
    void Promise.all([
      supplierQuery.refetch(),
      customerQuery.refetch(),
      supplierFallback.refetch(),
    ]);
  };

  return { items, meta, isPending, isError, error, refetch };
}

export function useAddressDetail(id: string | undefined, enabled: boolean) {
  return addresses.hooks.useDetail(id, { enabled });
}

export function useAddressCreate(type: AddressType) {
  return addresses.hooks.useCreate(addressTypeToApiParam(type));
}
