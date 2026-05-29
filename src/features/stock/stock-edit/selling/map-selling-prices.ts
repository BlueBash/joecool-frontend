import type { StockItem } from "@/lib/types";
import type { FieldPath } from "react-hook-form";
import {
  DEFAULT_SELLING_GROUPS,
  sellingGroupFromApi,
  sellingGroupToApi,
  type SellingCurrency,
  type SellingPricesByGroup,
} from "./selling-types";

function num(v: unknown, fallback = 0): number {
  if (v == null || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function idNum(v: unknown): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

const CUR_CAP: Record<SellingCurrency, string> = {
  gbp: "Gbp",
  eur: "Eur",
  usd: "Usd",
};

type UiGroup = "whlsl" | "retail" | "amazon";

function uiGroupFromApi(apiGroup: string): UiGroup {
  const g = sellingGroupFromApi(apiGroup);
  if (g === "whlsl" || g === "retail" || g === "amazon") return g;
  return g as UiGroup;
}

function prefixForGroup(group: UiGroup): string {
  if (group === "whlsl") return "whlsl";
  if (group === "retail") return "retail";
  return "amazon";
}

export function priceField(group: string, currency: SellingCurrency): FieldPath<StockItem> {
  const p = prefixForGroup(uiGroupFromApi(group));
  return `${p}${CUR_CAP[currency]}Price` as FieldPath<StockItem>;
}

export function perField(group: string, currency: SellingCurrency): FieldPath<StockItem> {
  const p = prefixForGroup(uiGroupFromApi(group));
  return `${p}${CUR_CAP[currency]}Per` as FieldPath<StockItem>;
}

export function pctField(group: string, currency: SellingCurrency): FieldPath<StockItem> {
  const p = prefixForGroup(uiGroupFromApi(group));
  return `${p}${CUR_CAP[currency]}Pct` as FieldPath<StockItem>;
}

export function sellIdField(group: string, currency: SellingCurrency): FieldPath<StockItem> {
  const p = prefixForGroup(uiGroupFromApi(group));
  return `${p}${CUR_CAP[currency]}SellId` as FieldPath<StockItem>;
}

export function categoryIdField(group: string, currency: SellingCurrency): FieldPath<StockItem> {
  const p = prefixForGroup(uiGroupFromApi(group));
  return `${p}${CUR_CAP[currency]}PriceCategoryId` as FieldPath<StockItem>;
}

export function parseSellingPricesFromApi(raw: unknown): SellingPricesByGroup {
  if (!raw || typeof raw !== "object") return {};
  return raw as SellingPricesByGroup;
}

export function mapSellingPricesToForm(
  selling: SellingPricesByGroup,
  categoryLookup?: Record<string, Record<string, { id: number }>>,
): Partial<StockItem> {
  const patch: Partial<StockItem> = {};
  const groups = new Set([...DEFAULT_SELLING_GROUPS, ...Object.keys(selling)]);

  for (const apiGroup of groups) {
    const uiGroup = uiGroupFromApi(apiGroup);
    const currencies = selling[apiGroup];
    if (!currencies || typeof currencies !== "object") continue;

    for (const [currency, cell] of Object.entries(currencies)) {
      const cur = currency.toLowerCase() as SellingCurrency;
      if (!["gbp", "eur", "usd"].includes(cur)) continue;
      const data = cell as Record<string, unknown>;
      const price = num(data.price);
      const per = num(data.per, 1);
      const id = idNum(data.id);
      let priceCategoryId = idNum(data.price_category_id);

      if (!priceCategoryId && categoryLookup?.[apiGroup]?.[cur]) {
        priceCategoryId = categoryLookup[apiGroup][cur].id;
      }

      (patch as Record<string, unknown>)[priceField(uiGroup, cur)] = price;
      (patch as Record<string, unknown>)[perField(uiGroup, cur)] = per;
      if (id != null) (patch as Record<string, unknown>)[sellIdField(uiGroup, cur)] = id;
      if (priceCategoryId != null) {
        (patch as Record<string, unknown>)[categoryIdField(uiGroup, cur)] = priceCategoryId;
      }
    }
  }

  const gbpWhlsl = selling.whlsl?.gbp;
  if (gbpWhlsl && typeof gbpWhlsl === "object") {
    const p = num((gbpWhlsl as Record<string, unknown>).price);
    patch.gbpWhlsl = p;
    patch.whlslGbpPrice = p;
  }

  return patch;
}

export function formToSaveSellPricesPayload(
  stockId: string,
  values: StockItem,
  groups: string[] = ["whlsl", "retail", "amazon"],
): Record<string, unknown> {
  const selling_prices: Record<string, Record<string, Record<string, unknown>>> = {};

  for (const uiGroup of groups) {
    const apiGroup = sellingGroupToApi(uiGroup);
    const currencies: Record<string, Record<string, unknown>> = {};

    for (const cur of ["gbp", "eur", "usd"] as const) {
      const row = values as unknown as Record<string, unknown>;
      const priceCategoryId = row[categoryIdField(uiGroup, cur)] as number | undefined;
      if (!priceCategoryId) continue;

      const price = num(row[priceField(uiGroup, cur)]);
      const per = num(row[perField(uiGroup, cur)], 1);
      const id = row[sellIdField(uiGroup, cur)] as number | undefined;

      const entry: Record<string, unknown> = {
        price_category_id: priceCategoryId,
        price,
        per,
      };
      if (id != null) entry.id = id;
      currencies[cur] = entry;
    }

    if (Object.keys(currencies).length) selling_prices[apiGroup] = currencies;
  }

  return { stock_id: stockId, selling_prices };
}
