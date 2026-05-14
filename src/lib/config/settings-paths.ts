/**
 * Maps full settings URLs (pathname) to catalog keys used by `useSettings` / seed data.
 * Extend when backend exposes dedicated catalogs per URL.
 */
export const SETTINGS_PATH_TO_SLUG: Record<string, string> = {
  // Stock — category
  "/settings/stock/category/categories": "category",
  "/settings/stock/category/groups": "category-groups",
  // Stock — fittings
  "/settings/stock/fittings/sizes-pack-assortments": "fittings",
  "/settings/stock/fittings/sizes-specs": "fitting-specs",
  "/settings/stock/fittings/sizes-measures": "fitting-measures",
  "/settings/stock/fittings/messages": "fitting-messages",
  // Stock — dimensions
  "/settings/stock/dimensions/pack-assortments": "dimensions",
  "/settings/stock/dimensions/specs": "dimensions",
  "/settings/stock/dimensions/measures": "dimensions",
  "/settings/stock/dimensions/messages": "messages",
  // Stock — stock
  "/settings/stock/stock/selections": "others",
  "/settings/stock/stock/collections": "others",
  "/settings/stock/stock/stock-ranges": "others",
  "/settings/stock/stock/marketing": "messages",
  "/settings/stock/messages": "messages",
  "/settings/stock/units": "units",
  "/settings/stock/carding": "carding",
  "/settings/stock/displays": "displays",
  "/settings/stock/colors": "colours",
  "/settings/stock/colors-options": "colours",
  "/settings/stock/sizes": "sizes",
  "/settings/stock/assembly-costs": "costs",
  "/settings/stock/packing-costs": "costs",
  "/settings/stock/other-assortments": "others",
  "/settings/stock/other-genders": "others",
  "/settings/stock/other-materials": "others",
  "/settings/stock/other-online-ranges": "others",
  "/settings/stock/other-custom-tariff-codes": "others",
  // Price
  "/settings/price/category": "category",
  "/settings/price/calculation": "costs",
  "/settings/price/currencies": "units",
  // Address
  "/settings/address/category": "address-types",
  "/settings/address/payment-method": "others",
  "/settings/address/ship-from": "regions",
  "/settings/address/pay-term": "others",
  "/settings/address/special-customer": "others",
  "/settings/address/ship-method": "others",
  "/settings/address/contact-departments": "departments",
  "/settings/address/contact-role": "roles",
  "/settings/address/agent": "permissions",
  "/settings/address/country": "countries",
  "/settings/address/ups-service": "others",
  // Others
  "/settings/others/profit-centre": "others",
  "/settings/others/area": "regions",
  "/settings/others/invoice-environment": "messages",
  "/settings/others/warehouse": "others",
  "/settings/others/shipping-charges": "costs",
  "/settings/others/cost-codes": "costs",
  "/settings/others/order-kinds": "others",
  "/settings/others/languages": "others",
  "/settings/others/label-sources": "others",
  "/settings/others/var-kinds": "others",
  "/settings/others/vat-rate-codes": "others",
  "/settings/others/bank-account": "others",
  "/settings/others/map-accountants": "others",
  "/settings/others/profit-loss": "others",
  "/settings/others/cash-flow": "others",
  "/settings/others/venues": "others",
  "/settings/others/documents": "others",
  // Messages
  "/settings/messages/purposes": "messages",
  "/settings/messages/general": "messages",
  "/settings/messages/shipping": "messages",
  "/settings/messages/payment-term": "messages",
  "/settings/messages/payment-method": "messages",
  "/settings/messages/bank": "messages",
};

/** First settings leaf URL used when visiting `/settings` only */
export const SETTINGS_DEFAULT_PATH = "/settings/stock/category/categories";

export function settingsPathToSlug(pathname: string): string {
  const normalized = pathname.replace(/\/$/, "") || "/";
  if (SETTINGS_PATH_TO_SLUG[normalized]) return SETTINGS_PATH_TO_SLUG[normalized];
  const legacy = pathname.match(/^\/settings\/([^/]+)$/);
  if (legacy) return legacy[1];
  const tail = normalized.split("/").filter(Boolean).pop() ?? "category";
  return SETTINGS_PATH_TO_SLUG[`/settings/stock/category/${tail}`] ?? tail.replace(/-/g, "-");
}

const SLUG_TO_CANONICAL_PATH: Partial<Record<string, string>> = {};
for (const [path, slug] of Object.entries(SETTINGS_PATH_TO_SLUG)) {
  if (!SLUG_TO_CANONICAL_PATH[slug]) SLUG_TO_CANONICAL_PATH[slug] = path;
}

/** Prefer pretty URLs from paths.ts map; fall back to legacy `/settings/$slug` shape */
export function slugToSettingsPath(slug: string): string {
  return SLUG_TO_CANONICAL_PATH[slug] ?? `/settings/${slug}`;
}
