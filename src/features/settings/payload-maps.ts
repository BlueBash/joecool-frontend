import type { FormPayload } from "./types";

function num(v: string | null | undefined): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function bool(v: string | null | undefined): boolean {
  const s = (v ?? "").trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes";
}

export function mapCodeNamePayload(p: FormPayload): Record<string, unknown> {
  return {
    code: p.code ?? "",
    name: p.name ?? "",
  };
}

export function mapCategoryPayload(p: FormPayload): Record<string, unknown> {
  return {
    code: p.code ?? "",
    name: p.name ?? "",
    conversational_name: p.conversational_name || null,
    show: bool(p.show),
    category_group_id: num(p.category_group_id),
    fitting_size_measure_id: num(p.fitting_size_measure_id),
    dimension_measure_id: num(p.dimension_measure_id),
  };
}

export function mapFittingPackAssortmentPayload(p: FormPayload): Record<string, unknown> {
  return {
    code: p.code ?? "",
    name: p.name ?? "",
    fitting_size_spec_id: num(p.fitting_size_spec_id),
    adjustable: bool(p.adjustable),
  };
}

export function mapSpecWithValuesPayload(p: FormPayload): Record<string, unknown> {
  return {
    code: p.code ?? "",
    name: p.name ?? "",
    values: p.values || null,
  };
}

export function mapFittingMessagePayload(p: FormPayload): Record<string, unknown> {
  return {
    category_id: num(p.category_id),
    fitting_size_pack_assortment_id: num(p.fitting_size_pack_assortment_id),
    fitting_size_spec_id: num(p.fitting_size_spec_id),
    fitting_size_measure_id: num(p.fitting_size_measure_id),
    audience: p.audience || null,
    description: p.description || null,
    name: p.name ?? "",
  };
}

export function mapDimensionMessagePayload(p: FormPayload): Record<string, unknown> {
  return {
    category_id: num(p.category_id),
    dimension_pack_assortment_id: num(p.dimension_pack_assortment_id),
    dimension_spec_id: num(p.dimension_spec_id),
    dimension_measure_id: num(p.dimension_measure_id),
    audience: num(p.audience),
    description: p.description || null,
  };
}

export function mapMarketingBlurbPayload(p: FormPayload): Record<string, unknown> {
  return {
    code: p.code ?? "",
    blurb: p.blurb ?? "",
  };
}

export function mapAmazonProductTypePayload(p: FormPayload): Record<string, unknown> {
  return {
    code: p.code ?? "",
    name: p.name ?? "",
    amazon_template_id: num(p.amazon_template_id),
  };
}

export function mapAmazonBrowseNodePayload(p: FormPayload): Record<string, unknown> {
  return {
    country: p.country ?? "",
    code: p.code ?? "",
    name: p.name ?? "",
    amazon_path: p.amazon_path || null,
    used: bool(p.used),
    inventory_template: p.inventory_template || null,
  };
}

export function mapCostAssemblyPayload(p: FormPayload): Record<string, unknown> {
  return {
    cost_type: 0,
    name: p.name ?? "",
    currency_id: num(p.currency_id),
    cost: num(p.cost) ?? 0,
  };
}

export function mapCostPackingPayload(p: FormPayload): Record<string, unknown> {
  return {
    cost_type: 1,
    name: p.name ?? "",
    currency_id: num(p.currency_id),
    cost: num(p.cost) ?? 0,
  };
}

export function mapMaterialPayload(p: FormPayload): Record<string, unknown> {
  return {
    name: p.name ?? "",
    code: p.code ?? "",
    show: bool(p.show),
    is_metal: bool(p.is_metal),
    is_gem: bool(p.is_gem),
    composite: bool(p.composite),
    amazon_material_id: num(p.amazon_material_id),
    amazon_metal_type_id: num(p.amazon_metal_type_id),
    amazon_metal_stamp_id: num(p.amazon_metal_stamp_id),
  };
}

export function mapWebStockAvailabilityPayload(p: FormPayload): Record<string, unknown> {
  const special = num(p.special);
  return {
    condition_nos: p.condition_nos || null,
    code: p.code ?? "",
    long_message: p.long_message || null,
    short_message: p.short_message || null,
    special: special ?? 0,
    category_page: p.category_page || null,
    basket: p.basket || null,
  };
}

export function mapRingSizePayload(p: FormPayload): Record<string, unknown> {
  return {
    diameter_mm: num(p.diameter_mm) ?? 0,
    diameter_inches: num(p.diameter_inches) ?? 0,
    circum_mm: num(p.circum_mm) ?? 0,
    circum_inches: num(p.circum_inches) ?? 0,
    uk_size: num(p.uk_size) ?? 0,
    us_size: num(p.us_size) ?? 0,
    french_size: num(p.french_size),
    german_size: num(p.german_size),
    japan_size: num(p.japan_size),
    swiss_size: num(p.swiss_size),
  };
}

export function mapNameOnlyPayload(p: FormPayload): Record<string, unknown> {
  return { name: p.name ?? "" };
}
