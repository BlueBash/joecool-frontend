export type SellingCurrencyCode = "gbp" | "eur" | "usd";

export type CurrencyExchangeRates = Partial<Record<SellingCurrencyCode, number>>;

/** %Age markup vs rounded-up ready cost (legacy SellingPricesTab). */
export function computeSellingAge(
  price: number,
  per: number,
  exchangeRate: number,
  storedReadyPrice: number,
): number {
  if (!storedReadyPrice || storedReadyPrice <= 0) return 0;
  const units = per || 1;
  const rate = exchangeRate || 1;
  const unitPriceGbp = price / units / rate;
  return Number((((unitPriceGbp - storedReadyPrice) / storedReadyPrice) * 100).toFixed(2));
}

export function exchangeRateForCurrency(
  code: SellingCurrencyCode,
  row: Record<string, unknown>,
): number {
  const key =
    code === "gbp"
      ? "exchange_rate_gbp"
      : code === "eur"
        ? "exchange_rate_eur"
        : "exchange_rate_usd";
  const v = row[key];
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
