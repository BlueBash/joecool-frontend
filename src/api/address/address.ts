import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createJsonApiResource,
  createResourceKeys,
  flattenParams,
  http,
  mergeListParams,
} from "@/api/_client";
import type { ApiEnvelope, ID, ListParams, Paginated } from "@/api/_client";
import type { ApiError } from "@/api/_client/errors";
import {
  denormalizeJsonApiCollection,
  denormalizeJsonApiEnvelope,
  denormalizeJsonApiEntity,
  paginatedFromJsonApi,
} from "@/api/_client/json-api";
import type { IncludedMap, JsonApiListMeta } from "@/api/_client/json-api";
import type {
  AddressCreatePayload,
  AddressRow,
  AddressTypeParam,
  FetchParticularSpecialPriceParams,
  FetchSellingPriceParams,
  SellingPriceAttributes,
} from "./types";

const ADDRESS_DETAIL_INCLUDE =
  "category,account_manager,agent,area,profit_centre,note,contacts,invoice_env,credit_env,order_currency,order_price,order_cost_code,order_kind,language,label_source,special_invs,vat_kind,vat_rate_code,ship_from,warehouse,ship_method,shipping_charge,pay_term,pay_method,bank_account,delivery_addresses";

const SPECIAL_PRICE_INCLUDE = "address,stock,currency";

function mapRow(raw: unknown, includedMap?: IncludedMap): AddressRow {
  return denormalizeJsonApiEntity(raw, includedMap) as AddressRow;
}

// --- Main addresses ---

const addressKeys = createResourceKeys(["addresses"]);

async function createAddress(type: AddressTypeParam, payload: AddressCreatePayload) {
  const res = await http.post<ApiEnvelope<unknown>>(
    "/addresses",
    { address: payload },
    { params: { type } },
  );
  return denormalizeJsonApiEnvelope(res.data) as AddressRow;
}

async function fetchAddress(id: ID) {
  const res = await http.get<ApiEnvelope<unknown>>(`/addresses/${id}`, {
    params: flattenParams({ include: ADDRESS_DETAIL_INCLUDE }),
  });
  return denormalizeJsonApiEnvelope(res.data) as AddressRow;
}

async function listAddresses(
  type: AddressTypeParam,
  params?: ListParams,
): Promise<Paginated<AddressRow>> {
  const merged = mergeListParams(undefined, params);
  const res = await http.get<ApiEnvelope<unknown[]>>("/addresses", {
    params: { type, ...flattenParams(merged) },
  });
  return paginatedFromJsonApi(
    res.data as { data?: unknown; included?: unknown[]; meta?: JsonApiListMeta },
    merged,
    (raw, includedMap) => {
      const row = mapRow(raw, includedMap);
      row.type = type;
      return row;
    },
  );
}

async function listSuppliers(params?: ListParams): Promise<Paginated<AddressRow>> {
  const merged = mergeListParams(undefined, params);
  const res = await http.get<ApiEnvelope<unknown[]>>("/suppliers", {
    params: flattenParams(merged),
  });
  return paginatedFromJsonApi(
    res.data as { data?: unknown; included?: unknown[]; meta?: JsonApiListMeta },
    merged,
    (raw, includedMap) => {
      const row = mapRow(raw, includedMap);
      row.type = "supplier";
      return row;
    },
  );
}

async function updateAddress(id: ID, payload: AddressCreatePayload) {
  const res = await http.patch<ApiEnvelope<unknown>>(`/addresses/${id}`, { address: payload });
  return denormalizeJsonApiEnvelope(res.data) as AddressRow;
}

export const addresses = {
  keys: addressKeys,
  api: {
    detail: fetchAddress,
    list: listAddresses,
    listSuppliers,
    update: updateAddress,
    createSupplier: (payload: AddressCreatePayload) => createAddress("supplier", payload),
    createCustomer: (payload: AddressCreatePayload) => createAddress("customer", payload),
  },
  queries: {
    detail: (id: ID) =>
      queryOptions<AddressRow, ApiError>({
        queryKey: addressKeys.detail(id),
        queryFn: () => fetchAddress(id),
      }),
    list: (type: AddressTypeParam, params?: ListParams) =>
      queryOptions<Paginated<AddressRow>, ApiError>({
        queryKey: addressKeys.list({ ...params, filters: { ...params?.filters, type } }),
        queryFn: () => listAddresses(type, params),
      }),
    listSuppliers: (params?: ListParams) =>
      queryOptions<Paginated<AddressRow>, ApiError>({
        queryKey: addressKeys.actions("suppliers", params),
        queryFn: () => listSuppliers(params),
      }),
  },
  hooks: {
    useList: (
      type: AddressTypeParam,
      params?: ListParams,
      opts?: { enabled?: boolean; keepPreviousData?: boolean },
    ) =>
      useQuery({
        queryKey: addressKeys.list({ ...params, filters: { ...params?.filters, type } }),
        queryFn: () => listAddresses(type, params),
        enabled: opts?.enabled ?? true,
        placeholderData: opts?.keepPreviousData
          ? (prev) => prev as Paginated<AddressRow> | undefined
          : undefined,
      }),
    useListSuppliers: (params?: ListParams, opts?: { enabled?: boolean }) =>
      useQuery({
        queryKey: addressKeys.actions("suppliers", params),
        queryFn: () => listSuppliers(params),
        enabled: opts?.enabled ?? true,
      }),
    useDetail: (id: ID | null | undefined, opts?: { enabled?: boolean; staleTime?: number }) => {
      const enabled = (opts?.enabled ?? true) && id != null && id !== "new";
      return useQuery({
        queryKey: addressKeys.detail((id ?? "") as ID),
        queryFn: () => fetchAddress(id as ID),
        enabled,
        staleTime: opts?.staleTime,
      });
    },
    useCreateSupplier: () => {
      const qc = useQueryClient();
      return useMutation<AddressRow, ApiError, AddressCreatePayload>({
        mutationFn: (payload) => createAddress("supplier", payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: addressKeys.all() }),
      });
    },
    useCreateCustomer: () => {
      const qc = useQueryClient();
      return useMutation<AddressRow, ApiError, AddressCreatePayload>({
        mutationFn: (payload) => createAddress("customer", payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: addressKeys.all() }),
      });
    },
    useCreate: (type: AddressTypeParam) => {
      const qc = useQueryClient();
      return useMutation<AddressRow, ApiError, AddressCreatePayload>({
        mutationFn: (payload) => createAddress(type, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: addressKeys.all() }),
      });
    },
    useUpdate: () => {
      const qc = useQueryClient();
      return useMutation<AddressRow, ApiError, { id: ID; data: AddressCreatePayload }>({
        mutationFn: ({ id, data }) => updateAddress(id, data),
        onSuccess: (data, { id }) => {
          qc.setQueryData(addressKeys.detail(id), data);
          qc.invalidateQueries({ queryKey: addressKeys.lists() });
        },
      });
    },
  },
};

// --- Nested resources ---

export const addressNotes = createJsonApiResource(
  ["address", "notes"],
  "/address/notes",
  "note",
);

export const addressDeliveryAddresses = createJsonApiResource(
  ["address", "delivery-addresses"],
  "/address/delivery_addresses",
  "delivery_address",
  {
    defaultListParams: { include: "country" },
    defaultDetailParams: { include: "country" },
  },
);

const contactKeys = createResourceKeys(["address", "contacts"]);
const contactDetailParams = { include: "role,department" } satisfies ListParams;

async function fetchContact(id: ID) {
  const res = await http.get<ApiEnvelope<unknown>>(`/address/contacts/${id}`, {
    params: flattenParams(contactDetailParams),
  });
  return denormalizeJsonApiEnvelope(res.data) as AddressRow;
}

async function updateContact(id: ID, payload: Record<string, unknown>) {
  const res = await http.patch<ApiEnvelope<unknown>>(
    `/address/contacts/${id}`,
    { contact: payload },
    { params: flattenParams(contactDetailParams) },
  );
  return denormalizeJsonApiEnvelope(res.data) as AddressRow;
}

async function deleteContact(id: ID) {
  await http.delete(`/address/contacts/${id}`);
}

export const addressContacts = {
  keys: contactKeys,
  api: {
    detail: fetchContact,
    update: updateContact,
    delete: deleteContact,
  },
  queries: {
    detail: (id: ID) =>
      queryOptions<AddressRow, ApiError>({
        queryKey: contactKeys.detail(id),
        queryFn: () => fetchContact(id),
      }),
  },
  hooks: {
    useDetail: (id: ID | null | undefined, opts?: { enabled?: boolean }) => {
      const enabled = (opts?.enabled ?? true) && id != null;
      return useQuery({
        queryKey: contactKeys.detail((id ?? "") as ID),
        queryFn: () => fetchContact(id as ID),
        enabled,
      });
    },
    useUpdate: () => {
      const qc = useQueryClient();
      return useMutation<AddressRow, ApiError, { id: ID; data: Record<string, unknown> }>({
        mutationFn: ({ id, data }) => updateContact(id, data),
        onSuccess: (data, { id }) => {
          qc.setQueryData(contactKeys.detail(id), data);
        },
      });
    },
    useDelete: () => {
      const qc = useQueryClient();
      return useMutation<void, ApiError, { id: ID }>({
        mutationFn: ({ id }) => deleteContact(id),
        onSuccess: (_, { id }) => {
          qc.removeQueries({ queryKey: contactKeys.detail(id) });
        },
      });
    },
  },
};

const specialPricesBase = createJsonApiResource(
  ["address", "special-prices"],
  "/address/special_prices",
  "special_price",
  {
    defaultListParams: { include: SPECIAL_PRICE_INCLUDE },
    defaultDetailParams: { include: SPECIAL_PRICE_INCLUDE },
  },
);

async function fetchSpecialPriceCollection(
  path: string,
  params: Record<string, unknown>,
): Promise<AddressRow[]> {
  const res = await http.get<ApiEnvelope<unknown[]>>(path, {
    params: { include: SPECIAL_PRICE_INCLUDE, ...params },
  });
  return denormalizeJsonApiCollection(res.data) as AddressRow[];
}

async function fetchSellingPrice(params: FetchSellingPriceParams) {
  const res = await http.get<{ data: { attributes: SellingPriceAttributes } }>(
    "/address/special_prices/fetch_selling_price",
    { params },
  );
  return res.data.data?.attributes ?? {};
}

async function fetchParticularSpecialPrice(params: FetchParticularSpecialPriceParams) {
  const res = await http.get<ApiEnvelope<unknown>>(
    "/address/special_prices/fetch_particular_special_price",
    { params },
  );
  return res.data.data
    ? (denormalizeJsonApiEnvelope(res.data) as AddressRow)
    : null;
}

export const addressSpecialPrices = {
  ...specialPricesBase,
  api: {
    ...specialPricesBase.api,
    stockSpecialPrices: (stockId: ID, params?: ListParams) =>
      fetchSpecialPriceCollection("/address/special_prices/stock_special_prices", {
        stock_id: stockId,
        ...flattenParams(params),
      }),
    addressSpecialPrices: (addressId: ID, params?: ListParams) =>
      fetchSpecialPriceCollection("/address/special_prices/address_special_prices", {
        address_id: addressId,
        ...flattenParams(params),
      }),
    fetchSellingPrice,
    fetchParticularSpecialPrice,
  },
  queries: {
    ...specialPricesBase.queries,
    stockSpecialPrices: (stockId: ID, params?: ListParams) =>
      queryOptions<AddressRow[], ApiError>({
        queryKey: specialPricesBase.keys.actions("stock-special-prices", { stockId, ...params }),
        queryFn: () =>
          fetchSpecialPriceCollection("/address/special_prices/stock_special_prices", {
            stock_id: stockId,
            ...flattenParams(params),
          }),
      }),
    addressSpecialPrices: (addressId: ID, params?: ListParams) =>
      queryOptions<AddressRow[], ApiError>({
        queryKey: specialPricesBase.keys.actions("address-special-prices", {
          addressId,
          ...params,
        }),
        queryFn: () =>
          fetchSpecialPriceCollection("/address/special_prices/address_special_prices", {
            address_id: addressId,
            ...flattenParams(params),
          }),
      }),
    fetchSellingPrice: (params: FetchSellingPriceParams) =>
      queryOptions<SellingPriceAttributes, ApiError>({
        queryKey: specialPricesBase.keys.actions("fetch-selling-price", params),
        queryFn: () => fetchSellingPrice(params),
      }),
    fetchParticularSpecialPrice: (params: FetchParticularSpecialPriceParams) =>
      queryOptions<AddressRow | null, ApiError>({
        queryKey: specialPricesBase.keys.actions("fetch-particular-special-price", params),
        queryFn: () => fetchParticularSpecialPrice(params),
      }),
  },
  hooks: {
    ...specialPricesBase.hooks,
    useStockSpecialPrices: (stockId: ID | null | undefined, params?: ListParams) =>
      useQuery({
        queryKey: specialPricesBase.keys.actions("stock-special-prices", { stockId, ...params }),
        queryFn: () =>
          fetchSpecialPriceCollection("/address/special_prices/stock_special_prices", {
            stock_id: stockId as ID,
            ...flattenParams(params),
          }),
        enabled: stockId != null,
      }),
    useAddressSpecialPrices: (addressId: ID | null | undefined, params?: ListParams) =>
      useQuery({
        queryKey: specialPricesBase.keys.actions("address-special-prices", {
          addressId,
          ...params,
        }),
        queryFn: () =>
          fetchSpecialPriceCollection("/address/special_prices/address_special_prices", {
            address_id: addressId as ID,
            ...flattenParams(params),
          }),
        enabled: addressId != null,
      }),
    useFetchSellingPrice: (
      params: FetchSellingPriceParams | null | undefined,
      opts?: { enabled?: boolean },
    ) =>
      useQuery({
        queryKey: specialPricesBase.keys.actions("fetch-selling-price", params),
        queryFn: () => fetchSellingPrice(params as FetchSellingPriceParams),
        enabled: (opts?.enabled ?? true) && params != null,
      }),
    useFetchParticularSpecialPrice: (
      params: FetchParticularSpecialPriceParams | null | undefined,
      opts?: { enabled?: boolean },
    ) =>
      useQuery({
        queryKey: specialPricesBase.keys.actions("fetch-particular-special-price", params),
        queryFn: () => fetchParticularSpecialPrice(params as FetchParticularSpecialPriceParams),
        enabled: (opts?.enabled ?? true) && params != null,
      }),
  },
};
