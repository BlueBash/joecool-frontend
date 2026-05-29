import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createResourceKeys, http } from "@/api/_client";
import type { ApiEnvelope, ID } from "@/api/_client";
import type { ApiError } from "@/api/_client/errors";
import { denormalizeJsonApiEnvelope } from "@/api/_client/json-api";
import { SUPPLIER_DETAIL_INCLUDE } from "@/api/suppliers/suppliers";
import type {
  SuppStockCostFactorRow,
  SuppStockCostFactorWritePayload,
} from "./types";

const factorKeys = createResourceKeys(["supplier-stock-cost-factors"]);

async function updateFactor(id: ID, payload: SuppStockCostFactorWritePayload) {
  const res = await http.patch<ApiEnvelope<unknown>>(
    `/supp_stock_cost_factors/${id}`,
    { supp_stock_cost_factor: payload },
  );
  return denormalizeJsonApiEnvelope(res.data) as SuppStockCostFactorRow;
}

async function fetchSupplierDefaults(supplierId: ID) {
  const res = await http.get<ApiEnvelope<unknown>>(`/suppliers/${supplierId}`, {
    params: { include: SUPPLIER_DETAIL_INCLUDE },
  });
  const entity = denormalizeJsonApiEnvelope(res.data);
  const factor = entity.supp_stock_cost_factor;
  return factor && typeof factor === "object"
    ? (factor as Record<string, unknown>)
    : null;
}

export const supplierStockCostFactors = {
  keys: factorKeys,
  api: {
    update: updateFactor,
    supplierDefaults: fetchSupplierDefaults,
  },
  queries: {
    supplierDefaults: (supplierId: ID) =>
      queryOptions<Record<string, unknown> | null, ApiError>({
        queryKey: factorKeys.actions("supplier-defaults", supplierId),
        queryFn: () => fetchSupplierDefaults(supplierId),
      }),
  },
  hooks: {
    useUpdate: () => {
      const qc = useQueryClient();
      return useMutation<
        SuppStockCostFactorRow,
        ApiError,
        { id: ID; data: SuppStockCostFactorWritePayload }
      >({
        mutationFn: ({ id, data }) => updateFactor(id, data),
        onSuccess: (_, { id }) => {
          qc.invalidateQueries({ queryKey: factorKeys.detail(id) });
          qc.invalidateQueries({ queryKey: factorKeys.actions("supplier-defaults") });
        },
      });
    },
    useSupplierDefaults: (
      supplierId: ID | null | undefined,
      opts?: { enabled?: boolean },
    ) =>
      useQuery({
        queryKey: factorKeys.actions("supplier-defaults", supplierId ?? ""),
        queryFn: () => fetchSupplierDefaults(supplierId as ID),
        enabled: (opts?.enabled ?? true) && supplierId != null,
      }),
  },
};
