import { z } from "zod";
import type { Order, OrderLine } from "@/lib/types";
import { optionalNumber, optionalString, requiredString } from "@/lib/form";

const orderLineSchema: z.ZodType<OrderLine> = z.object({
  id: z.string(),
  itemCode: z.string(),
  itemName: z.string(),
  qty: z.number(),
  price: z.number(),
  per: z.number(),
});

export const OrderFormSchema = z
  .object({
    id: z.string(),
    code: requiredString("Code is required"),
    addrType: z.enum(["Supplier", "Customer"]),
    addrCode: z.string(),
    addrName: z.string(),
    logRef: z.string(),
    kind: z.enum(["REGULAR", "SAMPLE", "BACKORDER"]),
    status: z.enum(["Draft", "Confirmed", "Shipped", "Cancelled"]),
    written: z.string(),
    ship: z.string(),
    cancel: z.string(),
    lines: z.array(orderLineSchema).min(0),
    notes: optionalString,
    messages: optionalString,
    confirmed: z.boolean().optional(),
    allowAllocs: z.boolean().optional(),
    exchRate: optionalNumber,
    charge: optionalNumber,
    transitDays: optionalNumber,
    agentCommRate: optionalNumber,
    authorCommRate: optionalNumber,
    sourceCommRate: optionalNumber,
    fobCharge: optionalNumber,
    discountOverall: optionalNumber,
    discountItems: optionalNumber,
  })
  .passthrough() as z.ZodType<Order, import("react-hook-form").FieldValues>;

export type OrderFormValues = z.infer<typeof OrderFormSchema>;
