import type { ReferenceOption } from "@/lib/reference";
import {
  referenceDisplayText,
  type ReferenceDisplayConfig,
} from "@/lib/reference-display";

export type TitleCompositionSlot = {
  key: string;
  name: string;
  checked: boolean;
};

/** Name-only label for title composition (never code or badge text). */
export function referenceNameForTitle(
  opt: ReferenceOption,
  displayConfig?: ReferenceDisplayConfig,
): string {
  const name = String(opt.name ?? "").trim();
  if (name) return name;
  return referenceDisplayText(opt, displayConfig).trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Whether `name` appears as a space-delimited segment in `title`. */
export function titleContainsName(title: string, name: string): boolean {
  const n = name.trim();
  if (!n) return false;
  const t = title.trim();
  if (!t) return false;
  return new RegExp(`(^|\\s)${escapeRegExp(n)}(?=\\s|$)`).test(t);
}

/** Parses settings `show` when present; `undefined` if the field was not set. */
export function settingShowInTitle(showFromSetting: unknown): boolean | undefined {
  if (showFromSetting === undefined || showFromSetting === null) return undefined;
  if (typeof showFromSetting === "boolean") return showFromSetting;
  if (typeof showFromSetting === "number") return showFromSetting !== 0;
  const s = String(showFromSetting).trim().toLowerCase();
  if (s === "") return undefined;
  return s === "true" || s === "1" || s === "yes";
}

export function referenceShowInTitle(opt?: ReferenceOption): boolean {
  if (!opt) return false;
  return settingShowInTitle(opt.show) ?? false;
}

export function removeNameFromTitle(title: string, name: string): string {
  const n = name.trim();
  if (!n) return title.trim();
  const escaped = escapeRegExp(n);
  return title
    .trim()
    .replace(new RegExp(`(^|\\s)${escaped}(?=\\s|$)`, "g"), "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function appendNameToTitle(title: string, name: string): string {
  const n = name.trim();
  if (!n) return title.trim();
  const t = title.trim();
  if (!t) return n;
  if (titleContainsName(t, n)) return t;
  return `${t} ${n}`;
}

/** Infer initial checkbox state when loading a stock row. */
export function inferShowInTitleFromTitles(
  name: string,
  generatedTitle: string,
  showFromSetting?: unknown,
  /** When set (new stock), also treat a match in edited title as checked. */
  editedTitle?: string,
): boolean {
  const part = titlePartFromStoredLabel(name);
  if (!part) return false;
  const fromSetting = settingShowInTitle(showFromSetting);
  if (fromSetting !== undefined) return fromSetting;
  if (editedTitle != null && titleContainsName(editedTitle, part)) return true;
  return titleContainsName(generatedTitle, part);
}

export type ComposeTitlesOptions = {
  /** When false, only `generatedTitle` is updated (persisted stock). */
  syncEditedTitle?: boolean;
};

export function composeTitles(
  editedTitle: string,
  generatedTitle: string,
  slots: TitleCompositionSlot[],
  previousNames: Record<string, string>,
  options?: ComposeTitlesOptions,
): { editedTitle: string; generatedTitle: string; previousNames: Record<string, string> } {
  const syncEdited = options?.syncEditedTitle !== false;
  const editedBaseline = editedTitle.trim();
  let edited = editedBaseline;
  let generated = generatedTitle.trim();

  for (const prevName of new Set(Object.values(previousNames).filter(Boolean))) {
    if (syncEdited) edited = removeNameFromTitle(edited, prevName);
    generated = removeNameFromTitle(generated, prevName);
  }

  const nextPrev: Record<string, string> = {};
  for (const slot of slots) {
    if (!slot.checked || !slot.name.trim()) continue;
    const name = titlePartFromStoredLabel(slot.name);
    if (!name) continue;
    if (syncEdited) edited = appendNameToTitle(edited, name);
    generated = appendNameToTitle(generated, name);
    nextPrev[slot.key] = name;
  }

  return {
    editedTitle: syncEdited ? edited : editedBaseline,
    generatedTitle: generated,
    previousNames: nextPrev,
  };
}

/** Strip legacy `code — name` labels; titles use name segments only. */
export function titlePartFromStoredLabel(label: string): string {
  const trimmed = label.trim();
  if (!trimmed) return "";
  const sep = " — ";
  const idx = trimmed.indexOf(sep);
  if (idx >= 0) return trimmed.slice(idx + sep.length).trim();
  return trimmed;
}

export function buildTitleCompositionSlots(values: {
  category?: string;
  categoryShowInTitle?: boolean;
  color?: string;
  colorShowInTitle?: boolean;
  displayName?: string;
  displayShowInTitle?: boolean;
  materials?: { name?: string; showInTitle?: boolean; materialId?: number }[];
}): TitleCompositionSlot[] {
  const slots: TitleCompositionSlot[] = [
    {
      key: "category",
      name: titlePartFromStoredLabel(values.category ?? ""),
      checked: !!values.categoryShowInTitle,
    },
    {
      key: "color",
      name: titlePartFromStoredLabel(values.color ?? ""),
      checked: !!values.colorShowInTitle,
    },
    {
      key: "display",
      name: titlePartFromStoredLabel(values.displayName ?? ""),
      checked: !!values.displayShowInTitle,
    },
  ];

  for (const [index, row] of (values.materials ?? []).entries()) {
    const id = row.materialId;
    slots.push({
      key: id != null ? `material-${id}` : `material-row-${index}`,
      name: titlePartFromStoredLabel(row.name ?? ""),
      checked: !!row.showInTitle,
    });
  }

  return slots;
}
