import type { ReferenceOption } from "@/lib/reference";

/** Maps catalog row fields to primary text and optional badge in pickers. */
export interface ReferenceDisplayConfig {
  /** Primary text field (default `name`). */
  labelField?: string;
  /**
   * Badge field shown before the label (default `code`).
   * Set to `null` to hide the badge entirely.
   */
  badgeField?: string | null;
  /** When true, show the badge even if it matches the primary label (e.g. code-only rows). */
  showBadgeWhenSameAsLabel?: boolean;
}

export const DEFAULT_REFERENCE_DISPLAY: ReferenceDisplayConfig = {
  labelField: "name",
  badgeField: "code",
};

/** Stock settings ranges: always show code beside name in pickers. */
export const STOCK_RANGE_REFERENCE_DISPLAY: ReferenceDisplayConfig = {
  labelField: "name",
  badgeField: "code",
  showBadgeWhenSameAsLabel: true,
};

/** Ring sizes: US primary, UK badge (rows have no `name`). */
export const RING_SIZE_REFERENCE_DISPLAY: ReferenceDisplayConfig = {
  labelField: "us_size",
  badgeField: "uk_size",
};

/** Packaging stock rows: wholesale title + code. */
export const STOCK_PACKAGING_REFERENCE_DISPLAY: ReferenceDisplayConfig = {
  labelField: "whlsl_title",
  badgeField: "code",
};

function resolveBadgeField(config?: ReferenceDisplayConfig): string | null | undefined {
  if (config && "badgeField" in config && config.badgeField === null) return null;
  return config?.badgeField ?? DEFAULT_REFERENCE_DISPLAY.badgeField;
}

export function getReferenceFieldValue(
  opt: ReferenceOption,
  field: string | undefined,
): string | undefined {
  if (!field) return undefined;
  const raw = opt[field];
  if (raw == null || raw === "") return undefined;
  return String(raw);
}

export function referenceDisplayText(
  opt: ReferenceOption,
  config?: ReferenceDisplayConfig,
): string {
  const labelField = config?.labelField ?? DEFAULT_REFERENCE_DISPLAY.labelField;
  return getReferenceFieldValue(opt, labelField) ?? String(opt.id);
}

export function referenceBadgeText(
  opt: ReferenceOption,
  config?: ReferenceDisplayConfig,
): string | undefined {
  const badgeField = resolveBadgeField(config);
  if (!badgeField) return undefined;
  const badge = getReferenceFieldValue(opt, badgeField);
  if (!badge) return undefined;
  const label = referenceDisplayText(opt, config);
  if (badge === label && !config?.showBadgeWhenSameAsLabel) return undefined;
  return badge;
}

/** Plain-text label for sorting, filtering, and input fallback. */
export function referenceLabel(opt: ReferenceOption, config?: ReferenceDisplayConfig): string {
  const label = referenceDisplayText(opt, config);
  const badge = referenceBadgeText(opt, config);
  if (badge) return `${badge} — ${label}`;
  return label;
}

/** Lowercase string used for client-side search matching. */
export function referenceSearchText(opt: ReferenceOption, config?: ReferenceDisplayConfig): string {
  const parts = [referenceBadgeText(opt, config), referenceDisplayText(opt, config)].filter(
    Boolean,
  ) as string[];
  return parts.join(" ").toLowerCase();
}

/** True when a stored label matches a catalog row (label, code, or name). */
export function referenceOptionMatchesLabel(
  opt: ReferenceOption,
  text: string,
  config?: ReferenceDisplayConfig,
): boolean {
  const t = text.trim();
  if (!t) return false;
  if (referenceLabel(opt, config) === t) return true;
  if (referenceDisplayText(opt, config) === t) return true;
  const badge = referenceBadgeText(opt, config);
  if (badge === t) return true;
  const code = opt.code != null ? String(opt.code).trim() : "";
  const name = opt.name != null ? String(opt.name).trim() : "";
  return code === t || name === t;
}
