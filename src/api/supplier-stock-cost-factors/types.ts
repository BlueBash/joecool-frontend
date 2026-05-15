import type { JsonApiRow } from "@/api/_client";

export type SuppStockCostFactorRow = JsonApiRow;

export interface SuppStockCostFactorWritePayload {
  agentcommpct?: number;
  agentpackingcharge?: number;
  agentpackingchargepct?: number;
  chargespct?: number;
  fobadminchargespct?: number;
  freighttoukpct?: number;
  probspct?: number;
  qualitypct?: number;
  ukclearpct?: number;
  ukdeliverypct?: number;
  ukdutypct?: number;
  currency_id?: number;
}
