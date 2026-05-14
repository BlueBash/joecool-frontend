import { z } from "zod";
import { createResource } from "@/api/_client";

export const StockCategoryGroupSchema = z.object({
  id: z.coerce.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const StockCategoryGroupCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
});

export const StockCategoryGroupUpdateSchema = StockCategoryGroupCreateSchema.partial();

export type StockCategoryGroup = z.infer<typeof StockCategoryGroupSchema>;
export type StockCategoryGroupCreate = z.infer<typeof StockCategoryGroupCreateSchema>;
export type StockCategoryGroupUpdate = z.infer<typeof StockCategoryGroupUpdateSchema>;

export const stockCategoryGroups = createResource<
  StockCategoryGroup,
  StockCategoryGroupCreate,
  StockCategoryGroupUpdate
>({
  scope: ["stock-settings", "category-groups"] as const,
  path: "/stock_settings/category_groups",
});
