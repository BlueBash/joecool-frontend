export type StockFlagOption = { code: string; label: string };

export const FLAG_CODES = [
  { code: "3", label: "Sell Wholesale" },
  { code: "9", label: "Restock JOE" },
  { code: "22", label: "Shop Best Sellers" },
  { code: "7", label: "Restock Wholesale" },
  { code: "30", label: "Show on 3rd Party web" },
  { code: "8", label: "Supply Available" },
  { code: "19", label: "Show on JC wholesale web" },
  { code: "51", label: "Retail Message" },
  { code: "1", label: "Sell In JOE" },
  { code: "21", label: "Include In Best Sellers" },
  { code: "20", label: "Special Offer" },
] satisfies StockFlagOption[];

export const MATERIAL_FLAGS = [
  { code: "41", label: "Nickel - Free" },
  { code: "42", label: "Cadmium - Free" },
  { code: "43", label: "Lead - Free" },
] satisfies StockFlagOption[];

export const STOCK_EDIT_TABS = [
  ["makeup", "Makeup"],
  ["images", "Images"],
  ["seo", "SEO"],
  ["supplier", "Supplier"],
  ["levels", "OrdersLevels"],
  ["cost", "CostPrices"],
  ["selling", "SellingPrices"],
  ["flags", "FlagsSpecials"],
  ["notes", "Notes"],
  ["details", "Details"],
  ["kits", "Kits"],
] as const satisfies readonly (readonly [string, string])[];
