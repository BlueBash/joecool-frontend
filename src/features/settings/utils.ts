import type {
  FieldDef,
  FormErrors,
  FormPayload,
  FormValues,
  SettingItemLike,
} from "./types";

/** Build initial form values from a row (or empty strings for create). */
export function toFormValues(fields: FieldDef[], row?: SettingItemLike): FormValues {
  const out: FormValues = {};
  for (const f of fields) {
    const raw = row?.[f.name];
    out[f.name] = typeof raw === "string" ? raw : raw == null ? "" : String(raw);
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
