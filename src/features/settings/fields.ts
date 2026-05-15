import type { FieldDef } from "./types";

/** Typical `stock_settings` row: machine `code` + human `name`. */
export const F_CODE_NAME: FieldDef[] = [
  {
    name: "code",
    label: "Code",
    kind: "text",
    required: true,
    placeholder: "Short code",
    maxLength: 80,
  },
  {
    name: "name",
    label: "Name",
    kind: "text",
    required: true,
    placeholder: "Display name",
    maxLength: 200,
  },
];

export const F_CATEGORY: FieldDef[] = [
  { name: "code", label: "Code", kind: "text", required: true, maxLength: 40 },
  { name: "name", label: "Name", kind: "text", required: true, maxLength: 120 },
  {
    name: "conversational_name",
    label: "Conversational name",
    kind: "text",
    maxLength: 120,
  },
  {
    name: "show",
    label: "Show",
    kind: "text",
    placeholder: "true or false",
    maxLength: 5,
  },
  {
    name: "category_group_id",
    label: "Category group ID",
    kind: "text",
    maxLength: 20,
  },
  {
    name: "fitting_size_measure_id",
    label: "Fitting size measure ID",
    kind: "text",
    maxLength: 20,
  },
  {
    name: "dimension_measure_id",
    label: "Dimension measure ID",
    kind: "text",
    maxLength: 20,
  },
];

export const F_CODE_NAME_VALUES: FieldDef[] = [
  ...F_CODE_NAME,
  { name: "values", label: "Values", kind: "text", maxLength: 120 },
];

export const F_FITTING_PACK_ASSORTMENT: FieldDef[] = [
  ...F_CODE_NAME,
  {
    name: "fitting_size_spec_id",
    label: "Fitting size spec ID",
    kind: "text",
    required: true,
    maxLength: 20,
  },
  {
    name: "adjustable",
    label: "Adjustable",
    kind: "text",
    placeholder: "true or false",
    maxLength: 5,
  },
];

export const F_FITTING_MESSAGE: FieldDef[] = [
  { name: "name", label: "Name", kind: "text", required: true, maxLength: 200 },
  { name: "audience", label: "Audience", kind: "text", maxLength: 40 },
  {
    name: "description",
    label: "Description",
    kind: "textarea",
    maxLength: 2000,
  },
  { name: "category_id", label: "Category ID", kind: "text", maxLength: 20 },
  {
    name: "fitting_size_pack_assortment_id",
    label: "Pack assortment ID",
    kind: "text",
    maxLength: 20,
  },
  { name: "fitting_size_spec_id", label: "Fitting spec ID", kind: "text", maxLength: 20 },
  {
    name: "fitting_size_measure_id",
    label: "Fitting measure ID",
    kind: "text",
    maxLength: 20,
  },
];

export const F_DIMENSION_MESSAGE: FieldDef[] = [
  {
    name: "description",
    label: "Description",
    kind: "textarea",
    required: true,
    maxLength: 2000,
  },
  { name: "audience", label: "Audience (numeric)", kind: "text", maxLength: 10 },
  { name: "category_id", label: "Category ID", kind: "text", maxLength: 20 },
  {
    name: "dimension_pack_assortment_id",
    label: "Pack assortment ID",
    kind: "text",
    maxLength: 20,
  },
  { name: "dimension_spec_id", label: "Dimension spec ID", kind: "text", maxLength: 20 },
  {
    name: "dimension_measure_id",
    label: "Dimension measure ID",
    kind: "text",
    maxLength: 20,
  },
];

export const F_MARKETING_BLURB: FieldDef[] = [
  { name: "code", label: "Code", kind: "text", required: true, maxLength: 80 },
  {
    name: "blurb",
    label: "Blurb",
    kind: "textarea",
    required: true,
    maxLength: 4000,
  },
];

export const F_AMAZON_PRODUCT_TYPE: FieldDef[] = [
  ...F_CODE_NAME,
  {
    name: "amazon_template_id",
    label: "Amazon template ID",
    kind: "text",
    required: true,
    maxLength: 20,
  },
];

export const F_AMAZON_BROWSE_NODE: FieldDef[] = [
  { name: "country", label: "Country", kind: "text", required: true, maxLength: 10 },
  ...F_CODE_NAME,
  { name: "amazon_path", label: "Amazon path", kind: "text", maxLength: 200 },
  {
    name: "used",
    label: "Used",
    kind: "text",
    placeholder: "true or false",
    maxLength: 5,
  },
  {
    name: "inventory_template",
    label: "Inventory template",
    kind: "textarea",
    maxLength: 500,
  },
];

export const F_COST_ROW: FieldDef[] = [
  { name: "name", label: "Name", kind: "text", required: true, maxLength: 200 },
  { name: "currency_id", label: "Currency ID", kind: "text", required: true, maxLength: 20 },
  { name: "cost", label: "Amount", kind: "text", required: true, maxLength: 20 },
];

export const F_MATERIAL: FieldDef[] = [
  ...F_CODE_NAME,
  {
    name: "show",
    label: "Show",
    kind: "text",
    placeholder: "true or false",
    maxLength: 5,
  },
  {
    name: "is_metal",
    label: "Is metal",
    kind: "text",
    placeholder: "true or false",
    maxLength: 5,
  },
  {
    name: "is_gem",
    label: "Is gem",
    kind: "text",
    placeholder: "true or false",
    maxLength: 5,
  },
  {
    name: "composite",
    label: "Composite",
    kind: "text",
    placeholder: "true or false",
    maxLength: 5,
  },
  {
    name: "amazon_material_id",
    label: "Amazon material ID",
    kind: "text",
    maxLength: 20,
  },
  {
    name: "amazon_metal_type_id",
    label: "Amazon metal type ID",
    kind: "text",
    maxLength: 20,
  },
  {
    name: "amazon_metal_stamp_id",
    label: "Amazon metal stamp ID",
    kind: "text",
    maxLength: 20,
  },
];

export const F_WEB_STOCK_AVAILABILITY: FieldDef[] = [
  { name: "code", label: "Code", kind: "text", required: true, maxLength: 40 },
  { name: "condition_nos", label: "Condition nos", kind: "text", maxLength: 40 },
  {
    name: "short_message",
    label: "Short message",
    kind: "text",
    maxLength: 200,
  },
  {
    name: "long_message",
    label: "Long message",
    kind: "textarea",
    maxLength: 4000,
  },
  { name: "special", label: "Special (number)", kind: "text", maxLength: 10 },
  { name: "category_page", label: "Category page", kind: "text", maxLength: 120 },
  { name: "basket", label: "Basket", kind: "text", maxLength: 120 },
];

export const F_RING_SIZE: FieldDef[] = [
  { name: "diameter_mm", label: "Diameter (mm)", kind: "text", required: true, maxLength: 20 },
  {
    name: "diameter_inches",
    label: "Diameter (in)",
    kind: "text",
    required: true,
    maxLength: 20,
  },
  { name: "circum_mm", label: "Circumference (mm)", kind: "text", required: true, maxLength: 20 },
  {
    name: "circum_inches",
    label: "Circumference (in)",
    kind: "text",
    required: true,
    maxLength: 20,
  },
  { name: "uk_size", label: "UK size", kind: "text", required: true, maxLength: 20 },
  { name: "us_size", label: "US size", kind: "text", required: true, maxLength: 20 },
  { name: "french_size", label: "French size", kind: "text", maxLength: 20 },
  { name: "german_size", label: "German size", kind: "text", maxLength: 20 },
  { name: "japan_size", label: "Japan size", kind: "text", maxLength: 20 },
  { name: "swiss_size", label: "Swiss size", kind: "text", maxLength: 20 },
];

export const F_NAME: FieldDef[] = [
  { name: "name", label: "Name", kind: "text", required: true, maxLength: 200 },
];
