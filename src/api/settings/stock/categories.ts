import { z } from "zod";
import { createResource } from "@/api/_client";

export const StockCategorySchema = z.object({
  id: z.coerce.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  category_group_id: z.coerce.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const StockCategoryCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  category_group_id: z.coerce.string().nullable().optional(),
});

export const StockCategoryUpdateSchema = StockCategoryCreateSchema.partial();

export type StockCategory = z.infer<typeof StockCategorySchema>;
export type StockCategoryCreate = z.infer<typeof StockCategoryCreateSchema>;
export type StockCategoryUpdate = z.infer<typeof StockCategoryUpdateSchema>;

export const stockCategories = createResource<
  StockCategory,
  StockCategoryCreate,
  StockCategoryUpdate
>({
  scope: ["stock-settings", "categories"] as const,
  path: "/stock_settings/categories",
});
