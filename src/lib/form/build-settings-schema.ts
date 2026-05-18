import { z } from "zod";
import type { FieldDef } from "@/features/settings/types";

/** Build a Zod schema for settings inline forms from field metadata. */
export function buildSettingsFormSchema(fields: FieldDef[]) {
  const shape: Record<string, z.ZodType<string>> = {};

  for (const f of fields) {
    let fieldSchema = z.string();
    if (f.maxLength) {
      fieldSchema = fieldSchema.max(
        f.maxLength,
        `${f.label} must be ${f.maxLength} characters or fewer`,
      );
    }
    if (f.required) {
      fieldSchema = fieldSchema.trim().min(1, `${f.label} is required`);
    } else {
      fieldSchema = z.string();
    }
    shape[f.name] = fieldSchema;
  }

  return z.object(shape) as z.ZodType<Record<string, string>, import("react-hook-form").FieldValues>;
}

export type SettingsFormValues = Record<string, string>;
