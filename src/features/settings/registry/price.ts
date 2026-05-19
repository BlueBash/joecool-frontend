import { settingsCurrencies, settingsPriceCategories } from "@/api/settings/price";
import type { SettingsResource, SettingsSectionConfig } from "../types";
import {
  mapCodeNamePayload,
  mapCurrencyPayload,
  mapPriceCategoryPayload,
} from "../payload-maps";
import { SettingsModuleFormData } from "./columns/formFields";
import { buildSettingListingColumns } from "./columns/listingData";
import { listing } from "./helpers";
import { PriceCalculationSection } from "../sections/PriceCalculationSection";

export const priceSettingsSections: Partial<Record<string, SettingsSectionConfig>> = {
  "price/category": listing({
    resource: settingsPriceCategories as unknown as SettingsResource,
    singular: "Price category",
    plural: "Price categories",
    bodyKey: "price_category",
    fields: SettingsModuleFormData.price_category,
    mapWritePayload: mapPriceCategoryPayload,
    buildListingColumns: buildSettingListingColumns,
  }),
  "price/currencies": listing({
    resource: settingsCurrencies as unknown as SettingsResource,
    singular: "Currency",
    plural: "Currencies",
    bodyKey: "currency",
    fields: SettingsModuleFormData.currency,
    mapWritePayload: mapCurrencyPayload,
    buildListingColumns: buildSettingListingColumns,
  }),
  "price/calculation": {
    view: "custom",
    component: PriceCalculationSection,
  },
};
