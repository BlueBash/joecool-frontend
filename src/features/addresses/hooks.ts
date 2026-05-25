import { useMemo } from "react";
import { addresses } from "@/api/address";
import type { Address, AddressType } from "@/lib/types";
import { addressTypeToApiParam, mapRowToAddress } from "./map-address";

export type AddressKindFilter = "all" | AddressType;

interface UseAddressDirectoryParams {
  page: number;
  pageSize: number;
  search?: string;
  /** `all` → combined directory; `Customer` / `Supplier` → `GET /addresses?type=…` */
  kind?: AddressKindFilter;
}

/** Paginated address list — combined or filtered by kind. */
export function useAddressDirectory({
  page,
  pageSize,
  search,
  kind = "all",
}: UseAddressDirectoryParams) {
  const params = { page, pageSize, search: search?.trim() || undefined };

  const typedList = addresses.hooks.useList(
    kind !== "all" ? addressTypeToApiParam(kind) : "customer",
    params,
    { enabled: kind !== "all", keepPreviousData: true },
  );
  const directoryList = addresses.hooks.useListDirectory(params, {
    enabled: kind === "all",
    keepPreviousData: true,
  });
  const list = kind !== "all" ? typedList : directoryList;

  const items = useMemo(
    () => (list.data?.items ?? []).map(mapRowToAddress),
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

export function addressRowKey(address: Address): string {
  return `${address.type}-${address.id}`;
}

export function useAddressDetail(id: string | undefined, enabled: boolean) {
  return addresses.hooks.useDetail(id, { enabled });
}

export function useAddressCreate(type: AddressType) {
  return addresses.hooks.useCreate(addressTypeToApiParam(type));
}
