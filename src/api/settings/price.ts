import { mkSettingsResource } from "./resource";

export const settingsPriceCategories = mkSettingsResource(
  ["settings", "price-categories"],
  "/stock/price_categories",
  "price_category",
  { include: "currency" },
);

export const settingsCurrencies = mkSettingsResource(
  ["settings", "currencies"],
  "/currencies",
  "currency",
);
