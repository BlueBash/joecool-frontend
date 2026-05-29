import type { FieldPath } from "react-hook-form";
import type { StockFormValues } from "../../stock-form-schema";

/** Human-readable formula for each cost-tab calculated field (matches `computeCostPrices`). */
export const COST_CALC_FORMULAS: Partial<Record<FieldPath<StockFormValues>, string>> = {
  firstCost: "Facty Cost ÷ Per",
  factyInvd: "First Cost + Amount",
  agentBase: "Facty Invd + New Amount",
  agentAmount: "Agent Base × Agent Com% ÷ 100",
  agentCost: "Agent Base + Agent Amount",
  agentPackAmount: "Agent Cost × Agent Pack% ÷ 100",
  fobBase: "Agent Cost + Agent Pack Amount",
  qualityAmount: "FOB Base × Quality% ÷ 100",
  probsAmount: "FOB Base × Probs% ÷ 100",
  chargesAmount: "FOB Base × Charges% ÷ 100",
  fobChargesAmount: "FOB Base × FOB Charges% ÷ 100",
  itemOb: "FOB Base + quality + probs + charges",
  jcObCost: "JC Packing Amount + Item OB",
  freightAmount: "JC OB Cost × Freight% ÷ 100",
  arriveUk: "JC OB Cost + Freight Amount",
  calcFobX: "Item OB ÷ First Cost",
  ukDutyAmount: "(Up) GBP × UK Duty % ÷ 100",
  clearanceAmount: "Duty Paid × Clearance % ÷ 100",
  deliveryAmount: "UK Landed × Delivery % ÷ 100",
  assembled: "Delivered + Assembly Amount",
  calcReady: "Assembled + Display Amount",
};

export function costCalcFormula(
  resultName: FieldPath<StockFormValues>,
  override?: string,
): string | undefined {
  return override ?? COST_CALC_FORMULAS[resultName];
}
