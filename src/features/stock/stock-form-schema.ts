import { z } from "zod";
import type { StockItem } from "@/lib/types";
import { optionalNumber, optionalString, requiredString } from "@/lib/form";

/** Client validation for stock edit/create — required fields; passthrough for full `StockItem` shape. */
export const StockFormSchema = z
  .object({
    id: z.string(),
    code: requiredString("Code is required"),
    title: requiredString("Title is required"),
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
    flagCodes: z.record(z.string(), z.boolean()).optional(),
    notes: optionalString,
  })
  .passthrough() as z.ZodType<StockItem, import("react-hook-form").FieldValues>;

export type StockFormValues = z.infer<typeof StockFormSchema>;

export const QuickStockFormSchema = z.object({
  code: requiredString("Code is required"),
  title: requiredString("Title is required"),
  category: z.string().optional(),
  onHand: z.coerce.number().optional(),
});

export type QuickStockFormValues = z.infer<typeof QuickStockFormSchema>;
