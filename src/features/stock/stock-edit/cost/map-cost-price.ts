import type { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import type { StockItem } from "@/lib/types";
import type { StockFormValues } from "../../stock-form-schema";

function num(v: unknown, fallback = 0): number {
  if (v == null || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function idNum(v: unknown): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function str(v: unknown): string {
  return v == null ? "" : String(v);
}

/** Maps API `cost_price` object onto flat stock form fields. */
export function mapCostPriceToForm(cost: Record<string, unknown>): Partial<StockItem> {
  return {
    costPriceId: idNum(cost.id),
    factCurrencyId: idNum(cost.fact_currency),
    readyCurrencyId: idNum(cost.ready_currency),
    factyCost: num(cost.fact_price),
    factyPer: num(cost.fact_per, 1),
    factyPack: str(cost.facty_pack),
    factyAmount: num(cost.facty_amount),
    packagingName: str(cost.fact_card_code),
    packagingNewAmount: num(cost.fact_card_cost),
    agentCommPct: num(cost.fob_comm),
    agentPackPct: num(cost.agent_pack_percentage),
    agentPackAmount: num(cost.agent_charge),
    qualityPct: num(cost.fob_quality),
    probsPct: num(cost.fob_problems),
    chargesPct: num(cost.fob_charge),
    fobChargesPct: num(cost.fob_admin_charge),
    jcPackingId: idNum(cost.jc_packing_code),
    jcPackingAmount: num(cost.jc_packing_cost),
    freightPct: num(cost.freight),
    currentRate: num(cost.fact_exch_rate),
    lastUsedXRate: num(cost.fact_exch_rate),
    ukDutyPct: num(cost.uk_duty),
    clearancePct: num(cost.uk_clearance),
    deliveryPct: num(cost.uk_delivery),
    assemblySettingId: idNum(cost.assembly_code),
    assemblyAmount: num(cost.assembly_cost),
    costDisplaySettingId: idNum(cost.display_code),
    displayAmount: num(cost.display_cost),
    per: num(cost.ready_per, 1),
    supplierCostFactorId: idNum(cost.supp_stock_cost_factor_id),
  };
}

/** PATCH `/stock/cost_prices/:id` body from form values. */
export function formToCostPricePatch(values: StockItem): Record<string, unknown> {
  return {
    fact_price: values.factyCost,
    fact_per: values.factyPer,
    freight: values.freightPct,
    uk_duty: values.ukDutyPct,
    agent_charge: values.agentPackAmount,
    fob_quality: values.qualityPct,
    fob_problems: values.probsPct,
    jc_packing_code: values.jcPackingId,
    jc_packing_cost: values.jcPackingAmount,
    assembly_cost: values.assemblyAmount,
    assembly_code: values.assemblySettingId,
    display_cost: values.displayAmount,
    display_code: values.costDisplaySettingId,
    ready_per: values.per,
    fact_exch_rate: values.currentRate,
    fob_comm: values.agentCommPct,
    fob_charge: values.chargesPct,
    fob_admin_charge: values.fobChargesPct,
    uk_clearance: values.clearancePct,
    uk_delivery: values.deliveryPct,
    facty_pack: values.factyPack,
    facty_amount: values.factyAmount,
    fact_card_code: values.packagingName,
    fact_card_cost: values.packagingNewAmount,
    agent_pack_percentage: values.agentPackPct,
    fact_currency: values.factCurrencyId,
    ready_currency: values.readyCurrencyId,
  };
}

/** Maps supplier stock cost factor defaults onto cost percentage fields. */
export function mapSupplierCostFactorToForm(
  factor: Record<string, unknown>,
): Partial<StockItem> {
  return {
    agentCommPct: num(factor.agentcommpct ?? factor.agent_comm_pct),
    agentPackPct: num(factor.agentpackingchargepct ?? factor.agent_pack_percentage),
    chargesPct: num(factor.chargespct ?? factor.charges_pct),
    fobChargesPct: num(factor.fobadminchargespct ?? factor.fob_admin_charge),
    freightPct: num(factor.freighttoukpct ?? factor.freight),
    probsPct: num(factor.probspct ?? factor.problems_pct),
    qualityPct: num(factor.qualitypct ?? factor.quality_pct),
    ukDutyPct: num(factor.ukdutypct ?? factor.uk_duty),
    clearancePct: num(factor.ukclearpct ?? factor.uk_clearance),
    deliveryPct: num(factor.ukdeliverypct ?? factor.uk_delivery),
    factCurrencyId: idNum(factor.currency_id),
    supplierCostFactorId: idNum(factor.id),
  };
}

const SUPPLIER_COST_DEFAULT_KEYS = [
  "agentcommpct",
  "agent_comm_pct",
  "agentpackingchargepct",
  "chargespct",
  "fobadminchargespct",
  "freighttoukpct",
  "probspct",
  "qualitypct",
  "ukdutypct",
  "ukclearpct",
  "ukdeliverypct",
  "currency_id",
] as const;

/** True when the factor object includes values from the supplier address “Cost Factor” tab. */
export function hasSupplierCostFactorData(
  factor: Record<string, unknown> | null | undefined,
): boolean {
  if (!factor || typeof factor !== "object") return false;
  return SUPPLIER_COST_DEFAULT_KEYS.some((k) => factor[k] != null && factor[k] !== "");
}

function costFieldIsEmpty(value: unknown): boolean {
  return value == null || value === "" || (typeof value === "number" && value === 0);
}

/** Applies supplier address cost-factor defaults onto the stock cost tab. */
export function applySupplierCostFactorDefaults(
  setValue: UseFormSetValue<StockFormValues>,
  getValues: UseFormGetValues<StockFormValues>,
  factor: Record<string, unknown>,
  options: { force?: boolean; supplierFobX?: number } = {},
): void {
  const { force = false, supplierFobX } = options;
  const patch = mapSupplierCostFactorToForm(factor);
  const hasSavedCost = getValues("costPriceId") != null;

  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) continue;
    const key = k as keyof StockFormValues;
    if (!force && hasSavedCost && !costFieldIsEmpty(getValues(key))) continue;
    setValue(key, v as never, { shouldDirty: false });
  }

  if (supplierFobX != null && Number.isFinite(supplierFobX)) {
    if (force || !hasSavedCost || costFieldIsEmpty(getValues("supplierFobX"))) {
      setValue("supplierFobX", supplierFobX, { shouldDirty: false });
    }
  }
}
