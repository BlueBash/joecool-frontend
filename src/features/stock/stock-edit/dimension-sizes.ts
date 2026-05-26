import type { ReferenceOption } from "@/lib/reference";

/** Max dimension slots supported by legacy import (`dimension_1` … `dimension_12`). */
export const MAX_DIMENSION_SLOTS = 12;

/** Reads `values` from a dimension spec catalog row. */
export function dimensionSpecValuesCount(source: unknown): number {
  const n = Number(source);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(Math.floor(n), MAX_DIMENSION_SLOTS);
}

export function dimensionSpecValuesCountFromOption(opt?: ReferenceOption): number {
  if (!opt) return 0;
  return dimensionSpecValuesCount(opt.values);
}

/** Highest `dimension_N` key present in API `no_of_dimension`. */
export function dimensionSlotCountFromNoOfDimension(
  noOfDimension: Record<string, unknown> | undefined,
): number {
  if (!noOfDimension) return 0;
  let max = 0;
  for (const key of Object.keys(noOfDimension)) {
    const m = /^dimension_(\d+)$/.exec(key);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max;
}

export function dimensionSlotKey(index: number): string {
  return `dimension_${index}`;
}

/** Keeps `dimension_1`…`dimension_count` keys; drops extras when spec changes. */
export function resizeDimensionNoOfDimension(
  current: Record<string, string> | undefined,
  count: number,
): Record<string, string> {
  const next: Record<string, string> = {};
  for (let i = 1; i <= count; i++) {
    const key = dimensionSlotKey(i);
    next[key] = current?.[key] ?? "";
  }
  return next;
}

export function parseNoOfDimension(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!/^dimension_\d+$/.test(key) || value == null || value === "") continue;
    out[key] = String(value);
  }
  return out;
}

export function buildNoOfDimensionPayload(
  slotCount: number | undefined,
  dimensions: Record<string, string> | undefined,
): Record<string, string> | undefined {
  const count = slotCount ?? 0;
  if (count <= 0) return undefined;

  const out: Record<string, string> = {};
  for (let i = 1; i <= count; i++) {
    const key = dimensionSlotKey(i);
    const raw = dimensions?.[key]?.trim() ?? "";
    if (raw) out[key] = raw;
  }
  return Object.keys(out).length ? out : undefined;
}
