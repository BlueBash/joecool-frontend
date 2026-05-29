export const DEFAULT_SELLING_GROUPS = ["whlsl", "apt", "amazon"] as const;
export type SellingGroupCode = (typeof DEFAULT_SELLING_GROUPS)[number] | string;

/** UI group `retail` maps to API group `apt`. */
export function sellingGroupToApi(group: string): string {
  return group === "retail" ? "apt" : group;
}

export function sellingGroupFromApi(group: string): string {
  return group === "apt" ? "retail" : group;
}

export const SELLING_CURRENCIES = ["gbp", "eur", "usd"] as const;
export type SellingCurrency = (typeof SELLING_CURRENCIES)[number];

export type SellingPriceCell = {
  id?: number;
  priceCategoryId?: number;
  price: number;
  per: number;
  age?: number;
};

export type SellingPricesByGroup = Record<string, Record<string, SellingPriceCell>>;
