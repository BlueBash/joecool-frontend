/** Row shape after flattening JSON:API `address` records for the UI. */
export type AddressRow = {
  id: string;
  name: string;
  [key: string]: unknown;
};

export type AddressCreatePayload = Record<string, unknown>;

export type AddressTypeParam = "supplier" | "customer";

export interface FetchSellingPriceParams {
  item_discount: number;
  stock_id: string | number;
  address_id: string | number;
}

export interface FetchParticularSpecialPriceParams {
  address_id: string | number;
  stock_id: string | number;
}

export interface SellingPriceAttributes {
  selling_price?: Record<string, unknown>;
}
