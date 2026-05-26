import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import type { ApiError } from "@/api/_client";

/** Apply Rails-style field errors from the API onto a react-hook-form instance. */
export function applyApiFieldErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  err: ApiError,
): boolean {
  if (!err.fieldErrors) return false;
  for (const [field, messages] of Object.entries(err.fieldErrors)) {
    const message = messages?.[0] ?? err.message;
    setError(field as FieldPath<T>, { type: "server", message });
  }
  return true;
}

/** First validation message from a failed handleSubmit callback. */
export function firstFormErrorMessage(errors: Record<string, unknown>): string | undefined {
  for (const e of Object.values(errors)) {
    if (!e || typeof e !== "object") continue;
    if ("message" in e) {
      const msg = (e as { message?: unknown }).message;
      if (typeof msg === "string" && msg.length > 0) return msg;
    }
    const nested = firstFormErrorMessage(e as Record<string, unknown>);
    if (nested) return nested;
  }
  return undefined;
}
