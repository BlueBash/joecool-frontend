import { useMemo } from "react";
import { users } from "@/api/users";
import type { Operator } from "@/lib/types";
import { mapRowToOperator } from "./map-operator";

interface UseOperatorDirectoryParams {
  page: number;
  pageSize: number;
  search?: string;
}

export function useOperatorDirectory({ page, pageSize, search }: UseOperatorDirectoryParams) {
  const list = users.hooks.useList(
    { page, pageSize, search: search?.trim() || undefined },
    { keepPreviousData: true },
  );

  const items = useMemo(
    () => (list.data?.items ?? []).map(mapRowToOperator),
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

export function useOperatorDetail(id: string | undefined, enabled: boolean) {
  return users.hooks.useDetail(id, { enabled });
}

export function useOperatorCreate() {
  return users.hooks.useCreate();
}

export function useOperatorUpdate() {
  return users.hooks.useUpdate();
}

export function useOperatorDelete() {
  return users.hooks.useDelete();
}

export function useOperatorFromDetail(
  id: string | undefined,
  enabled: boolean,
): {
  operator: Operator | undefined;
  isPending: boolean;
  isError: boolean;
  error: unknown;
} {
  const detail = useOperatorDetail(id, enabled);
  const operator = useMemo(
    () => (detail.data ? mapRowToOperator(detail.data) : undefined),
    [detail.data],
  );
  return {
    operator,
    isPending: detail.isPending,
    isError: detail.isError,
    error: detail.error,
  };
}
