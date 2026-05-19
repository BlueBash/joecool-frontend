import type { ListingColumn } from "./shared";
import { col } from "./shared";

export const priceListingData: Record<string, ListingColumn[]> = {
  price_category: [
    col("kind", "Kind"),
    col("cap_abbr", "Cap abbr"),
    col("currency.code", "Currency"),
  ],
  currency: [col("symbol", "Symbol"), col("exchange_rate_gbp", "Exchange rate (GBP)")],
};
