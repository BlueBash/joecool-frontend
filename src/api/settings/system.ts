import { mkSettingsResource } from "./resource";

export const settingsLanguages = mkSettingsResource(
  ["settings", "languages"],
  "/languages",
  "language",
);

export const settingsLabelSources = mkSettingsResource(
  ["settings", "label-sources"],
  "/label_sources",
  "label_source",
);

export const settingsVatKinds = mkSettingsResource(
  ["settings", "vat-kinds"],
  "/vat_kinds",
  "vat_kind",
);

export const settingsMapAccountants = mkSettingsResource(
  ["settings", "map-accountants"],
  "/map_accountants",
  "map_accountant",
);

export const settingsProfitLossSections = mkSettingsResource(
  ["settings", "profit-loss-sections"],
  "/profit_loss_sections",
  "profit_loss_section",
);

export const settingsDocuments = mkSettingsResource(
  ["settings", "documents"],
  "/documents",
  "document",
);

export const settingsVatRateCodes = mkSettingsResource(
  ["settings", "vat-rate-codes"],
  "/vat_rate_codes",
  "vat_rate_code",
);

export const settingsCashFlowSections = mkSettingsResource(
  ["settings", "cash-flow-sections"],
  "/cash_flow_sections",
  "cash_flow_section",
);

export const settingsVenues = mkSettingsResource(
  ["settings", "venues"],
  "/venues",
  "venue",
);

export const settingsShippingCharges = mkSettingsResource(
  ["settings", "shipping-charges"],
  "/shipping_charges",
  "shipping_charge",
);

export const settingsAreas = mkSettingsResource(
  ["settings", "areas"],
  "/areas",
  "area",
);

export const settingsWarehouses = mkSettingsResource(
  ["settings", "warehouses"],
  "/warehouses",
  "warehouse",
  { include: "country" },
);

export const settingsProfitCentres = mkSettingsResource(
  ["settings", "profit-centres"],
  "/profit_centres",
  "profit_centre",
  { include: "country" },
);

export const settingsBankAccounts = mkSettingsResource(
  ["settings", "bank-accounts"],
  "/bank_accounts",
  "bank_account",
  { include: "currency" },
);

export const settingsCostCodes = mkSettingsResource(
  ["settings", "cost-codes"],
  "/cost_codes",
  "cost_code",
  { include: "profit_loss_section,cash_flow_section,map_accountant" },
);

export const settingsOrderKinds = mkSettingsResource(
  ["settings", "order-kinds"],
  "/order_kinds",
  "order_kind",
);

export const settingsInvoiceEnvironments = mkSettingsResource(
  ["settings", "invoice-environments"],
  "/invoice_environments",
  "invoice_environment",
  {
    include:
      "price_category,currency,bank_account,vat_kind,main_code,post_code,control_code,buy_code,discount_taken_code,discount_given_code,vat_rate_code",
  },
);

export const settingsCountries = mkSettingsResource(
  ["settings", "countries"],
  "/countries",
  "country",
);
