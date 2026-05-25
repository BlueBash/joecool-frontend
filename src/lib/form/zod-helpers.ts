import { z } from "zod";
import { displayToApiDate, INVALID_DATE_MESSAGE, isValidApiDate } from "@/lib/dates";

/** Trimmed non-empty string. */
export const requiredString = (message: string) => z.string().trim().min(1, message);

/** Optional string; empty input becomes undefined (never null). */
export const optionalString = z
  .string()
  .optional()
  .transform((v) => {
    if (v == null) return undefined;
    const s = v.trim();
    return s === "" ? undefined : s;
  });

/** Optional email; blank is allowed. */
export const optionalEmail = z
  .union([z.string(), z.literal(""), z.null(), z.undefined()])
  .transform((v) => {
    if (v == null || String(v).trim() === "") return undefined;
    return String(v).trim();
  })
  .pipe(z.union([z.literal(undefined), z.string().email("Enter a valid email")]));

/** Number from form input; empty → undefined, invalid → NaN filtered in optionalNumber. */
export const optionalNumber = z.preprocess((v) => {
  if (v === "" || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}, z.number().optional());

/** Required positive number from form input. */
export const requiredPositiveNumber = (message: string) =>
  z.preprocess(
    (v) => Number(v),
    z.number({ error: message }).positive(message),
  );

/** Coerce checkbox / switch to boolean. */
export const booleanField = z.preprocess((v) => Boolean(v), z.boolean());

/** Optional YYYY-MM-DD; empty input → undefined. */
export const optionalApiDate = z
  .union([z.string(), z.literal(""), z.null(), z.undefined()])
  .transform((v) => {
    if (v == null || String(v).trim() === "") return undefined;
    const s = String(v).trim();
    const api = displayToApiDate(s) ?? (isValidApiDate(s) ? s : null);
    return api ?? undefined;
  })
  .pipe(z.union([z.literal(undefined), z.string().refine(isValidApiDate, INVALID_DATE_MESSAGE)]));

/** Required YYYY-MM-DD. */
export const requiredApiDate = (message = INVALID_DATE_MESSAGE) =>
  z
    .string()
    .trim()
    .min(1, message)
    .refine((v) => isValidApiDate(v) || displayToApiDate(v) != null, message)
    .transform((v) => displayToApiDate(v) ?? v);
