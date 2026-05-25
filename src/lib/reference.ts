/** Shared option shape for settings / platform reference pickers. */
export interface ReferenceOption {
  id: number | string;
  name: string;
  code?: string;
  [key: string]: string | number | undefined;
}

export type { ReferenceDisplayConfig } from "@/lib/reference-display";
export {
  DEFAULT_REFERENCE_DISPLAY,
  referenceBadgeText,
  referenceDisplayText,
  referenceLabel,
  referenceSearchText,
} from "@/lib/reference-display";

export function parseReferenceId(value: string | number | null | undefined): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** UI flag code → API `flags` hash key (stock). */
export const STOCK_FLAG_API_KEYS: Record<string, string> = {
  "1": "flag_1_sell_in_joe",
  "3": "flag_3_sell_wholesale",
  "7": "flag_7_restock_wholesale",
  "8": "flag_8_supply_available",
  "9": "flag_9_restock_joe",
  "19": "flag_19_show_on_jc_wholesale_web",
  "20": "flag_20_special_offer",
  "21": "flag_21_include_in_best_sellers",
  "22": "flag_22_shop_best_sellers",
  "30": "flag_30_show_on_3rd_party_web",
  "41": "flag_41_nickel_free",
  "42": "flag_42_cadmium_free",
  "43": "flag_43_lead_free",
  "51": "flag_51_retail_message",
};

export function stockFlagCodesFromApi(flags: unknown): Record<string, boolean> {
  if (!flags || typeof flags !== "object") return {};
  const obj = flags as Record<string, boolean>;
  const out: Record<string, boolean> = {};
  for (const [code, apiKey] of Object.entries(STOCK_FLAG_API_KEYS)) {
    if (apiKey in obj) out[code] = !!obj[apiKey];
  }
  return out;
}

export function stockFlagsToApi(flagCodes: Record<string, boolean> | undefined): Record<string, boolean> | undefined {
  if (!flagCodes) return undefined;
  const out: Record<string, boolean> = {};
  for (const [code, on] of Object.entries(flagCodes)) {
    const key = STOCK_FLAG_API_KEYS[code];
    if (key) out[key] = on;
  }
  return Object.keys(out).length ? out : undefined;
}

/** Default flags applied on create (matches legacy defaults). */
export const STOCK_CREATE_DEFAULT_FLAGS: Record<string, boolean> = {
  "3": true,
  "7": true,
  "8": true,
  "19": true,
  "21": true,
  "41": true,
  "42": true,
  "43": true,
};
