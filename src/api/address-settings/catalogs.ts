import { createJsonApiResource } from "@/api/_client";
import type { JsonApiRow } from "@/api/_client";

export type AddressSettingsCatalogRow = JsonApiRow;

export const addressSettingCategories = createJsonApiResource<AddressSettingsCatalogRow>(
  ["address-settings", "categories"],
  "/address_settings/categories",
  "category",
);

export const addressAccountManagers = createJsonApiResource<AddressSettingsCatalogRow>(
  ["address-settings", "account-managers"],
  "/address_settings/account_managers",
  "account_manager",
);

export const addressPaymentMethods = createJsonApiResource<AddressSettingsCatalogRow>(
  ["address-settings", "payment-methods"],
  "/address_settings/payment_methods",
  "payment_method",
);

export const addressShipFroms = createJsonApiResource<AddressSettingsCatalogRow>(
  ["address-settings", "ship-froms"],
  "/address_settings/ship_froms",
  "ship_from",
);

export const addressPayTerms = createJsonApiResource<AddressSettingsCatalogRow>(
  ["address-settings", "pay-terms"],
  "/address_settings/pay_terms",
  "pay_term",
);

export const addressShipMethods = createJsonApiResource<AddressSettingsCatalogRow>(
  ["address-settings", "ship-methods"],
  "/address_settings/ship_methods",
  "ship_method",
);

export const addressAgents = createJsonApiResource<AddressSettingsCatalogRow>(
  ["address-settings", "agents"],
  "/address_settings/agents",
  "agent",
);
