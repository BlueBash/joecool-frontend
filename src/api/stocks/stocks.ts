import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { createJsonApiResource, http } from "@/api/_client";
import type { ApiEnvelope, ID } from "@/api/_client";
import type { ApiError } from "@/api/_client/errors";
import { denormalizeJsonApiEnvelope } from "@/api/_client/json-api";
import type {
  GenerateNextCodeParams,
  GenerateNextCodeResult,
  StockPackagingAmountParams,
  StockRow,
  StockWritePayload,
} from "./types";

export const STOCK_LIST_INCLUDE =
  "category,colour,display,selection,gender,assortment,stock_buyer,cost_price";
export const STOCK_DETAIL_INCLUDE = "*";

const stocksBase = createJsonApiResource<StockRow, StockWritePayload>(
  ["stocks"],
  "/stocks",
  "stock",
  {
    defaultListParams: { include: STOCK_LIST_INCLUDE },
    defaultDetailParams: { include: STOCK_DETAIL_INCLUDE },
  },
);

async function cloneStock(stockId: ID) {
  const res = await http.post<ApiEnvelope<unknown>>(`/stocks/${stockId}/clone`);
  return denormalizeJsonApiEnvelope(res.data) as StockRow;
}

async function generateNextCode(params?: GenerateNextCodeParams) {
  const res = await http.get<{ data?: GenerateNextCodeResult; meta?: { message?: string } }>(
    "/stocks/generate_next_code",
    { params },
  );
  return res.data.data ?? (res.data as unknown as GenerateNextCodeResult);
}

async function generateBarcode() {
  const res = await http.get<{
    data?: { pack_barcode: string; retail_barcode: string   };
      meta?: { message?: string };
    }
  >("/stocks/generate_barcode");
  return res.data ?? (res.data as unknown as { pack_barcode: string; retail_barcode: string });
}

async function fetchStockPackagingAmount(params: StockPackagingAmountParams) {
  const res = await http.get<{ data?: Record<string, unknown> }>("/stocks/stock_packaging_amount", {
    params,
  });
  return res.data.data ?? {};
}

async function fetchOrderKindSummary(id: ID) {
  const res = await http.get<{ data?: unknown }>(`/stocks/${id}/order_kind_summary`);
  return res.data.data;
}

async function fetchOrderLevelsInfo(id: ID) {
  const res = await http.get<{ data?: unknown }>(`/stocks/${id}/order_levels_info`);
  return res.data.data;
}

/** Parses `POST /stocks/fitting_message` and `POST /stocks/dimensions_message` bodies. */
export function parseStockSettingsMessageResponse(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const root = data as Record<string, unknown>;
  const legacy = root.message;
  if (legacy && typeof legacy === "object") {
    const text = (legacy as Record<string, unknown>).message;
    if (typeof text === "string") return text;
  }
  const attrs = (root.data as Record<string, unknown> | undefined)?.attributes;
  if (attrs && typeof attrs === "object") {
    const text = (attrs as Record<string, unknown>).message;
    if (typeof text === "string") return text;
  }
  return "";
}

async function fetchDimensionsMessage(payload: Record<string, unknown>) {
  const res = await http.post<unknown>("/stocks/dimensions_message", payload);
  return parseStockSettingsMessageResponse(res.data);
}

async function fetchFittingMessage(payload: Record<string, unknown>) {
  const res = await http.post<unknown>("/stocks/fitting_message", payload);
  return parseStockSettingsMessageResponse(res.data);
}

async function saveSellPrices(payload: Record<string, unknown>) {
  const res = await http.post<{ meta?: { message?: string }; data?: unknown }>(
    "/stock/selling_prices/save_sell_prices",
    payload,
  );
  return res.data;
}

async function fetchGroupedPriceCategories() {
  const res = await http.get<{ data?: unknown }>(
    "/stock/price_categories/grouped_price_categories",
  );
  return res.data.data ?? res.data;
}

async function fetchDimensionFields(params: { dimension_spec: ID }) {
  const res = await http.get<{ data?: unknown }>("/stock/dimension_infos/get_dimension_fields", {
    params,
  });
  return res.data.data ?? res.data;
}

export const stocks = {
  ...stocksBase,
  api: {
    ...stocksBase.api,
    clone: cloneStock,
    generateNextCode,
    generateBarcode,
    stockPackagingAmount: fetchStockPackagingAmount,
    orderKindSummary: fetchOrderKindSummary,
    orderLevelsInfo: fetchOrderLevelsInfo,
    dimensionsMessage: fetchDimensionsMessage,
    fittingMessage: fetchFittingMessage,
    saveSellPrices,
    groupedPriceCategories: fetchGroupedPriceCategories,
    dimensionFields: fetchDimensionFields,
  },
  queries: {
    ...stocksBase.queries,
    generateNextCode: (params?: GenerateNextCodeParams) =>
      queryOptions<GenerateNextCodeResult, ApiError>({
        queryKey: stocksBase.keys.actions("generate-next-code", params),
        queryFn: () => generateNextCode(params),
      }),
    orderLevelsInfo: (id: ID) =>
      queryOptions<unknown, ApiError>({
        queryKey: stocksBase.keys.actions("order-levels-info", id),
        queryFn: () => fetchOrderLevelsInfo(id),
      }),
    groupedPriceCategories: () =>
      queryOptions<unknown, ApiError>({
        queryKey: stocksBase.keys.actions("grouped-price-categories"),
        queryFn: () => fetchGroupedPriceCategories(),
      }),
    dimensionFields: (params: { dimension_spec: ID }) =>
      queryOptions<unknown, ApiError>({
        queryKey: stocksBase.keys.actions("dimension-fields", params),
        queryFn: () => fetchDimensionFields(params),
      }),
  },
  hooks: {
    ...stocksBase.hooks,
    useUpdate: (
      opts?: UseMutationOptions<StockRow, ApiError, { id: ID; data: StockWritePayload }>,
    ) => {
      const qc = useQueryClient();
      return useMutation<StockRow, ApiError, { id: ID; data: StockWritePayload }>({
        ...opts,
        mutationFn: ({ id, data }) => stocksBase.api.update(id, data),
        onSuccess: (...args) => {
          const [, vars] = args;
          // PATCH body omits `include`; refetch detail instead of caching a thin row.
          qc.invalidateQueries({ queryKey: stocksBase.keys.detail(vars.id) });
          qc.invalidateQueries({ queryKey: stocksBase.keys.lists() });
          return opts?.onSuccess?.(...args);
        },
      });
    },
    useDetail: (id: ID | null | undefined, opts?: { enabled?: boolean; staleTime?: number }) => {
      const enabled = (opts?.enabled ?? true) && id != null && id !== "new";
      return useQuery({
        queryKey: stocksBase.keys.detail((id ?? "") as ID),
        queryFn: () => stocksBase.api.detail(id as ID),
        enabled,
        staleTime: opts?.staleTime,
      });
    },
    useClone: () => {
      const qc = useQueryClient();
      return useMutation<StockRow, ApiError, { id: ID }>({
        mutationFn: ({ id }) => cloneStock(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: stocksBase.keys.lists() }),
      });
    },
    useGenerateNextCode: (params?: GenerateNextCodeParams, opts?: { enabled?: boolean }) =>
      useQuery({
        queryKey: stocksBase.keys.actions("generate-next-code", params),
        queryFn: () => generateNextCode(params),
        enabled: opts?.enabled ?? false,
      }),
    useOrderLevelsInfo: (id: ID | null | undefined) =>
      useQuery({
        queryKey: stocksBase.keys.actions("order-levels-info", id ?? ""),
        queryFn: () => fetchOrderLevelsInfo(id as ID),
        enabled: id != null,
      }),
    useGroupedPriceCategories: (opts?: { enabled?: boolean }) =>
      useQuery({
        queryKey: stocksBase.keys.actions("grouped-price-categories"),
        queryFn: () => fetchGroupedPriceCategories(),
        enabled: opts?.enabled ?? true,
      }),
    useDimensionFields: (
      params: { dimension_spec: ID } | null | undefined,
      opts?: { enabled?: boolean },
    ) =>
      useQuery({
        queryKey: stocksBase.keys.actions("dimension-fields", params),
        queryFn: () => fetchDimensionFields(params as { dimension_spec: ID }),
        enabled: (opts?.enabled ?? true) && params != null,
      }),
    useSaveSellPrices: () => {
      const qc = useQueryClient();
      return useMutation<unknown, ApiError, Record<string, unknown>>({
        mutationFn: (payload) => saveSellPrices(payload),
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: stocksBase.keys.all() });
          qc.invalidateQueries({ queryKey: ["stocks", "selling-prices"] });
        },
      });
    },
    useDimensionsMessage: () =>
      useMutation<string, ApiError, Record<string, unknown>>({
        mutationFn: (payload) => fetchDimensionsMessage(payload),
      }),
    useFittingMessage: () =>
      useMutation<string, ApiError, Record<string, unknown>>({
        mutationFn: (payload) => fetchFittingMessage(payload),
      }),
  },
};

export const stockBlurbs = createJsonApiResource(["stocks", "blurbs"], "/stock/blurbs", "blurb", {
  defaultListParams: { include: "stock" },
});

export const stockNotes = createJsonApiResource(["stocks", "notes"], "/stock/notes", "note", {
  defaultListParams: { include: "stock" },
});

export const stockDimensionInfos = createJsonApiResource(
  ["stocks", "dimension-infos"],
  "/stock/dimension_infos",
  "dimension_info",
);

export const stockFittingInfos = createJsonApiResource(
  ["stocks", "fitting-infos"],
  "/stock/fitting_infos",
  "fitting_info",
);

export const stockCostPrices = createJsonApiResource(
  ["stocks", "cost-prices"],
  "/stock/cost_prices",
  "cost_price",
);

export const stockSellingPrices = createJsonApiResource(
  ["stocks", "selling-prices"],
  "/stock/selling_prices",
  "selling_price",
);

export const stockPriceCategories = createJsonApiResource(
  ["stocks", "price-categories"],
  "/stock/price_categories",
  "price_category",
  { defaultListParams: { include: "currency" } },
);
