import { createResource } from "@/api/_client";
import type { ListParams } from "@/api/_client";
import { denormalizeJsonApiEntity, paginatedFromJsonApi } from "../json-api";
import type { JsonApiListMeta } from "../json-api";
import type { StockSettingRow } from "./types";

function mk(
  scope: readonly string[],
  path: string,
  bodyKey: string,
  defaultListParams?: ListParams,
) {
  return createResource<StockSettingRow, Record<string, unknown>, Record<string, unknown>>({
    scope,
    path,
    bodyKey,
    defaultListParams,
    transform: {
      entity: (raw, includedMap) =>
        denormalizeJsonApiEntity(raw, includedMap) as StockSettingRow,
      list: (envelope, params) =>
        paginatedFromJsonApi(
          envelope as { data?: unknown; meta?: JsonApiListMeta },
          params,
          (row, includedMap) =>
            denormalizeJsonApiEntity(row, includedMap) as StockSettingRow,
        ),
    },
  });
}

// --- Category & packaging ---

export const stockCategories = mk(
  ["stock-settings", "categories"],
  "/stock_settings/categories",
  "category",
  {
    include: "category_group,fitting_size_measure,dimension_measure",
  },
);

export const stockCategoryGroups = mk(
  ["stock-settings", "category-groups"],
  "/stock_settings/category_groups",
  "category_group",
);

export const stockPackagings = mk(
  ["stock-settings", "packagings"],
  "/stock_settings/packagings",
  "packaging",
);

// --- Fittings ---

export const stockFittingSizePackAssortments = mk(
  ["stock-settings", "fitting-size-pack-assortments"],
  "/stock_settings/fitting_size_pack_assortments",
  "fitting_size_pack_assortment",
  { include: "fitting_size_spec" },
);

export const stockFittingSizeSpecs = mk(
  ["stock-settings", "fitting-size-specs"],
  "/stock_settings/fitting_size_specs",
  "fitting_size_spec",
);

export const stockFittingSizeMeasures = mk(
  ["stock-settings", "fitting-size-measures"],
  "/stock_settings/fitting_size_measures",
  "fitting_size_measure",
);

export const stockFittingMessages = mk(
  ["stock-settings", "fitting-messages"],
  "/stock_settings/fitting_messages",
  "fitting_message",
);

// --- Dimensions ---

export const stockDimensionPackAssortments = mk(
  ["stock-settings", "dimension-pack-assortments"],
  "/stock_settings/dimension_pack_assortments",
  "dimension_pack_assortment",
);

export const stockDimensionSpecs = mk(
  ["stock-settings", "dimension-specs"],
  "/stock_settings/dimension_specs",
  "dimension_spec",
);

export const stockDimensionMeasures = mk(
  ["stock-settings", "dimension-measures"],
  "/stock_settings/dimension_measures",
  "dimension_measure",
);

export const stockDimensionMessages = mk(
  ["stock-settings", "dimension-messages"],
  "/stock_settings/dimension_messages",
  "dimension_message",
);

// --- Stock metadata ---

export const stockSelections = mk(
  ["stock-settings", "selections"],
  "/stock_settings/selections",
  "selection",
);

export const stockCollections = mk(
  ["stock-settings", "collections"],
  "/stock_settings/collections",
  "collection",
);

export const stockRanges = mk(["stock-settings", "ranges"], "/stock_settings/ranges", "range");

export const stockMarketingBlurbs = mk(
  ["stock-settings", "marketing-blurbs"],
  "/stock_settings/marketing_blurbs",
  "marketing_blurb",
);

// --- Amazon ---

export const stockAmazonTemplates = mk(
  ["stock-settings", "amazon-templates"],
  "/stock_settings/amazon_templates",
  "amazon_template",
);

export const stockAmazonProductTypes = mk(
  ["stock-settings", "amazon-product-types"],
  "/stock_settings/amazon_product_types",
  "amazon_product_type",
  { include: "amazon_template" },
);

export const stockAmazonBrowseNodes = mk(
  ["stock-settings", "amazon-browse-nodes"],
  "/stock_settings/amazon_browse_nodes",
  "amazon_browse_node",
);

export const stockAmazonMaterials = mk(
  ["stock-settings", "amazon-materials"],
  "/stock_settings/amazon_materials",
  "amazon_material",
);

export const stockAmazonMetalTypes = mk(
  ["stock-settings", "amazon-metal-types"],
  "/stock_settings/amazon_metal_types",
  "amazon_metal_type",
);

export const stockAmazonMetalStamps = mk(
  ["stock-settings", "amazon-metal-stamps"],
  "/stock_settings/amazon_metal_stamps",
  "amazon_metal_stamp",
);

export const stockAmazonUsItemTypes = mk(
  ["stock-settings", "amazon-us-item-types"],
  "/stock_settings/amazon_us_item_types",
  "amazon_us_item_type",
);

// --- Attributes & presentation ---

export const stockColours = mk(["stock-settings", "colours"], "/stock_settings/colours", "colour");

export const stockWebStockAvailabilityMessages = mk(
  ["stock-settings", "web-stock-availability-messages"],
  "/stock_settings/web_stock_availability_messages",
  "web_stock_availability_message",
);

export const stockUnits = mk(["stock-settings", "units"], "/stock_settings/units", "unit");

export const stockCardings = mk(
  ["stock-settings", "cardings"],
  "/stock_settings/cardings",
  "carding",
);

export const stockDisplays = mk(
  ["stock-settings", "displays"],
  "/stock_settings/displays",
  "display",
);

export const stockColourOptions = mk(
  ["stock-settings", "colour-options"],
  "/stock_settings/colour_options",
  "colour_option",
);

export const stockRingSizes = mk(
  ["stock-settings", "ring-sizes"],
  "/stock_settings/ring_sizes",
  "ring_size",
);

export const stockCostsAssembly = mk(
  ["stock-settings", "costs", "assembly"],
  "/stock_settings/costs",
  "cost",
  {
    include: "currency",
    filters: { "filter[cost_type_eq]": 0 },
  },
);

export const stockCostsPacking = mk(
  ["stock-settings", "costs", "packing"],
  "/stock_settings/costs",
  "cost",
  {
    include: "currency",
    filters: { "filter[cost_type_eq]": 1 },
  },
);

// --- Other catalogs ---

export const stockAssortments = mk(
  ["stock-settings", "assortments"],
  "/stock_settings/assortments",
  "assortment",
);

export const stockTargetGenders = mk(
  ["stock-settings", "target-genders"],
  "/stock_settings/target_genders",
  "target_gender",
);

export const stockMaterials = mk(
  ["stock-settings", "materials"],
  "/stock_settings/materials",
  "material",
  { include: "amazon_metal_stamp,amazon_material,amazon_metal_type" },
);

export const stockJoeOnlineRanges = mk(
  ["stock-settings", "joe-online-ranges"],
  "/stock_settings/joe_online_ranges",
  "joe_online_range",
);

export const stockCustomTarrifCodes = mk(
  ["stock-settings", "custom-tarrif-codes"],
  "/stock_settings/custom_tarrif_codes",
  "custom_tarrif_code",
);
