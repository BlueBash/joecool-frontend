import { createJsonApiResource } from "@/api/_client";
import type { JsonApiRow } from "@/api/_client";

export type PlatformCatalogRow = JsonApiRow;

export const countries = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "countries"],
  "/countries",
  "country",
);

export const areas = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "areas"],
  "/areas",
  "area",
);

export const profitCentres = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "profit-centres"],
  "/profit_centres",
  "profit_centre",
);

export const vatRateCodes = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "vat-rate-codes"],
  "/vat_rate_codes",
  "vat_rate_code",
);

export const invoiceEnvironments = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "invoice-environments"],
  "/invoice_environments",
  "invoice_environment",
);

export const warehouses = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "warehouses"],
  "/warehouses",
  "warehouse",
);

export const shippingCharges = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "shipping-charges"],
  "/shipping_charges",
  "shipping_charge",
);

export const costCodes = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "cost-codes"],
  "/cost_codes",
  "cost_code",
);

export const orderKinds = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "order-kinds"],
  "/order_kinds",
  "order_kind",
);

export const languages = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "languages"],
  "/languages",
  "language",
);

export const labelSources = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "label-sources"],
  "/label_sources",
  "label_source",
);

export const vatKinds = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "vat-kinds"],
  "/vat_kinds",
  "vat_kind",
);

export const bankAccounts = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "bank-accounts"],
  "/bank_accounts",
  "bank_account",
);

export const currencies = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "currencies"],
  "/currencies",
  "currency",
);

/** Backend route is `special_custs` (not `special_customers`). */
export const specialCustomers = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "special-custs"],
  "/special_custs",
  "special_cust",
);

export const mapAccountants = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "map-accountants"],
  "/map_accountants",
  "map_accountant",
);

export const cashFlowSections = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "cash-flow-sections"],
  "/cash_flow_sections",
  "cash_flow_section",
);

export const profitLossSections = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "profit-loss-sections"],
  "/profit_loss_sections",
  "profit_loss_section",
);

export const venues = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "venues"],
  "/venues",
  "venue",
);

export const documents = createJsonApiResource<PlatformCatalogRow>(
  ["platform", "documents"],
  "/documents",
  "document",
);
