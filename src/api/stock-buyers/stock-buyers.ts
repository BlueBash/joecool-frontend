import { createJsonApiResource } from "@/api/_client";
import type { StockBuyerRow } from "./types";

/** Stock buyers are read-only reference data in the platform API. */
export const stockBuyers = createJsonApiResource<StockBuyerRow, never>(
  ["stock-buyers"],
  "/stock_buyers",
  "stock_buyer",
);
