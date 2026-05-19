import type {
  FieldDef,
  FormErrors,
  FormPayload,
  FormValues,
  SettingItemLike,
} from "./types";

/** Read a value from a row using a dot-separated path. */
export function readFieldValue(row: SettingItemLike | undefined, path: string): unknown {
  if (!row) return undefined;
  const parts = path.split(".");
  let cur: unknown = row;
  for (const part of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
}

function stringifyFieldValue(raw: unknown): string {
  return typeof raw === "string" ? raw : raw == null ? "" : String(raw);
}

export interface ToFormValuesOptions {
  mapFromRow?: (row: SettingItemLike) => FormValues;
}

/** Build initial form values from a row (or empty strings for create). */
export function toFormValues(
  fields: FieldDef[],
  row?: SettingItemLike,
  opts?: ToFormValuesOptions,
): FormValues {
  if (row && opts?.mapFromRow) return opts.mapFromRow(row);

  const out: FormValues = {};
  for (const f of fields) {
    const raw = f.readPath ? readFieldValue(row, f.readPath) : row?.[f.name];
    out[f.name] = stringifyFieldValue(raw);
  }
  return out;
}

/** Run client-side validation. Returns a map of field → message. */
export function validateFormValues(fields: FieldDef[], values: FormValues): FormErrors {
  const errors: FormErrors = {};
  for (const f of fields) {
    const v = values[f.name]?.trim() ?? "";
    if (f.required && v.length === 0) {
      errors[f.name] = `${f.label} is required`;
      continue;
    }
    if (f.maxLength && v.length > f.maxLength) {
      errors[f.name] = `${f.label} must be ${f.maxLength} characters or fewer`;
    }
  }
  return errors;
}

/** Convert form values to a wire payload (empty optional → null). */
export function toFormPayload(fields: FieldDef[], values: FormValues): FormPayload {
  const out: FormPayload = {};
  for (const f of fields) {
    const v = values[f.name]?.trim() ?? "";
    if (f.required) {
      out[f.name] = v;
    } else {
      out[f.name] = v === "" ? null : v;
    }
  }
  return out;
}

/** True when any error message is set. */
export function hasErrors(errors: FormErrors): boolean {
  for (const v of Object.values(errors)) {
    if (v) return true;
  }
  return false;
}
