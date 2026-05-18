import { z } from "zod";
import type { Transaction, TxnAllocation, TxnLine } from "@/lib/types";
import { optionalNumber, optionalString, requiredString } from "@/lib/form";

const txnLineSchema: z.ZodType<TxnLine> = z.object({
  id: z.string(),
  itemCode: z.string(),
  description: z.string(),
  qty: z.number(),
  price: z.number(),
});

const txnAllocationSchema: z.ZodType<TxnAllocation> = z.object({
  id: z.string(),
  invoiceRef: z.string(),
  amount: z.number(),
});

export const TransactionFormSchema = z
  .object({
    id: z.string(),
    refMain: requiredString("Ref Main is required"),
    kind: z.enum(["Invoice", "Payment", "Credit"]),
    addrCode: z.string(),
    addrName: z.string(),
    date: z.string(),
    status: z.enum(["Open", "Paid", "Partial", "Void"]),
    value: z.number(),
    invoicedQty: z.number(),
    balancedQty: z.number(),
    lines: z.number(),
    txnLines: z.array(txnLineSchema).optional(),
    allocations: z.array(txnAllocationSchema).optional(),
    comment: optionalString,
    currency: optionalString,
    ratePct: optionalNumber,
    exclusiveValue: optionalNumber,
    discountGiven: optionalNumber,
    standardDays: optionalNumber,
    settleDays: optionalNumber,
    settleDiscPct: optionalNumber,
    acctBalance: optionalNumber,
    overdue: optionalNumber,
  })
  .passthrough() as z.ZodType<Transaction, import("react-hook-form").FieldValues>;

export type TransactionFormValues = z.infer<typeof TransactionFormSchema>;

export const PaymentFormSchema = z.object({
  refMain: requiredString("Payment ref is required"),
  customerCode: requiredString("Select a customer"),
  date: z.string().min(1, "Date is required"),
  amount: z.number().positive("Enter an amount greater than zero"),
  currency: z.string().min(1),
  payMethod: z.string(),
  bankAcct: z.string().optional(),
  bankCurrency: z.string(),
  transRef: z.string().optional(),
  auditRef: z.string().optional(),
  profCentre: z.string().optional(),
  taxPeriod: z.string().optional(),
  comment: z.string().optional(),
});

export type PaymentFormValues = z.infer<typeof PaymentFormSchema>;

export const InvoiceDetailsFormSchema = z.object({
  refMain: requiredString("Invoice ref is required"),
  date: z.string().min(1, "Date is required"),
  dueDate: optionalString,
  currency: z.string().min(1),
  comment: optionalString,
});

export type InvoiceDetailsFormValues = z.infer<typeof InvoiceDetailsFormSchema>;
