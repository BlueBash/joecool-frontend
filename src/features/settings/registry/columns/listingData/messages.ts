import type { ListingColumn } from "./shared";
import { col } from "./shared";

export const messagesListingData: Record<string, ListingColumn[]> = {
  message_purpose: [
    col("balance_invoice", "Balance invoice", { type: "boolean" }),
    col("balance_remind", "Balance remind", { type: "boolean" }),
  ],
  general_message: [
    col("language.name", "Language"),
    col("message_purpose.name", "Purpose"),
  ],
  shipping_message: [
    col("language.name", "Language"),
    col("document.name", "Document"),
    col("ship_method.name", "Ship method"),
  ],
  payment_term_message: [
    col("language.name", "Language"),
    col("document.name", "Document"),
    col("pay_term.name", "Pay term"),
  ],
  payment_method_message: [
    col("language.name", "Language"),
    col("document.name", "Document"),
    col("payment_method.name", "Payment method"),
  ],
  bank_message: [
    col("language.name", "Language"),
    col("bank_account.name", "Bank account"),
  ],
};
