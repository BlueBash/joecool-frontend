import type { ReferenceOption } from "@/lib/reference";

/** Max fitting slots supported by legacy import (`size_1` … `size_12`). */
export const MAX_FITTING_SIZE_SLOTS = 12;

/** Reads `values` from a fitting size spec catalog row. */
export function fittingSpecValuesCount(source: unknown): number {
  const n = Number(source);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(Math.floor(n), MAX_FITTING_SIZE_SLOTS);
}

export function fittingSpecValuesCountFromOption(opt?: ReferenceOption): number {
  if (!opt) return 0;
  return fittingSpecValuesCount(opt.values);
}

/** Highest `size_N` key present in API `no_of_sizes`. */
export function fittingSlotCountFromNoOfSizes(noOfSizes: Record<string, unknown> | undefined): number {
  if (!noOfSizes) return 0;
  let max = 0;
  for (const key of Object.keys(noOfSizes)) {
    const m = /^size_(\d+)$/.exec(key);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max;
}

export function fittingSizeSlotKey(index: number): string {
  return `size_${index}`;
}

/** Keeps `size_1`…`size_count` keys; drops extras when spec changes. */
export function resizeFittingNoOfSizes(
  current: Record<string, string> | undefined,
  count: number,
): Record<string, string> {
  const next: Record<string, string> = {};
  for (let i = 1; i <= count; i++) {
    const key = fittingSizeSlotKey(i);
    next[key] = current?.[key] ?? "";
  }
  return next;
}

export function parseFittingNoOfSizes(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!/^size_\d+$/.test(key) || value == null || value === "") continue;
    out[key] = String(value);
  }
  return out;
}

export function buildFittingNoOfSizesPayload(
  slotCount: number | undefined,
  sizes: Record<string, string> | undefined,
  ringSizeId?: number,
): Record<string, string> | undefined {
  const count = slotCount ?? 0;
  const out: Record<string, string> = {};

  if (count > 0) {
    for (let i = 1; i <= count; i++) {
      const key = fittingSizeSlotKey(i);
      const raw = sizes?.[key]?.trim() ?? "";
      if (raw) out[key] = raw;
    }
    return Object.keys(out).length ? out : undefined;
  }

  if (ringSizeId != null) return { size_1: String(ringSizeId) };
  return undefined;
}
