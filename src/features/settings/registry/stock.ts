import {
  stockAmazonBrowseNodes,
  stockAmazonMaterials,
  stockAmazonMetalStamps,
  stockAmazonMetalTypes,
  stockAmazonProductTypes,
  stockAmazonTemplates,
  stockAmazonUsItemTypes,
  stockAssortments,
  stockCategories,
  stockCategoryGroups,
  stockCollections,
  stockColours,
  stockCostsAssembly,
  stockCostsPacking,
  stockCustomTarrifCodes,
  stockDimensionMeasures,
  stockDimensionMessages,
  stockDimensionPackAssortments,
  stockDimensionSpecs,
  stockDisplays,
  stockFittingMessages,
  stockFittingSizeMeasures,
  stockFittingSizePackAssortments,
  stockFittingSizeSpecs,
  stockMaterials,
  stockPackagings,
  stockRanges,
  stockRingSizes,
  stockSelections,
  stockTargetGenders,
  stockUnits,
  stockWebStockAvailabilityMessages,
} from "@/api/settings/stock";
import type { SettingsResource, SettingsSectionConfig } from "../types";
import {
  mapAmazonBrowseNodePayload,
  mapAmazonProductTypePayload,
  mapCategoryPayload,
  mapCodeNamePayload,
  mapCostAssemblyPayload,
  mapCostPackingPayload,
  mapDimensionMessagePayload,
  mapDisplayPayload,
  mapFittingMessagePayload,
  mapFittingPackAssortmentPayload,
  mapMaterialPayload,
  mapNameOnlyPayload,
  mapRingSizePayload,
  mapSpecWithValuesPayload,
  mapWebStockAvailabilityPayload,
} from "../payload-maps";
import { mapDimensionMessageFromRow, mapFittingMessageFromRow } from "../row-maps";
import { listing } from "./helpers";
import { SettingsModuleFormData } from "./columns/formFields";
import { buildSettingListingColumns } from "./columns/listingData";

export const stockSettingsSections: Partial<Record<string, SettingsSectionConfig>> = {
  "stock/category/categories": listing({
    resource: stockCategories as unknown as SettingsResource,
    singular: "Category",
    plural: "Categories",
    bodyKey: "category",
    fields: SettingsModuleFormData.category,
    mapWritePayload: mapCategoryPayload,
    buildListingColumns: buildSettingListingColumns,
  }),
  "stock/category/groups": listing({
    resource: stockCategoryGroups as unknown as SettingsResource,
    singular: "Category group",
    plural: "Category groups",
    bodyKey: "category_group",
    fields: SettingsModuleFormData.category_group,
    mapWritePayload: mapCodeNamePayload,
    buildListingColumns: buildSettingListingColumns,
  }),
  "stock/category/packaging": listing({
    resource: stockPackagings as unknown as SettingsResource,
    singular: "Packaging",
    plural: "Packaging types",
    bodyKey: "packaging",
    fields: SettingsModuleFormData.packaging,
    mapWritePayload: mapCodeNamePayload,
    buildListingColumns: buildSettingListingColumns,
  }),

  "stock/fittings/sizes-pack-assortments": listing({
    resource: stockFittingSizePackAssortments as unknown as SettingsResource,
    singular: "Pack assortment",
    plural: "Pack assortments",
    bodyKey: "fitting_size_pack_assortment",
    fields: SettingsModuleFormData.fitting_size_pack_assortment,
    mapWritePayload: mapFittingPackAssortmentPayload,
    buildListingColumns: buildSettingListingColumns,
  }),
  "stock/fittings/sizes-specs": listing({
    resource: stockFittingSizeSpecs as unknown as SettingsResource,
    singular: "Fitting size spec",
    plural: "Fitting size specs",
    bodyKey: "fitting_size_spec",
    fields: SettingsModuleFormData.fitting_size_spec,
    mapWritePayload: mapSpecWithValuesPayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/fittings/sizes-measures": listing({
    resource: stockFittingSizeMeasures as unknown as SettingsResource,
    singular: "Fitting size measure",
    plural: "Fitting size measures",
    bodyKey: "fitting_size_measure",
    fields: SettingsModuleFormData.fitting_size_measure,
    mapWritePayload: mapCodeNamePayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/fittings/messages": listing({
    resource: stockFittingMessages as unknown as SettingsResource,
    singular: "Fitting message",
    plural: "Fitting messages",
    bodyKey: "fitting_message",
    fields: SettingsModuleFormData.fitting_message,
    mapWritePayload: mapFittingMessagePayload,
    buildListingColumns: buildSettingListingColumns,

    mapFromRow: mapFittingMessageFromRow,
  }),

  "stock/dimensions/pack-assortments": listing({
    resource: stockDimensionPackAssortments as unknown as SettingsResource,
    singular: "Dimension pack assortment",
    plural: "Dimension pack assortments",
    bodyKey: "dimension_pack_assortment",
    fields: SettingsModuleFormData.dimension_pack_assortment,
    mapWritePayload: mapCodeNamePayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/dimensions/specs": listing({
    resource: stockDimensionSpecs as unknown as SettingsResource,
    singular: "Dimension spec",
    plural: "Dimension specs",
    bodyKey: "dimension_spec",
    fields: SettingsModuleFormData.dimension_spec,
    mapWritePayload: mapSpecWithValuesPayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/dimensions/measures": listing({
    resource: stockDimensionMeasures as unknown as SettingsResource,
    singular: "Dimension measure",
    plural: "Dimension measures",
    bodyKey: "dimension_measure",
    fields: SettingsModuleFormData.dimension_measure,
    mapWritePayload: mapCodeNamePayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/dimensions/messages": listing({
    resource: stockDimensionMessages as unknown as SettingsResource,
    singular: "Dimension message",
    plural: "Dimension messages",
    bodyKey: "dimension_message",
    fields: SettingsModuleFormData.dimension_message,
    mapWritePayload: mapDimensionMessagePayload,
    buildListingColumns: buildSettingListingColumns,

    mapFromRow: mapDimensionMessageFromRow,
  }),

  "stock/stock/selections": listing({
    resource: stockSelections as unknown as SettingsResource,
    singular: "Selection",
    plural: "Selections",
    bodyKey: "selection",
    fields: SettingsModuleFormData.selection,
    mapWritePayload: mapCodeNamePayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/stock/collections": listing({
    resource: stockCollections as unknown as SettingsResource,
    singular: "Collection",
    plural: "Collections",
    bodyKey: "collection",
    fields: SettingsModuleFormData.collection,
    mapWritePayload: mapCodeNamePayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/stock/stock-ranges": listing({
    resource: stockRanges as unknown as SettingsResource,
    singular: "Range",
    plural: "Ranges",
    bodyKey: "range",
    fields: SettingsModuleFormData.range,
    mapWritePayload: mapCodeNamePayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/amazon/templates": listing({
    resource: stockAmazonTemplates as unknown as SettingsResource,
    singular: "Amazon template",
    plural: "Amazon templates",
    bodyKey: "amazon_template",
    fields: SettingsModuleFormData.amazon_template,
    mapWritePayload: mapCodeNamePayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/amazon/product-types": listing({
    resource: stockAmazonProductTypes as unknown as SettingsResource,
    singular: "Amazon product type",
    plural: "Amazon product types",
    bodyKey: "amazon_product_type",
    fields: SettingsModuleFormData.amazon_product_type,
    mapWritePayload: mapAmazonProductTypePayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/amazon/browse-nodes": listing({
    resource: stockAmazonBrowseNodes as unknown as SettingsResource,
    singular: "Amazon browse node",
    plural: "Amazon browse nodes",
    bodyKey: "amazon_browse_node",
    fields: SettingsModuleFormData.amazon_browse_node,
    mapWritePayload: mapAmazonBrowseNodePayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/amazon/materials": listing({
    resource: stockAmazonMaterials as unknown as SettingsResource,
    singular: "Amazon material",
    plural: "Amazon materials",
    bodyKey: "amazon_material",
    fields: SettingsModuleFormData.amazon_material,
    mapWritePayload: mapNameOnlyPayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/amazon/metal-types": listing({
    resource: stockAmazonMetalTypes as unknown as SettingsResource,
    singular: "Amazon metal type",
    plural: "Amazon metal types",
    bodyKey: "amazon_metal_type",
    fields: SettingsModuleFormData.amazon_metal_type,
    mapWritePayload: mapNameOnlyPayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/amazon/metal-stamps": listing({
    resource: stockAmazonMetalStamps as unknown as SettingsResource,
    singular: "Amazon metal stamp",
    plural: "Amazon metal stamps",
    bodyKey: "amazon_metal_stamp",
    fields: SettingsModuleFormData.amazon_metal_stamp,
    mapWritePayload: mapNameOnlyPayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/amazon/us-item-types": listing({
    resource: stockAmazonUsItemTypes as unknown as SettingsResource,
    singular: "Amazon US item type",
    plural: "Amazon US item types",
    bodyKey: "amazon_us_item_type",
    fields: SettingsModuleFormData.amazon_us_item_type,
    mapWritePayload: mapNameOnlyPayload,
    buildListingColumns: buildSettingListingColumns,

  }),

  "stock/colors": listing({
    resource: stockColours as unknown as SettingsResource,
    singular: "Colour",
    plural: "Colours",
    bodyKey: "colour",
    fields: SettingsModuleFormData.colour,
    mapWritePayload: mapCodeNamePayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/sizes": listing({
    resource: stockRingSizes as unknown as SettingsResource,
    singular: "Ring size",
    plural: "Ring sizes",
    bodyKey: "ring_size",
    fields: SettingsModuleFormData.ring_size,
    mapWritePayload: mapRingSizePayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/messages": listing({
    resource: stockWebStockAvailabilityMessages as unknown as SettingsResource,
    singular: "Stock message",
    plural: "Stock messages",
    bodyKey: "web_stock_availability_message",
    fields: SettingsModuleFormData.web_stock_availability_message,
    mapWritePayload: mapWebStockAvailabilityPayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/sizes/web-availability": listing({
    resource: stockWebStockAvailabilityMessages as unknown as SettingsResource,
    singular: "Web availability message",
    plural: "Web availability messages",
    bodyKey: "web_stock_availability_message",
    fields: SettingsModuleFormData.web_stock_availability_message,
    mapWritePayload: mapWebStockAvailabilityPayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/units": listing({
    resource: stockUnits as unknown as SettingsResource,
    singular: "Unit",
    plural: "Units",
    bodyKey: "unit",
    fields: SettingsModuleFormData.unit,
    mapWritePayload: mapCodeNamePayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/displays": listing({
    resource: stockDisplays as unknown as SettingsResource,
    singular: "Display",
    plural: "Displays",
    bodyKey: "display",
    fields: SettingsModuleFormData.display,
    mapWritePayload: mapDisplayPayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/assembly-costs": listing({
    resource: stockCostsAssembly as unknown as SettingsResource,
    singular: "Assembly cost",
    plural: "Assembly costs",
    bodyKey: "cost",
    fields: SettingsModuleFormData.cost,
    mapWritePayload: mapCostAssemblyPayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/packing-costs": listing({
    resource: stockCostsPacking as unknown as SettingsResource,
    singular: "Packing cost",
    plural: "Packing costs",
    bodyKey: "cost",
    fields: SettingsModuleFormData.cost,
    mapWritePayload: mapCostPackingPayload,
    buildListingColumns: buildSettingListingColumns,

  }),

  "stock/other-assortments": listing({
    resource: stockAssortments as unknown as SettingsResource,
    singular: "Assortment",
    plural: "Assortments",
    bodyKey: "assortment",
    fields: SettingsModuleFormData.assortment,
    mapWritePayload: mapCodeNamePayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/other-genders": listing({
    resource: stockTargetGenders as unknown as SettingsResource,
    singular: "Target gender",
    plural: "Target genders",
    bodyKey: "target_gender",
    fields: SettingsModuleFormData.target_gender,
    mapWritePayload: mapCodeNamePayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/other-materials": listing({
    resource: stockMaterials as unknown as SettingsResource,
    singular: "Material",
    plural: "Materials",
    bodyKey: "material",
    fields: SettingsModuleFormData.material,
    mapWritePayload: mapMaterialPayload,
    buildListingColumns: buildSettingListingColumns,

  }),
  "stock/other-custom-tariff-codes": listing({
    resource: stockCustomTarrifCodes as unknown as SettingsResource,
    singular: "Custom tariff code",
    plural: "Custom tariff codes",
    bodyKey: "custom_tarrif_code",
    fields: SettingsModuleFormData.custom_tarrif_code,
    mapWritePayload: mapCodeNamePayload,
    buildListingColumns: buildSettingListingColumns,

  }),
};
