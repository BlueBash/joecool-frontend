/** Row shape after flattening JSON:API `stock` records for the UI. */
export type StockRow = {
  id: string;
  name: string;
  [key: string]: unknown;
};

export type StockWritePayload = Record<string, unknown>;

export interface GenerateNextCodeParams {
  prefix?: string;
  length?: number;
}

export interface GenerateNextCodeResult {
  code?: string;
  next_code?: string;
  [key: string]: unknown;
}

export interface StockPackagingAmountParams {
  packaging_stock_id: string | number;
  current_currency_id: string | number;
}
