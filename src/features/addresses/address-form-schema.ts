import { z } from "zod";
import type { FieldValues } from "react-hook-form";
import type { Address } from "@/lib/types";
import { optionalEmail, optionalNumber, optionalString, requiredString } from "@/lib/form";

const addressFlagsSchema = z.object({
    flag1: z.boolean().optional(),
    flag2: z.boolean().optional(),
    flag3: z.boolean().optional(),
    stop: z.boolean().optional(),
    bad: z.boolean().optional(),
    shop: z.boolean().optional(),
    ownShop: z.boolean().optional(),
    apOnly: z.boolean().optional(),
    salesLead: z.boolean().optional(),
    statement: z.boolean().optional(),
    whlslEmailShots: z.boolean().optional(),
    reorderPrompts: z.boolean().optional(),
    orderBalnsPrint: z.boolean().optional(),
    lateOrderSheet: z.boolean().optional(),
    allowOverdue: z.boolean().optional(),
    bestSellerConsider: z.boolean().optional(),
    customsInvoice: z.boolean().optional(),
  }).optional();

/** Client validation for address edit/create — required fields only; shape matches `Address`. */
export const AddressFormSchema = z
  .object({
    id: z.string(),
    code: requiredString("Code is required"),
    name: requiredString("Name is required"),
    type: z.enum(["Customer", "Supplier"]),
    kind: optionalString,
    created: optionalString,
    contact: optionalString,
    email: optionalEmail,
    phone: optionalString,
    website: optionalString,
    address1: z.string(),
    address2: optionalString,
    town: z.string(),
    region: optionalString,
    zip: optionalString,
    country: z.string(),
    countryId: optionalNumber,
    category: optionalString,
    categoryId: optionalNumber,
    categoryCode: optionalString,
    area: optionalString,
    areaId: optionalNumber,
    areaCode: optionalString,
    deliveryAccount: optionalString,
    flags: addressFlagsSchema,
    notes: optionalString,
    overallInvDscPct: optionalNumber,
    whlslItemDscPct: optionalNumber,
    standardDays: optionalNumber,
    settleDays: optionalNumber,
    settleDiscount: optionalNumber,
    transitDay: optionalNumber,
    charge: optionalNumber,
    agentCommPct: optionalNumber,
    agentPackingChargePct: optionalNumber,
    qualityPct: optionalNumber,
    probsPct: optionalNumber,
    chargesPct: optionalNumber,
    freightToUkPct: optionalNumber,
    fobAdminChargesPct: optionalNumber,
    ukClearPct: optionalNumber,
    ukDeliveryPct: optionalNumber,
    ukDutyPct: optionalNumber,
  })
  .passthrough() as z.ZodType<Address, FieldValues>;

export type AddressFormValues = z.infer<typeof AddressFormSchema>;

export const QuickAddressFormSchema = z.object({
  code: requiredString("Code is required"),
  name: requiredString("Name is required"),
  type: z.enum(["Customer", "Supplier"]),
  town: z.string().optional(),
  country: z.string().optional(),
});

export type QuickAddressFormValues = z.infer<typeof QuickAddressFormSchema>;
