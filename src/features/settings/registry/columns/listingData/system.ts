import type { ListingColumn } from "./shared";
import { col } from "./shared";

export const systemListingData: Record<string, ListingColumn[]> = {
  language: [],
  label_source: [],
  vat_kind: [],
  map_accountant: [],
  profit_loss_section: [],
  document: [],

  vat_rate_code: [col("rate", "Rate")],
  cash_flow_section: [col("polarity", "Polarity")],
  venue: [col("order_type", "Order type")],
  shipping_charge: [col("amount_needed", "Amount needed", { type: "boolean" })],
  area: [col("iso_code", "ISO code"), col("uk_for_hmrc", "UK for HMRC", { type: "boolean" })],

  warehouse: [
    col("address_line1", "Address"),
    col("master", "Master", { type: "boolean" }),
  ],

  profit_centre: [col("country.name", "Country")],

  bank_account: [col("sort_code", "Sort code")],

  cost_code: [
    col("kind", "Kind"),
    col("map_accountant.name", "Map accountant"),
    col("cash_flow_section.name", "Cash flow"),
    col("profit_loss_section.name", "P&L section"),
    col("vat_box", "VAT box"),
    col("report", "Report"),
    col("vat_intra_stat", "VAT intra stat", { type: "boolean" }),
  ],

  order_kind: [
    col("flags.avail_calc", "Avail calc", { type: "boolean" }),
    col("flags.spare_calc", "Spare calc", { type: "boolean" }),
    col("flags.likely_confirmed", "Likely confirmed", { type: "boolean" }),
    col("flags.allow_allocation", "Allow allocation", { type: "boolean" }),
  ],

  invoice_environment: [
    col("title", "Title"),
    col("vat_reg_needed", "VAT reg", { type: "boolean" }),
    col("finances", "Finances", { type: "boolean" }),
    col("stock", "Stock", { type: "boolean" }),
    col("shop", "Shop", { type: "boolean" }),
    col("currency.name", "Currency"),
    col("bank_account.name", "Bank account"),
    col("vat_kind.name", "VAT kind"),
    col("vat_rate_code.name", "VAT rate"),
    col("main_code.name", "Main code"),
    col("buy_code.name", "Buy code"),
    col("control_code.name", "Control code"),
    col("post_code.name", "Post code"),
    col("discount_given_code.name", "Discount given"),
    col("discount_taken_code.name", "Discount taken"),
  ],
};
