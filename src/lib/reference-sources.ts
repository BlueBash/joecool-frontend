import type { ListParams, Paginated } from "@/api/_client";
import * as addressSettings from "@/api/address-settings/catalogs";
import * as platform from "@/api/platform/catalogs";
import { stockBuyers } from "@/api/stock-buyers";
import { stockPriceCategories, stocks } from "@/api/stocks";
import { settingsGeneralMessages, settingsMessagePurposes } from "@/api/settings/messages";
import {
  settingsCashFlowSections,
  settingsDocuments,
  settingsMapAccountants,
  settingsProfitLossSections,
} from "@/api/settings/system";
import { settingsAddressUpsServices } from "@/api/settings/address";
import {
  stockAssortments,
  stockCategories,
  stockCategoryGroups,
  stockCollections,
  stockColourOptions,
  stockColours,
  stockCustomTarrifCodes,
  stockDimensionMeasures,
  stockDimensionPackAssortments,
  stockDimensionSpecs,
  stockDisplays,
  stockFittingSizeMeasures,
  stockFittingSizePackAssortments,
  stockFittingSizeSpecs,
  stockPackagings,
  stockRingSizes,
  stockCostsAssembly,
  stockCostsPacking,
  stockMaterials,
  stockRanges,
  stockSelections,
  stockTargetGenders,
  stockUnits,
  stockAmazonMaterials,
  stockAmazonMetalStamps,
  stockAmazonMetalTypes,
  stockAmazonProductTypes,
  stockAmazonTemplates,
  stockAmazonUsItemTypes,
} from "@/api/settings/stock/stock";
import { suppliers } from "@/api/suppliers";
import type { ReferenceKlassName } from "@/lib/reference-registry";
import { referenceLabel, referenceSearchText, type ReferenceOption } from "@/lib/reference";
import type { ReferenceDisplayConfig } from "@/lib/reference-display";

/** Match legacy app bulk-fetch for select dropdowns. */
export const REFERENCE_LIST_LIMIT = 3000;

type CatalogRow = { id: string | number; name?: string; code?: string; [key: string]: unknown };

type ListFn = (params?: ListParams) => Promise<Paginated<CatalogRow>>;

function bindList(list: ListFn, extra?: ListParams): ListFn {
  return (params) => list({ limit: REFERENCE_LIST_LIMIT, ...extra, ...params });
}

/** Maps logical klass keys → existing platform list APIs (no `/autocompletes`). */
export const REFERENCE_SOURCES: Record<ReferenceKlassName, ListFn> = {
  "StockSettings::Category": bindList(stockCategories.api.list),
  "StockSettings::CategoryGroup": bindList(stockCategoryGroups.api.list),
  "StockSettings::Colour": bindList(stockColours.api.list),
  "StockSettings::ColourOption": bindList(stockColourOptions.api.list),
  "StockSettings::Display": bindList(stockDisplays.api.list),
  "StockSettings::Assortment": bindList(stockAssortments.api.list),
  "StockSettings::Collection": bindList(stockCollections.api.list),
  "StockSettings::Selection": bindList(stockSelections.api.list),
  "StockSettings::TargetGender": bindList(stockTargetGenders.api.list),
  "StockSettings::Unit": bindList(stockUnits.api.list),
  "StockSettings::Packaging": bindList(stockPackagings.api.list),
  "StockSettings::CustomTariffCode": bindList(stockCustomTarrifCodes.api.list),
  "StockSettings::RingSize": bindList(stockRingSizes.api.list),
  "StockSettings::StockCostAssembly": bindList(stockCostsAssembly.api.list),
  "StockSettings::StockCostPacking": bindList(stockCostsPacking.api.list),
  "StockSettings::Material": bindList(stockMaterials.api.list),
  "StockSettings::Range": bindList(stockRanges.api.list),
  "StockSettings::FittingSizePackAssortment": bindList(stockFittingSizePackAssortments.api.list),
  "StockSettings::FittingSizeMeasure": bindList(stockFittingSizeMeasures.api.list),
  "StockSettings::FittingSizeSpec": bindList(stockFittingSizeSpecs.api.list),
  "StockSettings::DimensionPackAssortment": bindList(stockDimensionPackAssortments.api.list),
  "StockSettings::DimensionMeasure": bindList(stockDimensionMeasures.api.list),
  "StockSettings::DimensionSpec": bindList(stockDimensionSpecs.api.list),
  "StockSettings::AmazonTemplate": bindList(stockAmazonTemplates.api.list),
  "StockSettings::AmazonProductType": bindList(stockAmazonProductTypes.api.list),
  "StockSettings::AmazonUsItemType": bindList(stockAmazonUsItemTypes.api.list),
  "StockSettings::AmazonMaterial": bindList(stockAmazonMaterials.api.list),
  "StockSettings::AmazonMetalType": bindList(stockAmazonMetalTypes.api.list),
  "StockSettings::AmazonMetalStamp": bindList(stockAmazonMetalStamps.api.list),
  VatRateCode: bindList(platform.vatRateCodes.api.list),
  StockBuyer: bindList(stockBuyers.api.list),
  Supplier: bindList(suppliers.api.list),
  Country: bindList(platform.countries.api.list),
  "AddressSettings::Category": bindList(addressSettings.addressSettingCategories.api.list),
  Area: bindList(platform.areas.api.list),
  "AddressSettings::AccountManager": bindList(addressSettings.addressAccountManagers.api.list),
  "AddressSettings::Agent": bindList(addressSettings.addressAgents.api.list),
  ProfitCentre: bindList(platform.profitCentres.api.list),
  InvoiceEnvironment: bindList(platform.invoiceEnvironments.api.list),
  "Stock::PriceCategory": bindList(stockPriceCategories.api.list),
  Stock: bindList(stocks.api.list),
  CostCode: bindList(platform.costCodes.api.list),
  VatKind: bindList(platform.vatKinds.api.list),
  OrderKind: bindList(platform.orderKinds.api.list),
  Language: bindList(platform.languages.api.list),
  LabelSource: bindList(platform.labelSources.api.list),
  "AddressSettings::SpecialCustomer": bindList(platform.specialCustomers.api.list),
  "AddressSettings::PayTerm": bindList(addressSettings.addressPayTerms.api.list),
  "AddressSettings::PaymentMethod": bindList(addressSettings.addressPaymentMethods.api.list),
  BankAccount: bindList(platform.bankAccounts.api.list),
  "AddressSettings::ShipFrom": bindList(addressSettings.addressShipFroms.api.list),
  Warehouse: bindList(platform.warehouses.api.list),
  "AddressSettings::ShipMethod": bindList(addressSettings.addressShipMethods.api.list),
  ShippingCharge: bindList(platform.shippingCharges.api.list),
  Currency: bindList(platform.currencies.api.list),
  "AddressSettings::UpsService": bindList(settingsAddressUpsServices.api.list),
  "MessageSettings::MessagePurpose": bindList(settingsMessagePurposes.api.list),
  "MessageSettings::GeneralMessage": bindList(settingsGeneralMessages.api.list),
  Document: bindList(settingsDocuments.api.list),
  MapAccountant: bindList(settingsMapAccountants.api.list),
  CashFlowSection: bindList(settingsCashFlowSections.api.list),
  ProfitLossSection: bindList(settingsProfitLossSections.api.list),
};

function rowToOption(row: CatalogRow): ReferenceOption {
  const name = String(row.name ?? row.code ?? row.id);
  const code = row.code != null && String(row.code) !== "" ? String(row.code) : undefined;
  const base: ReferenceOption = { id: row.id, name, code };
  for (const [key, val] of Object.entries(row)) {
    if (key === "id" || key === "name" || key === "code") continue;
    if (val == null || val === "") continue;
    if (key === "country" && typeof val === "object") {
      const c = val as Record<string, unknown>;
      if (c.name != null) base.country = String(c.name);
      const iso = c.iso_1 ?? c.iso_2 ?? c.iso_code;
      if (iso != null && iso !== "") base.iso_code = String(iso);
      continue;
    }
    if (typeof val === "string" || typeof val === "number") base[key] = val;
  }
  return base;
}

function filterBySearch(
  options: ReferenceOption[],
  search: string,
  displayConfig?: ReferenceDisplayConfig,
): ReferenceOption[] {
  const q = search.trim().toLowerCase();
  if (!q) return options;
  return options.filter((o) => referenceSearchText(o, displayConfig).includes(q));
}

export function isReferenceKlass(klass: string): klass is ReferenceKlassName {
  return klass in REFERENCE_SOURCES;
}

export async function fetchReferenceOptions(
  klass: string,
  search?: string,
  displayConfig?: ReferenceDisplayConfig,
): Promise<ReferenceOption[]> {
  const list = REFERENCE_SOURCES[klass as ReferenceKlassName];
  if (!list) return [];

  const { items } = await list();
  const options = items
    .map(rowToOption)
    .sort((a, b) => referenceLabel(a, displayConfig).localeCompare(referenceLabel(b, displayConfig)));
  return filterBySearch(options, search ?? "", displayConfig);
}
