/** Optional display metadata for settings slugs — paths define routable slugs. */

export type SettingsSectionMeta = {
  label: string;
  resourceKey: string;
  countKey?: string;
};

export const SETTINGS_SECTION_META: Record<string, SettingsSectionMeta> = {
  "stock/category/categories": {
    label: "Categories",
    resourceKey: "stock.category.categories",
    countKey: "category",
  },
  "stock/category/groups": {
    label: "Category Groups",
    resourceKey: "stock.category.groups",
  },
  "stock/fittings/sizes-pack-assortments": {
    label: "Pack Assortments",
    resourceKey: "stock.fittings.sizes-pack-assortments",
    countKey: "fittings",
  },
  "stock/fittings/sizes-specs": {
    label: "Sizes Specs",
    resourceKey: "stock.fittings.sizes-specs",
    countKey: "fittings",
  },
  "stock/fittings/sizes-measures": {
    label: "Sizes Measures",
    resourceKey: "stock.fittings.sizes-measures",
    countKey: "fittings",
  },
  "stock/fittings/messages": {
    label: "Fitting Messages",
    resourceKey: "stock.fittings.messages",
    countKey: "fittings",
  },
  "stock/dimensions/pack-assortments": {
    label: "Pack Assortments",
    resourceKey: "stock.dimensions.pack-assortments",
    countKey: "dimensions",
  },
  "stock/dimensions/specs": {
    label: "Specs",
    resourceKey: "stock.dimensions.specs",
    countKey: "dimensions",
  },
  "stock/dimensions/measures": {
    label: "Measures",
    resourceKey: "stock.dimensions.measures",
    countKey: "dimensions",
  },
  "stock/dimensions/messages": {
    label: "Messages",
    resourceKey: "stock.dimensions.messages",
    countKey: "dimensions",
  },
  "stock/stock/selections": {
    label: "Selections",
    resourceKey: "stock.stock.selections",
    countKey: "others",
  },
  "stock/stock/collections": {
    label: "Collections",
    resourceKey: "stock.stock.collections",
    countKey: "others",
  },
  "stock/stock/stock-ranges": {
    label: "Stock Ranges",
    resourceKey: "stock.stock.stock-ranges",
    countKey: "others",
  },
  "stock/stock/marketing": {
    label: "Marketing",
    resourceKey: "stock.stock.marketing",
    countKey: "messages",
  },
  "stock/messages": {
    label: "Messages",
    resourceKey: "stock.messages",
    countKey: "messages",
  },
  "stock/units": {
    label: "Units",
    resourceKey: "stock.attributes.units",
    countKey: "units",
  },
  "stock/carding": {
    label: "Carding",
    resourceKey: "stock.presentation.carding",
    countKey: "carding",
  },
  "stock/displays": {
    label: "Displays",
    resourceKey: "stock.presentation.displays",
    countKey: "displays",
  },
  "stock/colors": {
    label: "Colors",
    resourceKey: "stock.attributes.colors",
    countKey: "colours",
  },
  "stock/colors-options": {
    label: "Color Options",
    resourceKey: "stock.attributes.colors-options",
  },
  "stock/sizes": {
    label: "Ring sizes",
    resourceKey: "stock.attributes.sizes",
    countKey: "sizes",
  },
  "stock/assembly-costs": {
    label: "Assembly Costs",
    resourceKey: "stock.presentation.assembly-costs",
    countKey: "costs",
  },
  "stock/packing-costs": {
    label: "Packing Costs",
    resourceKey: "stock.presentation.packing-costs",
    countKey: "costs",
  },
  "stock/other-assortments": {
    label: "Assortments",
    resourceKey: "stock.others.other-assortments",
    countKey: "others",
  },
  "stock/other-genders": {
    label: "Genders",
    resourceKey: "stock.others.other-genders",
    countKey: "others",
  },
  "stock/other-materials": {
    label: "Materials",
    resourceKey: "stock.others.other-materials",
    countKey: "others",
  },
  "stock/other-online-ranges": {
    label: "Online Ranges",
    resourceKey: "stock.others.other-online-ranges",
    countKey: "others",
  },
  "stock/other-custom-tariff-codes": {
    label: "Custom Tariff Codes",
    resourceKey: "stock.others.other-custom-tariff-codes",
    countKey: "others",
  },
  "price/category": { label: "Category", resourceKey: "price.category" },
  "price/calculation": { label: "Calculation", resourceKey: "price.calculation" },
  "price/currencies": { label: "Currencies", resourceKey: "price.currencies" },
  "address/category": { label: "Category", resourceKey: "address.category" },
  "address/payment-method": { label: "Payment Method", resourceKey: "address.payment-method" },
  "address/ship-from": { label: "Ship From", resourceKey: "address.ship-from" },
  "address/pay-term": { label: "Pay Term", resourceKey: "address.pay-term" },
  "address/special-customer": {
    label: "Special Customer",
    resourceKey: "address.special-customer",
  },
  "address/ship-method": { label: "Ship Method", resourceKey: "address.ship-method" },
  "address/contact-departments": {
    label: "Contact Departments",
    resourceKey: "address.contact-departments",
  },
  "address/contact-role": { label: "Contact Roles", resourceKey: "address.contact-role" },
  "address/agent": { label: "Agents", resourceKey: "address.agent" },
  "address/country": { label: "Countries", resourceKey: "address.country" },
  "address/ups-service": { label: "UPS Service", resourceKey: "address.ups-service" },
  "messages/purposes": { label: "Purposes", resourceKey: "messages.purposes" },
  "messages/general": { label: "General", resourceKey: "messages.general" },
  "messages/shipping": { label: "Shipping", resourceKey: "messages.shipping" },
  "messages/payment-term": { label: "Payment Term", resourceKey: "messages.payment-term" },
  "messages/payment-method": {
    label: "Payment Method",
    resourceKey: "messages.payment-method",
  },
  "messages/bank": { label: "Bank", resourceKey: "messages.bank" },
  "others/profit-centre": { label: "Profit Centre", resourceKey: "others.profit-centre" },
  "others/area": { label: "Area", resourceKey: "others.area" },
  "others/invoice-environment": {
    label: "Invoice Environment",
    resourceKey: "others.invoice-environment",
  },
  "others/warehouse": { label: "Warehouse", resourceKey: "others.warehouse" },
  "others/shipping-charges": {
    label: "Shipping Charges",
    resourceKey: "others.shipping-charges",
  },
  "others/cost-codes": { label: "Cost Codes", resourceKey: "others.cost-codes" },
  "others/order-kinds": { label: "Order Kinds", resourceKey: "others.order-kinds" },
  "others/languages": { label: "Languages", resourceKey: "others.languages" },
  "others/label-sources": { label: "Label Sources", resourceKey: "others.label-sources" },
  "others/var-kinds": { label: "VAT Kinds", resourceKey: "others.vat-kinds" },
  "others/vat-rate-codes": { label: "VAT Rate Codes", resourceKey: "others.vat-rate-codes" },
  "others/bank-account": { label: "Bank Accounts", resourceKey: "others.bank-account" },
  "others/map-accountants": { label: "Map Accountants", resourceKey: "others.map-accountants" },
  "others/profit-loss": { label: "Profit & Loss", resourceKey: "others.profit-loss" },
  "others/cash-flow": { label: "Cash Flow", resourceKey: "others.cash-flow" },
  "others/venues": { label: "Venues", resourceKey: "others.venues" },
  "others/documents": { label: "Documents", resourceKey: "others.documents" },
};

export const sectionTitles: Record<string, { title: string; desc: string }> = {
  "stock/category/categories": {
    title: "Stock categories",
    desc: "Product categories used across stock and listings.",
  },
  "stock/category/groups": {
    title: "Category groups",
    desc: "Higher-level groupings for categories.",
  },
  "stock/messages": {
    title: "Stock messages",
    desc: "Stock-related message templates.",
  },
  "stock/fittings/sizes-pack-assortments": {
    title: "Fitting pack assortments",
    desc: "Pack assortments linked to fitting size specs.",
  },
  "stock/fittings/sizes-specs": {
    title: "Fitting size specs",
    desc: "Specification rows for fitting sizes.",
  },
  "stock/fittings/sizes-measures": {
    title: "Fitting size measures",
    desc: "Units and measures for fitting sizes.",
  },
  "stock/fittings/messages": {
    title: "Fitting messages",
    desc: "Customer-facing fitting copy by category and assortment.",
  },
  "stock/dimensions/pack-assortments": {
    title: "Dimension pack assortments",
    desc: "Pack assortments used in dimension messaging.",
  },
  "stock/dimensions/specs": {
    title: "Dimension specs",
    desc: "Dimension specification definitions.",
  },
  "stock/dimensions/measures": {
    title: "Dimension measures",
    desc: "Measures used with dimension specs.",
  },
  "stock/dimensions/messages": {
    title: "Dimension messages",
    desc: "Templated dimension copy for channels.",
  },
  "stock/stock/selections": { title: "Selections", desc: "Stock selection lookup values." },
  "stock/stock/collections": { title: "Collections", desc: "Collection lookup values." },
  "stock/stock/stock-ranges": { title: "Stock ranges", desc: "Range codes for stock." },
  "stock/stock/marketing": { title: "Marketing blurbs", desc: "Short marketing snippets." },
  "stock/colors": { title: "Colours", desc: "Colour swatches and codes." },
  "stock/colors-options": { title: "Colour options", desc: "Bundled / assorted colour options." },
  "stock/sizes": { title: "Ring sizes", desc: "International ring size conversion table." },
  "stock/units": { title: "Units", desc: "Units of measure." },
  "stock/carding": { title: "Carding", desc: "Carding / ticket options." },
  "stock/displays": { title: "Displays", desc: "Display types." },
  "stock/assembly-costs": { title: "Assembly costs", desc: "Assembly-side cost rows." },
  "stock/packing-costs": { title: "Packing costs", desc: "Packing-side cost rows." },
  "stock/other-assortments": { title: "Assortments", desc: "Other assortment codes." },
  "stock/other-genders": { title: "Target genders", desc: "Gender target lookup values." },
  "stock/other-materials": { title: "Materials", desc: "Jewellery / product materials." },
  "stock/other-online-ranges": { title: "Joe online ranges", desc: "Joe Cool online range flags." },
  "stock/other-custom-tariff-codes": {
    title: "Custom tariff codes",
    desc: "Customs / tariff reference codes.",
  },
  "price/category": { title: "Price category", desc: "Price book categories." },
  "price/calculation": { title: "Price calculation", desc: "Calculation rules and bases." },
  "price/currencies": { title: "Currencies", desc: "Supported currencies." },
  "address/category": { title: "Address category", desc: "Address classification." },
  "address/payment-method": { title: "Payment methods", desc: "Accepted payment methods." },
  "address/ship-from": { title: "Ship from", desc: "Ship-from locations." },
  "address/pay-term": { title: "Pay terms", desc: "Payment term codes." },
  "address/special-customer": { title: "Special customers", desc: "Special customer flags." },
  "address/ship-method": { title: "Ship methods", desc: "Carrier / ship methods." },
  "address/contact-departments": { title: "Contact departments", desc: "Department directory." },
  "address/contact-role": { title: "Contact roles", desc: "Roles on customer contacts." },
  "address/agent": { title: "Agents", desc: "Agent directory." },
  "address/country": { title: "Countries", desc: "Country reference list." },
  "address/ups-service": { title: "UPS services", desc: "UPS service codes." },
  "messages/purposes": { title: "Message purposes", desc: "Why a message is shown." },
  "messages/general": { title: "General messages", desc: "General-purpose snippets." },
  "messages/shipping": { title: "Shipping messages", desc: "Shipping-related snippets." },
  "messages/payment-term": { title: "Payment term messages", desc: "Payment term copy." },
  "messages/payment-method": { title: "Payment method messages", desc: "Payment method copy." },
  "messages/bank": { title: "Bank messages", desc: "Banking / remittance copy." },
  "others/profit-centre": { title: "Profit centres", desc: "Profit centre codes." },
  "others/area": { title: "Areas", desc: "Business areas / regions." },
  "others/invoice-environment": { title: "Invoice environments", desc: "Invoice environment keys." },
  "others/warehouse": { title: "Warehouses", desc: "Warehouse master list." },
  "others/shipping-charges": { title: "Shipping charges", desc: "Shipping charge rules." },
  "others/cost-codes": { title: "Cost codes", desc: "Cost accounting codes." },
  "others/order-kinds": { title: "Order kinds", desc: "Order classification." },
  "others/languages": { title: "Languages", desc: "Supported languages." },
  "others/label-sources": { title: "Label sources", desc: "Label feed sources." },
  "others/var-kinds": { title: "VAT kinds", desc: "VAT category kinds." },
  "others/vat-rate-codes": { title: "VAT rate codes", desc: "VAT rate identifiers." },
  "others/bank-account": { title: "Bank accounts", desc: "Company bank accounts." },
  "others/map-accountants": { title: "Map accountants", desc: "Accountant mapping." },
  "others/profit-loss": { title: "Profit & loss", desc: "P&L mapping rows." },
  "others/cash-flow": { title: "Cash flow", desc: "Cash flow mapping rows." },
  "others/venues": { title: "Venues", desc: "Venue master list." },
  "others/documents": { title: "Documents", desc: "Document types." },
};

export function humanizePathSegment(segment: string): string {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function humanizeSlug(slug: string): string {
  const segment = slug.split("/").pop() ?? slug;
  return humanizePathSegment(segment);
}

export function resolveSectionLabel(slug: string): string {
  const meta = SETTINGS_SECTION_META[slug];
  if (meta?.label) return meta.label;
  const title = sectionTitles[slug]?.title;
  if (title) return title;
  return humanizeSlug(slug);
}
