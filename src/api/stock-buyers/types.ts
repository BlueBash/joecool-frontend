import type { JsonApiRow } from "@/api/_client";

export type StockBuyerRow = JsonApiRow & {
  code?: string;
};
