import { z } from "zod";
import type { StockItem } from "@/lib/types";
import { optionalNumber, optionalString, requiredString } from "@/lib/form";
import { normalizeStockFlagCodes } from "@/lib/reference";

function hasStockTitle(data: {
  title?: string;
  editedTitle?: string;
  generatedTitle?: string;
}): boolean {
  return [data.title, data.editedTitle, data.generatedTitle].some((v) => (v?.trim() ?? "") !== "");
}

/** Client validation for stock edit/create — required fields; passthrough for full `StockItem` shape. */
export const StockFormSchema = z
  .object({
    id: z.string(),
    code: requiredString("Code is required"),
    title: z.string(),
    editedTitle: z.string().optional(),
    generatedTitle: z.string().optional(),
    category: z.string(),
    onHand: optionalNumber,
    reorderLevel: optionalNumber,
    color: z.string(),
    introDate: z.string(),
    costPrice: optionalNumber,
    sellingPrice: optionalNumber,
    status: z.enum(["active", "low", "out", "archived"]),
    imageHue: z.number(),
    flags: z.array(z.string()),
    flagCodes: z.preprocess(
      (v) =>
        v == null ? undefined : normalizeStockFlagCodes(v as Record<string, boolean | undefined>),
      z.record(z.string(), z.boolean()).optional(),
    ),
    notes: optionalString,
    supplierNotes: optionalString,
  })
  .passthrough()
  .superRefine((data, ctx) => {
    if (!hasStockTitle(data)) {
      ctx.addIssue({
        code: "custom",
        message: "Title is required",
        path: ["editedTitle"],
      });
    }
  }) as z.ZodType<StockItem, import("react-hook-form").FieldValues>;

export type StockFormValues = z.infer<typeof StockFormSchema>;
