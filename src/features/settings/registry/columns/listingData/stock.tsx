import type { ListingColumn } from "./shared";
import { col } from "./shared";

export const stockListingData: Record<string, ListingColumn[]> = {
  category: [
    col("conversational_name", "Conversational name"),
    col("category_tarrif", "Category tariff"),
    col("category_group.name", "Category group"),
    col("fitting_size_measure.name", "Fitting size measure"),
    col("dimension_measure.name", "Dimension measure"),
    col("show", "Show", { type: "boolean" }),
  ],

  category_group: [],

  packaging: [],
  fitting_size_measure: [],
  dimension_pack_assortment: [],
  dimension_measure: [],
  selection: [],
  collection: [],
  range: [],
  colour: [],
  colour_option: [],
  unit: [],
  carding: [],
  assortment: [],
  target_gender: [],
  custom_tarrif_code: [],
  amazon_template: [],

  fitting_size_pack_assortment: [
    col("fitting_size_spec.name", "Fitting size spec"),
    col("adjustable", "Adjustable", { type: "boolean" }),
  ],

  fitting_size_spec: [col("values", "Values", { type: "number" })],
  dimension_spec: [col("values", "Values", { type: "number" })],

  fitting_message: [
    col("audience", "Audience"),
    col("description", "Description"),
    col("category.name", "Category"),
    col("fitting_size_pack_assortment.name", "Pack assortment"),
    col("fitting_size_spec.name", "Fitting spec"),
    col("fitting_size_measure.name", "Fitting measure"),
  ],

  dimension_message: [
    col("audience", "Audience"),
    col("description", "Description"),
    col("category.name", "Category"),
    col("dimension_pack_assortment.name", "Pack assortment"),
    col("dimension_spec.name", "Dimension spec"),
    col("dimension_measure.name", "Dimension measure"),
  ],

  marketing_blurb: [col("blurb", "Blurb")],

  amazon_product_type: [col("amazon_template.name", "Amazon template")],

  amazon_browse_node: [
    col("country", "Country"),
    col("amazon_path", "Amazon path"),
    col("used", "Used", { type: "boolean" }),
    col("inventory_template", "Inventory template"),
  ],

  amazon_material: [],
  amazon_metal_type: [],
  amazon_metal_stamp: [],
  amazon_us_item_type: [],

  ring_size: [
    col("diameter_mm", "Diameter (mm)"),
    col("diameter_inches", "Diameter (in)"),
    col("circum_mm", "Circumference (mm)"),
    col("circum_inches", "Circumference (in)"),
    col("uk_size", "UK"),
    col("us_size", "US"),
    col("french_size", "French"),
    col("german_size", "German"),
    col("japan_size", "Japan"),
    col("swiss_size", "Swiss"),
  ],

  web_stock_availability_message: [
    col("condition_nos", "Condition nos"),
    col("long_message", "Long message"),
    col("short_message", "Short message"),
    col("category_page", "Category page"),
    col("basket", "Basket"),
  ],

  display: [
    col("show", "Show", { type: "boolean" }),
    col("cost", "Cost"),
  ],

  cost: [
    col("cost", "Cost"),
    col("currency.name", "Currency"),
  ],

  material: [
    col("show", "Show", { type: "boolean" }),
    col("is_metal", "Metal", { type: "boolean" }),
    col("is_gem", "Gem", { type: "boolean" }),
    col("composite", "Composite", { type: "boolean" }),
  ],

  joe_online_range: [
    col("french_name", "French"),
    col("german_name", "German"),
    col("italian_name", "Italian"),
    col("spanish_name", "Spanish"),
  ],
};
