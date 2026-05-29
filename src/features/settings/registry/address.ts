import {
  settingsAddressAccountManagers,
  settingsAddressAgents,
  settingsAddressCategories,
  settingsAddressContactDepts,
  settingsAddressContactRoles,
  settingsAddressPaymentMethods,
  settingsAddressPayTerms,
  settingsAddressShipFroms,
  settingsAddressUpsServices,
} from "@/api/settings/address";
import { mkSettingsResource } from "@/api/settings/resource";
import { settingsCountries } from "@/api/settings/system";
import type { SettingsResource, SettingsSectionConfig } from "../types";
import {
  mapAccountManagerPayload,
  mapAgentPayload,
  mapCodeNamePayload,
  mapContactDeptPayload,
  mapCountryPayload,
  mapPayTermPayload,
  mapShipMethodPayload,
} from "../payload-maps";
import { SettingsModuleFormData } from "./columns/formFields";
import { buildSettingListingColumns } from "./columns/listingData";
import { listing } from "./helpers";

const settingsAddressShipMethods = mkSettingsResource(
  ["settings", "ship-methods"],
  "/address_settings/ship_methods",
  "ship_method",
  { include: "ups_service" },
);

function addrListing(
  slug: string,
  config: Parameters<typeof listing>[0],
): [string, SettingsSectionConfig] {
  return [slug, listing(config)];
}

export const addressSettingsSections: Partial<Record<string, SettingsSectionConfig>> =
  Object.fromEntries([
    addrListing("address/category", {
      resource: settingsAddressCategories as unknown as SettingsResource,
      singular: "Address category",
      plural: "Address categories",
      bodyKey: "category",
      listingKey: "address_category",
      fields: SettingsModuleFormData.address_category,
      mapWritePayload: mapCodeNamePayload,
      buildListingColumns: buildSettingListingColumns,
    }),
    addrListing("address/payment-method", {
      resource: settingsAddressPaymentMethods as unknown as SettingsResource,
      singular: "Payment method",
      plural: "Payment methods",
      bodyKey: "payment_method",
      fields: SettingsModuleFormData.payment_method,
      mapWritePayload: mapCodeNamePayload,
      buildListingColumns: buildSettingListingColumns,
    }),
    addrListing("address/ship-from", {
      resource: settingsAddressShipFroms as unknown as SettingsResource,
      singular: "Ship from",
      plural: "Ship from locations",
      bodyKey: "ship_from",
      fields: SettingsModuleFormData.ship_from,
      mapWritePayload: mapCodeNamePayload,
      buildListingColumns: buildSettingListingColumns,
    }),
    addrListing("address/pay-term", {
      resource: settingsAddressPayTerms as unknown as SettingsResource,
      singular: "Pay term",
      plural: "Pay terms",
      bodyKey: "pay_term",
      fields: SettingsModuleFormData.pay_term,
      mapWritePayload: mapPayTermPayload,
      buildListingColumns: buildSettingListingColumns,
    }),
    addrListing("address/ship-method", {
      resource: settingsAddressShipMethods as unknown as SettingsResource,
      singular: "Ship method",
      plural: "Ship methods",
      bodyKey: "ship_method",
      fields: SettingsModuleFormData.ship_method,
      mapWritePayload: mapShipMethodPayload,
      buildListingColumns: buildSettingListingColumns,
    }),
    addrListing("address/contact-departments", {
      resource: settingsAddressContactDepts as unknown as SettingsResource,
      singular: "Contact department",
      plural: "Contact departments",
      bodyKey: "contact_dept",
      fields: SettingsModuleFormData.contact_dept,
      mapWritePayload: mapContactDeptPayload,
      buildListingColumns: buildSettingListingColumns,
    }),
    addrListing("address/contact-role", {
      resource: settingsAddressContactRoles as unknown as SettingsResource,
      singular: "Contact role",
      plural: "Contact roles",
      bodyKey: "contact_role",
      fields: SettingsModuleFormData.contact_role,
      mapWritePayload: mapContactDeptPayload,
      buildListingColumns: buildSettingListingColumns,
    }),
    addrListing("address/agent", {
      resource: settingsAddressAgents as unknown as SettingsResource,
      singular: "Agent",
      plural: "Agents",
      bodyKey: "agent",
      fields: SettingsModuleFormData.agent,
      mapWritePayload: mapAgentPayload,
      buildListingColumns: buildSettingListingColumns,
    }),
    addrListing("address/country", {
      resource: settingsCountries as unknown as SettingsResource,
      singular: "Country",
      plural: "Countries",
      bodyKey: "country",
      fields: SettingsModuleFormData.country,
      mapWritePayload: mapCountryPayload,
      buildListingColumns: buildSettingListingColumns,
    }),
    addrListing("address/ups-service", {
      resource: settingsAddressUpsServices as unknown as SettingsResource,
      singular: "UPS service",
      plural: "UPS services",
      bodyKey: "ups_service",
      fields: SettingsModuleFormData.ups_service,
      mapWritePayload: mapCodeNamePayload,
      buildListingColumns: buildSettingListingColumns,
    }),
    addrListing("address/account-manager", {
      resource: settingsAddressAccountManagers as unknown as SettingsResource,
      singular: "Account manager",
      plural: "Account managers",
      bodyKey: "account_manager",
      fields: SettingsModuleFormData.account_manager,
      mapWritePayload: mapAccountManagerPayload,
      buildListingColumns: buildSettingListingColumns,
    }),
  ]);
