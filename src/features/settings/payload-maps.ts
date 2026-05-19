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
    category_tarrif: p.category_tarrif || null,
    show: bool(p.show),
    category_group_id: num(p.category_group_id),
    fitting_size_measure_id: num(p.fitting_size_measure_id),
    dimension_measure_id: num(p.dimension_measure_id),
    amazon_product_type_id: num(p.amazon_product_type_id),
    amazon_us_item_type_id: num(p.amazon_us_item_type_id),
    amazon_us_node: num(p.amazon_us_node),
    amazon_uk_node: num(p.amazon_uk_node),
  };
}

export function mapDisplayPayload(p: FormPayload): Record<string, unknown> {
  return {
    code: p.code ?? "",
    name: p.name ?? "",
    show: bool(p.show),
    cost: num(p.cost) ?? 0,
  };
}

export function mapJoeOnlineRangePayload(p: FormPayload): Record<string, unknown> {
  return {
    code: p.code ?? "",
    name: p.name ?? "",
    french_name: p.french_name || null,
    italian_name: p.italian_name || null,
    spanish_name: p.spanish_name || null,
    german_name: p.german_name || null,
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

function audienceValue(v: string | null | undefined): string | number | null {
  if (v == null || v === "") return null;
  const n = num(v);
  return n != null ? n : v;
}

export function mapFittingMessagePayload(p: FormPayload): Record<string, unknown> {
  return {
    category_id: num(p.category_id),
    fitting_size_pack_assortment_id: num(p.fitting_size_pack_assortment_id),
    fitting_size_spec_id: num(p.fitting_size_spec_id),
    fitting_size_measure_id: num(p.fitting_size_measure_id),
    audience: audienceValue(p.audience),
    description: p.description || null,
  };
}

export function mapDimensionMessagePayload(p: FormPayload): Record<string, unknown> {
  return {
    category_id: num(p.category_id),
    dimension_pack_assortment_id: num(p.dimension_pack_assortment_id),
    dimension_spec_id: num(p.dimension_spec_id),
    dimension_measure_id: num(p.dimension_measure_id),
    audience: audienceValue(p.audience),
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

export function mapPriceCategoryPayload(p: FormPayload): Record<string, unknown> {
  return {
    code: p.code ?? "",
    name: p.name ?? "",
    kind: p.kind ?? "",
    cap_abbr: p.cap_abbr ?? "",
    currency_id: num(p.currency_id),
  };
}

export function mapCurrencyPayload(p: FormPayload): Record<string, unknown> {
  return {
    code: p.code ?? "",
    name: p.name ?? "",
    abbr: p.abbr ?? "",
    symbol: p.symbol ?? "",
    exchange_rate_gbp: num(p.exchange_rate_gbp) ?? 0,
    exchange_rate_eur: num(p.exchange_rate_eur) ?? 0,
    exchange_rate_usd: num(p.exchange_rate_usd) ?? 0,
    exchange_rate_buy: num(p.exchange_rate_buy) ?? 0,
    prev_rate_gbp: num(p.prev_rate_gbp),
    prev_rate_usd: num(p.prev_rate_usd),
    prev_rate_eur: num(p.prev_rate_eur),
    prev_rate_buy: num(p.prev_rate_buy),
    cost_adjust: num(p.cost_adjust),
    sell_adjust: num(p.sell_adjust),
  };
}

export function mapPayTermPayload(p: FormPayload): Record<string, unknown> {
  return {
    code: p.code ?? "",
    name: p.name ?? "",
    days_needed: bool(p.days_needed),
    prepay_needed: bool(p.prepay_needed),
  };
}

export function mapShipMethodPayload(p: FormPayload): Record<string, unknown> {
  return {
    code: p.code ?? "",
    name: p.name ?? "",
    ups_service_id: num(p.ups_service_id),
  };
}

export function mapContactDeptPayload(p: FormPayload): Record<string, unknown> {
  return {
    code: p.code ?? "",
    name: p.name ?? "",
    list_order: num(p.list_order) ?? 0,
  };
}

export function mapAgentPayload(p: FormPayload): Record<string, unknown> {
  return {
    name: p.name ?? "",
    code: p.code ?? "",
  };
}

export function mapCountryPayload(p: FormPayload): Record<string, unknown> {
  return {
    name: p.name ?? "",
    iso_number: p.iso_number || null,
    iso_1: p.iso_1 || null,
    iso_2: p.iso_2 || null,
  };
}

export function mapAccountManagerPayload(p: FormPayload): Record<string, unknown> {
  return {
    name: p.name ?? "",
    code: p.code ?? "",
    email: p.email || null,
    telephone: p.telephone || null,
    mobile: p.mobile || null,
    monitor: bool(p.monitor),
  };
}

export function mapMessagePurposePayload(p: FormPayload): Record<string, unknown> {
  return {
    name: p.name ?? "",
    code: p.code ?? "",
    balance_invoice: bool(p.balance_invoice),
    balance_remind: bool(p.balance_remind),
    balance_reminder_msg_id: num(p.balance_reminder_msg_id),
  };
}

export function mapGeneralMessagePayload(p: FormPayload): Record<string, unknown> {
  return {
    message: p.message ?? "",
    language_id: num(p.language_id),
    message_purpose_id: num(p.message_purpose_id),
  };
}

export function mapShippingMessagePayload(p: FormPayload): Record<string, unknown> {
  return {
    message: p.message ?? "",
    language_id: num(p.language_id),
    document_id: num(p.document_id),
    ship_method_id: num(p.ship_method_id),
  };
}

export function mapPaymentTermMessagePayload(p: FormPayload): Record<string, unknown> {
  return {
    message: p.message ?? "",
    language_id: num(p.language_id),
    document_id: num(p.document_id),
    pay_term_id: num(p.pay_term_id),
  };
}

export function mapPaymentMethodMessagePayload(p: FormPayload): Record<string, unknown> {
  return {
    message: p.message ?? "",
    language_id: num(p.language_id),
    document_id: num(p.document_id),
    payment_method_id: num(p.payment_method_id),
  };
}

export function mapBankMessagePayload(p: FormPayload): Record<string, unknown> {
  return {
    message: p.message ?? "",
    language_id: num(p.language_id),
    bank_account_id: num(p.bank_account_id),
  };
}

export function mapVatRateCodePayload(p: FormPayload): Record<string, unknown> {
  return {
    code: p.code ?? "",
    name: p.name ?? "",
    rate: num(p.rate) ?? 0,
  };
}

export function mapCashFlowSectionPayload(p: FormPayload): Record<string, unknown> {
  return {
    code: p.code ?? "",
    name: p.name ?? "",
    polarity: num(p.polarity),
  };
}

export function mapVenuePayload(p: FormPayload): Record<string, unknown> {
  const orderType = num(p.order_type);
  return {
    code: p.code ?? "",
    name: p.name ?? "",
    order_type: orderType ?? 0,
  };
}

export function mapShippingChargePayload(p: FormPayload): Record<string, unknown> {
  return {
    code: p.code ?? "",
    name: p.name ?? "",
    amount_needed: bool(p.amount_needed),
  };
}

export function mapAreaPayload(p: FormPayload): Record<string, unknown> {
  return {
    code: p.code ?? "",
    name: p.name ?? "",
    iso_code: p.iso_code || null,
    uk_for_hmrc: bool(p.uk_for_hmrc),
  };
}

export function mapWarehousePayload(p: FormPayload): Record<string, unknown> {
  return {
    name: p.name ?? "",
    code: p.code ?? "",
    address_line1: p.address_line1 || null,
    address_line2: p.address_line2 || null,
    region: p.region || null,
    town: p.town || null,
    state: p.state || null,
    zip: p.zip || null,
    contact: p.contact || null,
    phone: p.phone || null,
    fax: p.fax || null,
    email: p.email || null,
    country_id: num(p.country_id),
    master: bool(p.master),
  };
}

export function mapProfitCentrePayload(p: FormPayload): Record<string, unknown> {
  return {
    code: p.code ?? "",
    name: p.name ?? "",
    address_1: p.address_1 || null,
    address_2: p.address_2 || null,
    region: p.region || null,
    town: p.town || null,
    state: p.state || null,
    zip_code: p.zip_code || null,
    vat: p.vat || null,
    phone_main: p.phone_main || null,
    phone_sales: p.phone_sales || null,
    phone_accts: p.phone_accts || null,
    fax: p.fax || null,
    email: p.email || null,
    website: p.website || null,
    next_proforma: num(p.next_proforma),
    next_invoice: num(p.next_invoice),
    next_credit: num(p.next_credit),
    next_cust_ord: num(p.next_cust_ord),
    next_supp_ord: num(p.next_supp_ord),
    next_subship: num(p.next_subship),
    country_id: num(p.country_id),
  };
}

export function mapBankAccountPayload(p: FormPayload): Record<string, unknown> {
  return {
    name: p.name ?? "",
    code: p.code ?? "",
    sort_code: p.sort_code || null,
    account_number: p.account_number || null,
    swift: p.swift || null,
    iban: p.iban || null,
    cust_direct_control: p.cust_direct_control || null,
    supp_acc_control: p.supp_acc_control || null,
    supp_direct_control: p.supp_direct_control || null,
    current_balance: num(p.current_balance),
    current_balance_gbp: num(p.current_balance_gbp),
    opening_balance: num(p.opening_balance),
    opening_balance_gbp: num(p.opening_balance_gbp),
    currency_id: num(p.currency_id),
  };
}

export function mapCostCodePayload(p: FormPayload): Record<string, unknown> {
  return {
    name: p.name ?? "",
    code: p.code ?? "",
    category: p.category || null,
    kind: p.kind || null,
    report: p.report || null,
    vat_box: p.vat_box || null,
    map_accountant_id: num(p.map_accountant_id),
    cash_flow_section_id: num(p.cash_flow_section_id),
    profit_loss_section_id: num(p.profit_loss_section_id),
    vat_intra_stat: bool(p.vat_intra_stat),
  };
}

export function mapOrderKindPayload(p: FormPayload): Record<string, unknown> {
  return {
    name: p.name ?? "",
    code: p.code ?? "",
    flags: {
      avail_calc: bool(p.flags_avail_calc),
      spare_calc: bool(p.flags_spare_calc),
      likely_confirmed: bool(p.flags_likely_confirmed),
      allow_allocation: bool(p.flags_allow_allocation),
    },
  };
}

export function mapInvoiceEnvironmentPayload(p: FormPayload): Record<string, unknown> {
  return {
    name: p.name ?? "",
    code: p.code ?? "",
    title: p.title ?? "",
    price_category_id: num(p.price_category_id),
    currency_id: num(p.currency_id),
    bank_account_id: num(p.bank_account_id),
    vat_kind_id: num(p.vat_kind_id),
    vat_rate_code_id: num(p.vat_rate_code_id),
    main_code_id: num(p.main_code_id),
    post_code_id: num(p.post_code_id),
    control_code_id: num(p.control_code_id),
    buy_code_id: num(p.buy_code_id),
    discount_taken_code_id: num(p.discount_taken_code_id),
    discount_given_code_id: num(p.discount_given_code_id),
    vat_reg_needed: bool(p.vat_reg_needed),
    finances: bool(p.finances),
    stock: bool(p.stock),
    shop: bool(p.shop),
  };
}
