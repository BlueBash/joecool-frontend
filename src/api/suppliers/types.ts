import type { JsonApiRow } from "@/api/_client";

export type SupplierRow = JsonApiRow & {
  kind?: string;
  code?: string;
  address_1?: string;
  town?: string;
  zip?: string;
  country?: string | null;
  supp_stock_cost_factor?: Record<string, unknown>;
};
