import type { ListingColumn } from "./shared";
import { col } from "./shared";

export const addressListingData: Record<string, ListingColumn[]> = {
  address_category: [],
  payment_method: [],
  ship_from: [],
  special_customer: [],
  ups_service: [],
  pay_term: [
    col("days_needed", "Days needed", { type: "boolean" }),
    col("prepay_needed", "Prepay needed", { type: "boolean" }),
  ],
  ship_method: [col("ups_service.name", "UPS service")],
  contact_dept: [col("list_order", "List order")],
  contact_role: [col("list_order", "List order")],
  agent: [],
  country: [
    col("iso_number", "ISO number"),
    col("iso_1", "ISO 1"),
    col("iso_2", "ISO 2"),
  ],
  account_manager: [
    col("email", "Email"),
    col("telephone", "Telephone"),
    col("mobile", "Mobile"),
    col("monitor", "Monitor", { type: "boolean" }),
  ],
};
