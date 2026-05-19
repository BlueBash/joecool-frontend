import type { FieldDef } from "../../../types";
import { AUDIENCE_OPTIONS, codeNameFields } from "./shared";

export const stockFormFields = {
  category: [
    ...codeNameFields(),
    {
      name: "conversational_name",
      label: "Conversational name",
      type: "text",
      maxLength: 120,
    },
    {
      name: "category_tarrif",
      label: "Category tariff",
      type: "text",
      maxLength: 120,
    },
    {
      name: "category_group_id",
      label: "Category group",
      type: "reference",
      required: true,
      referenceKlass: "StockSettings::CategoryGroup",
      placeholder: "Search category groups…",
    },
    {
      name: "fitting_size_measure_id",
      label: "Fitting size measure",
      type: "reference",
      required: true,
      referenceKlass: "StockSettings::FittingSizeMeasure",
      placeholder: "Search measures…",
    },
    {
      name: "dimension_measure_id",
      label: "Dimension measure",
      type: "reference",
      referenceKlass: "StockSettings::DimensionMeasure",
      placeholder: "Search measures…",
    },
    {
      name: "show",
      label: "Show",
      type: "boolean",
    },
  ] satisfies FieldDef[],

  category_group: codeNameFields(),

  packaging: codeNameFields(),

  fitting_size_pack_assortment: [
    ...codeNameFields(),
    {
      name: "fitting_size_spec_id",
      label: "Fitting size spec",
      type: "reference",
      referenceKlass: "StockSettings::FittingSizeSpec",
      placeholder: "Search specs…",
    },
    {
      name: "adjustable",
      label: "Adjustable",
      type: "boolean",
    },
  ] satisfies FieldDef[],

  fitting_size_spec: [
    ...codeNameFields(),
    {
      name: "values",
      label: "Values",
      type: "number",
    },
  ] satisfies FieldDef[],

  fitting_size_measure: codeNameFields(),

  fitting_message: [
    {
      name: "audience",
      label: "Audience",
      type: "select",
      required: true,
      options: [...AUDIENCE_OPTIONS],
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
      maxLength: 500,
    },
    {
      name: "category_id",
      label: "Category",
      type: "reference",
      referenceKlass: "StockSettings::Category",
      placeholder: "Search categories…",
    },
    {
      name: "fitting_size_pack_assortment_id",
      label: "Pack assortment",
      type: "reference",
      referenceKlass: "StockSettings::FittingSizePackAssortment",
      placeholder: "Search pack assortments…",
    },
    {
      name: "fitting_size_spec_id",
      label: "Fitting spec",
      type: "reference",
      referenceKlass: "StockSettings::FittingSizeSpec",
      placeholder: "Search specs…",
    },
    {
      name: "fitting_size_measure_id",
      label: "Fitting measure",
      type: "reference",
      referenceKlass: "StockSettings::FittingSizeMeasure",
      placeholder: "Search measures…",
    },
  ] satisfies FieldDef[],

  dimension_pack_assortment: codeNameFields(),
  dimension_spec: [
    ...codeNameFields(),
    {
      name: "values",
      label: "Values",
      type: "number",
    },
  ] satisfies FieldDef[],
  dimension_measure: codeNameFields(),

  dimension_message: [
    {
      name: "audience",
      label: "Audience",
      type: "select",
      required: true,
      options: [...AUDIENCE_OPTIONS],
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
      maxLength: 500,
    },
    {
      name: "category_id",
      label: "Category",
      type: "reference",
      referenceKlass: "StockSettings::Category",
      placeholder: "Search categories…",
    },
    {
      name: "dimension_pack_assortment_id",
      label: "Pack assortment",
      type: "reference",
      referenceKlass: "StockSettings::DimensionPackAssortment",
      placeholder: "Search pack assortments…",
    },
    {
      name: "dimension_spec_id",
      label: "Dimension spec",
      type: "reference",
      referenceKlass: "StockSettings::DimensionSpec",
      placeholder: "Search specs…",
    },
    {
      name: "dimension_measure_id",
      label: "Dimension measure",
      type: "reference",
      referenceKlass: "StockSettings::DimensionMeasure",
      placeholder: "Search measures…",
    },
  ] satisfies FieldDef[],

  selection: codeNameFields(),
  collection: codeNameFields(),
  range: codeNameFields(),

  marketing_blurb: [
    {
      name: "code",
      label: "Code",
      type: "text",
      required: true,
      maxLength: 40,
    },
    {
      name: "blurb",
      label: "Blurb",
      type: "textarea",
      required: true,
      maxLength: 500,
    },
  ] satisfies FieldDef[],

  amazon_template: codeNameFields(),

  amazon_product_type: [
    ...codeNameFields(),
    {
      name: "amazon_template_id",
      label: "Amazon template",
      type: "reference",
      referenceKlass: "StockSettings::AmazonTemplate",
      placeholder: "Search templates…",
    },
  ] satisfies FieldDef[],

  amazon_browse_node: [
    {
      name: "country",
      label: "Country",
      type: "text",
      required: true,
      maxLength: 10,
    },
    ...codeNameFields(),
    {
      name: "amazon_path",
      label: "Amazon path",
      type: "text",
      maxLength: 255,
    },
    {
      name: "used",
      label: "Used",
      type: "boolean",
    },
    {
      name: "inventory_template",
      label: "Inventory template",
      type: "text",
      maxLength: 120,
    },
  ] satisfies FieldDef[],

  amazon_material: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      maxLength: 120,
    },
  ] satisfies FieldDef[],

  amazon_metal_type: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      maxLength: 120,
    },
  ] satisfies FieldDef[],

  amazon_metal_stamp: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      maxLength: 120,
    },
  ] satisfies FieldDef[],

  amazon_us_item_type: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      maxLength: 120,
    },
  ] satisfies FieldDef[],

  colour: codeNameFields(),
  colour_option: codeNameFields(),

  ring_size: [
    { name: "diameter_mm", label: "Internal diameter (mm)", type: "number", required: true },
    { name: "diameter_inches", label: "Internal diameter (inches)", type: "number", required: true },
    { name: "circum_mm", label: "Inner circumference (mm)", type: "number", required: true },
    { name: "circum_inches", label: "Inner circumference (inches)", type: "number", required: true },
    { name: "uk_size", label: "UK size", type: "number", required: true },
    { name: "us_size", label: "US size", type: "number", required: true },
    { name: "french_size", label: "French", type: "number" },
    { name: "german_size", label: "German", type: "number" },
    { name: "japan_size", label: "Japan", type: "number" },
    { name: "swiss_size", label: "Swiss", type: "number" },
  ] satisfies FieldDef[],

  web_stock_availability_message: [
    { name: "condition_nos", label: "Condition nos", type: "text", maxLength: 120 },
    { name: "code", label: "Code", type: "text", required: true, maxLength: 40 },
    { name: "long_message", label: "Long message", type: "textarea", maxLength: 500 },
    { name: "short_message", label: "Short message", type: "textarea", maxLength: 255 },
    { name: "category_page", label: "Category page", type: "text", maxLength: 255 },
    { name: "basket", label: "Basket", type: "text", maxLength: 255 },
  ] satisfies FieldDef[],

  unit: codeNameFields(),
  carding: codeNameFields(),

  display: [
    ...codeNameFields(),
    { name: "show", label: "Show", type: "boolean", required: true },
    { name: "cost", label: "Cost", type: "number", required: true },
  ] satisfies FieldDef[],

  cost: [
    { name: "name", label: "Name", type: "text", required: true, maxLength: 120 },
    { name: "cost", label: "Cost", type: "number", required: true },
    {
      name: "currency_id",
      label: "Currency",
      type: "reference",
      referenceKlass: "Currency",
      placeholder: "Search currencies…",
    },
  ] satisfies FieldDef[],

  assortment: codeNameFields(),
  target_gender: codeNameFields(),

  material: [
    { name: "name", label: "Name", type: "text", required: true, maxLength: 120 },
    { name: "code", label: "Code", type: "text", required: true, maxLength: 40 },
    { name: "show", label: "Show", type: "boolean" },
    { name: "is_metal", label: "Metal", type: "boolean" },
    { name: "is_gem", label: "Gem", type: "boolean" },
    { name: "composite", label: "Composite", type: "boolean" },
  ] satisfies FieldDef[],

  joe_online_range: [
    ...codeNameFields(),
    { name: "french_name", label: "French", type: "text", maxLength: 120 },
    { name: "italian_name", label: "Italian", type: "text", maxLength: 120 },
    { name: "spanish_name", label: "Spanish", type: "text", maxLength: 120 },
    { name: "german_name", label: "German", type: "text", maxLength: 120 },
  ] satisfies FieldDef[],

  custom_tarrif_code: codeNameFields(),
} as const;

export type StockFormBodyKey = keyof typeof stockFormFields;
