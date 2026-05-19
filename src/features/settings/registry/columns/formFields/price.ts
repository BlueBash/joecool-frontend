import type { FieldDef } from "../../../types";
import { codeNameFields } from "./shared";

export const priceFormFields = {
  price_category: [
    ...codeNameFields(),
    {
      name: "kind",
      label: "Kind",
      type: "select",
      required: true,
      options: [
        { value: "sell", label: "Sell" },
        { value: "cost", label: "Cost" },
      ],
    },
    {
      name: "cap_abbr",
      label: "Cap abbr",
      type: "text",
      required: true,
      maxLength: 40,
    },
    {
      name: "currency_id",
      label: "Currency",
      type: "reference",
      referenceKlass: "Currency",
      placeholder: "Search currencies…",
    },
  ] satisfies FieldDef[],

  currency: [
    ...codeNameFields(),
    { name: "abbr", label: "Abbreviation", type: "text", required: true, maxLength: 20 },
    { name: "symbol", label: "Symbol", type: "text", required: true, maxLength: 10 },
    { name: "exchange_rate_gbp", label: "Exchange rate (GBP)", type: "number", required: true },
    { name: "exchange_rate_eur", label: "Exchange rate (EUR)", type: "number", required: true },
    { name: "exchange_rate_usd", label: "Exchange rate (USD)", type: "number", required: true },
    { name: "exchange_rate_buy", label: "Exchange rate (buy)", type: "number", required: true },
    { name: "prev_rate_gbp", label: "Previous rate (GBP)", type: "number" },
    { name: "prev_rate_usd", label: "Previous rate (USD)", type: "number" },
    { name: "prev_rate_eur", label: "Previous rate (EUR)", type: "number" },
    { name: "prev_rate_buy", label: "Previous rate (buy)", type: "number" },
    { name: "cost_adjust", label: "Cost adjust", type: "number" },
    { name: "sell_adjust", label: "Sell adjust", type: "number" },
  ] satisfies FieldDef[],
} as const;
