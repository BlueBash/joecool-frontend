import type { StockFormValues } from "../stock-form-schema";
import { dimensionSlotKey } from "./dimension-sizes";
import { fittingSizeSlotKey } from "./fitting-sizes";

export type StockMessageAudience = "retail" | "wholesale";

export type StockSettingsMessageKind = "fitting" | "dimension";

export interface StockSettingsMessageResult {
  retail: string;
  wholesale: string;
}

function orderedSlotValues(
  record: Record<string, string> | undefined,
  slotCount: number,
  keyForIndex: (index: number) => string,
): (string | number)[] {
  const out: (string | number)[] = [];
  for (let i = 1; i <= slotCount; i++) {
    const raw = record?.[keyForIndex(i)]?.trim() ?? "";
    if (!raw) {
      out.push("");
      continue;
    }
    const n = Number(raw);
    out.push(Number.isFinite(n) ? n : raw);
  }
  return out;
}

function requireId(value: number | undefined, label: string): number | null {
  if (value == null || !Number.isFinite(value)) return null;
  return value;
}

export function validateFittingMessageForm(values: StockFormValues): string | null {
  if (!requireId(values.categoryId, "Category")) {
    return "Select a category on the Makeup tab before viewing fitting messages.";
  }
  if (!requireId(values.fittingSpecId, "Fitting spec")) {
    return "Select a fitting spec first.";
  }
  if (!requireId(values.fittingPackAssortId, "Fitting pack assort")) {
    return "Select a fitting pack assortment first.";
  }
  if (!requireId(values.fittingMeasureId, "Fitting measure")) {
    return "Select a fitting measure first.";
  }
  return null;
}

export function validateDimensionMessageForm(values: StockFormValues): string | null {
  if (!requireId(values.categoryId, "Category")) {
    return "Select a category on the Makeup tab before viewing dimension messages.";
  }
  if (!requireId(values.dimensionSpecId, "Dimension spec")) {
    return "Select a dimension spec first.";
  }
  if (!requireId(values.dimensionMeasureId, "Dimension measure")) {
    return "Select a dimension measure first.";
  }
  return null;
}

export function buildFittingMessagePayload(
  values: StockFormValues,
  audience: StockMessageAudience,
): Record<string, unknown> {
  const slotCount = values.fittingSpecSlotCount ?? 0;
  return {
    audience,
    category_id: values.categoryId,
    fitting_size_spec_id: values.fittingSpecId,
    fitting_size_pack_assortment_id: values.fittingPackAssortId,
    fitting_size_measure_id: values.fittingMeasureId,
    sizes: orderedSlotValues(values.fittingNoOfSizes, slotCount, fittingSizeSlotKey),
  };
}

export function buildDimensionMessagePayload(
  values: StockFormValues,
  audience: StockMessageAudience,
): Record<string, unknown> {
  const slotCount = values.dimensionSpecSlotCount ?? 0;
  return {
    audience,
    category_id: values.categoryId,
    dimension_spec_id: values.dimensionSpecId,
    dimension_measure_id: values.dimensionMeasureId,
    dimensions: orderedSlotValues(values.dimensionNoOfDimension, slotCount, dimensionSlotKey),
  };
}
