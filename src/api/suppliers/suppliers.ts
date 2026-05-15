import { createJsonApiResource } from "@/api/_client";
import type { SupplierRow } from "./types";

export const SUPPLIER_DETAIL_INCLUDE = "supp_stock_cost_factor";

export const suppliers = createJsonApiResource<SupplierRow, never>(
  ["suppliers"],
  "/suppliers",
  "supplier",
  { defaultDetailParams: { include: SUPPLIER_DETAIL_INCLUDE } },
);
