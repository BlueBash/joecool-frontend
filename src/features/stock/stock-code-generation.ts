import { z } from "zod";
import type { GenerateNextCodeParams, GenerateNextCodeResult } from "@/api/stocks";
import { requiredString } from "@/lib/form";

const STORAGE_KEY = "joecool.stock-code-generation-params";

export const CodeGenerationParamsSchema = z.object({
  prefix: requiredString("Code prefix is required"),
  length: z.coerce
    .number({ error: "Total code length is required" })
    .int("Total code length must be a whole number")
    .min(1, "Total code length must be at least 1"),
});

export type CodeGenerationFieldErrors = Partial<
  Record<keyof z.infer<typeof CodeGenerationParamsSchema>, string>
>;

export function loadStoredCodeGenerationParams(): GenerateNextCodeParams | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GenerateNextCodeParams;
    if (parsed == null || typeof parsed !== "object") return null;
    return {
      prefix: String(parsed.prefix ?? ""),
      length: Number(parsed.length) || 0,
    };
  } catch {
    return null;
  }
}

export function saveStoredCodeGenerationParams(params: GenerateNextCodeParams): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  } catch {
    /* ignore quota / private mode */
  }
}

export function validateCodeGenerationParams(
  params: GenerateNextCodeParams,
): { ok: true; data: z.infer<typeof CodeGenerationParamsSchema> } | { ok: false; errors: CodeGenerationFieldErrors } {
  const result = CodeGenerationParamsSchema.safeParse(params);
  if (result.success) return { ok: true, data: result.data };
  const errors: CodeGenerationFieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (key === "prefix" || key === "length") errors[key] = issue.message;
  }
  return { ok: false, errors };
}

function readAttr(result: GenerateNextCodeResult, key: string): unknown {
  const attrs = result.attributes;
  if (attrs && typeof attrs === "object" && key in attrs) {
    return (attrs as Record<string, unknown>)[key];
  }
  return result[key];
}

/** Stock code from `generate_next_code` (JSON:API attributes or flat fields). */
export function extractGeneratedCode(result: GenerateNextCodeResult | undefined): string {
  if (!result) return "";
  const raw =
    readAttr(result, "stock_code") ??
    result.stock_code ??
    result.code ??
    result.next_code;
  return String(raw ?? "").trim();
}

/** Prefix/length echoed by the API or previously stored rules. */
export function extractCodeGenerationParams(
  result: GenerateNextCodeResult | undefined,
): GenerateNextCodeParams | null {
  if (!result) return null;
  const prefix = String(readAttr(result, "prefix") ?? result.prefix ?? "").trim();
  const lengthRaw = readAttr(result, "length") ?? result.length;
  const length = Number(lengthRaw);
  if (!prefix && !Number.isFinite(length)) return null;
  return {
    prefix,
    length: Number.isFinite(length) && length > 0 ? length : 0,
  };
}
