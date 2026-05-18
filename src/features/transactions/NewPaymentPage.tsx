import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Save, Search } from "lucide-react";
import { useAddresses, useTxns } from "@/store";
import { EditScreen, EditCard } from "@/components/edit-screen";
import { FormNumberField, FormSelectField, FormTextField } from "@/components/form";
import { Field, FormGrid } from "@/components/form-primitives";
import { firstFormErrorMessage } from "@/lib/form";
import { PaymentFormSchema, type PaymentFormValues } from "./transaction-form-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/pill";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Address, Transaction, TxnAllocation } from "@/lib/types";

const STEPS = ["Payment", "Allocation"] as const;
const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

export function NewPaymentPage() {
  const nav = useNavigate();
  const customers = useAddresses((s) => s.items.filter((a) => a.type === "Customer"));
  const allTxns = useTxns((s) => s.items);
  const addTxn = useTxns((s) => s.add);

  const [step, setStep] = useState<0 | 1>(0);

  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      refMain: "",
      customerCode: "",
      date: "",
      amount: 0,
      currency: "GBP",
      payMethod: "BANK",
      bankAcct: "",
      bankCurrency: "GBP",
      transRef: "",
      auditRef: "",
      profCentre: "MAIN",
      taxPeriod: "",
      comment: "",
    },
    mode: "onTouched",
  });

  const form = paymentForm.watch();

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const current = paymentForm.getValues();
    paymentForm.reset({
      ...current,
      refMain: current.refMain || `PMT-${String(Date.now()).slice(-5)}`,
      date: current.date || today,
      taxPeriod: current.taxPeriod || today.slice(0, 7),
    });
  }, [paymentForm]);

  const customer = useMemo(
    () => customers.find((c) => c.code === form.customerCode) ?? null,
    [customers, form.customerCode],
  );

  const openInvoices = useMemo(
    () => (customer ? allTxns.filter((t) => t.kind === "Invoice" && t.addrCode === customer.code && t.status !== "Paid") : []),
    [allTxns, customer],
  );

  const [allocs, setAllocs] = useState<Record<string, number>>({});
  const allocated = Object.values(allocs).reduce((a, b) => a + b, 0);
  const remaining = +(form.amount - allocated).toFixed(2);

  const submit = () => {
    if (!customer) return;
    const allocations: TxnAllocation[] = openInvoices
      .filter((inv) => (allocs[inv.id] ?? 0) > 0)
      .map((inv) => ({ id: `al_${inv.id}`, invoiceRef: inv.refMain, amount: allocs[inv.id]! }));
    const txn: Transaction = {
      id: `t_${Date.now()}`,
      refMain: form.refMain,
      kind: "Payment",
      addrCode: customer.code,
      addrName: customer.name,
      date: form.date,
      invoicedQty: 0,
      balancedQty: 0,
      lines: 1,
      value: -Math.abs(form.amount),
      status: remaining <= 0.001 ? "Paid" : allocated > 0 ? "Partial" : "Open",
      tranType: "Refund",
      profCentre: form.profCentre,
      taxPeriod: form.taxPeriod,
      transRef: form.transRef,
      auditRef: form.auditRef,
      currency: form.currency,
      mainCode: customer.code,
      postCode: customer.zip,
      bankAcct: form.bankAcct,
      bankCurrency: form.bankCurrency,
      comment: form.comment,
      txnLines: [{ id: `tl_${Date.now()}`, itemCode: "", description: "Payment received", qty: 1, price: form.amount }],
      allocations,
    };
    addTxn(txn);
    toast.success(`Payment ${txn.refMain} recorded`);
    nav({ to: "/transactions/$id", params: { id: txn.id } });
  };

  return (
    <EditScreen
      backTo="/transactions"
      backLabel="Cancel & back"
      title="New Payment Transaction"
      subtitle={
        <div className="flex items-center gap-2 mt-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className={cn(
                "h-5 w-5 grid place-items-center rounded-full text-[11px] font-semibold",
                i < step && "bg-success text-success-foreground",
                i === step && "bg-primary text-primary-foreground",
                i > step && "bg-muted text-muted-foreground",
              )}>{i + 1}</span>
              <span className={cn("text-[12.5px]", i === step ? "text-foreground font-medium" : "text-muted-foreground")}>{s}</span>
              {i < STEPS.length - 1 && <span className="w-6 h-px bg-border" />}
            </div>
          ))}
        </div>
      }
    >
      {step === 0 && (
        <FormProvider {...paymentForm}>
          <PaymentFormStep
            customers={customers}
            customer={customer}
            onCancel={() => nav({ to: "/transactions" })}
            onNext={paymentForm.handleSubmit(
              () => setStep(1),
              (errors) => {
                toast.error(firstFormErrorMessage(errors) ?? "Please fix the highlighted fields");
              },
            )}
          />
        </FormProvider>
      )}

      {step === 1 && customer && (
        <>
          <EditCard
            title="Step 2 · Allocate Payment"
            description={`Apply payment to ${customer.name}'s open invoices.`}
            footer={
              <div className="flex items-center justify-end gap-6 text-[13px]">
                <span className="text-muted-foreground">Payment <span className="text-foreground tabular-nums font-medium ml-1">{fmt(form.amount)}</span></span>
                <span className="text-muted-foreground">Allocated <span className="text-foreground tabular-nums font-medium ml-1">{fmt(allocated)}</span></span>
                <span className="text-muted-foreground">Remaining <span className={cn("tabular-nums font-semibold ml-1", remaining > 0.01 ? "text-warning" : "text-success")}>{fmt(remaining)}</span></span>
              </div>
            }
          >
            {openInvoices.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-[13px]">
                No open invoices for this customer. Payment will be saved unallocated.
              </div>
            ) : (
              <div className="border border-border rounded-md overflow-hidden">
                <table className="w-full text-[13px]">
                  <thead className="bg-muted/50 text-[11.5px] uppercase text-muted-foreground">
                    <tr>
                      <th className="text-left font-medium p-2">Invoice</th>
                      <th className="text-left font-medium p-2">Date</th>
                      <th className="text-left font-medium p-2">Status</th>
                      <th className="text-right font-medium p-2 w-32">Outstanding</th>
                      <th className="text-right font-medium p-2 w-36">Allocate</th>
                      <th className="text-right font-medium p-2 w-28">Balance after</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openInvoices.map((inv) => {
                      const outstanding = Math.abs(inv.value);
                      const a = allocs[inv.id] ?? 0;
                      const after = +(outstanding - a).toFixed(2);
                      return (
                        <tr key={inv.id} className="border-t border-border">
                          <td className="p-2 font-mono font-medium">{inv.refMain}</td>
                          <td className="p-2 text-muted-foreground">{inv.date}</td>
                          <td className="p-2"><Pill variant={inv.status === "Partial" ? "warning" : "neutral"}>{inv.status}</Pill></td>
                          <td className="p-2 text-right tabular-nums">{fmt(outstanding)}</td>
                          <td className="p-2 text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Input
                                type="number"
                                step="0.01"
                                value={a || ""}
                                onChange={(e) => {
                                  const v = Math.min(outstanding, Math.max(0, Number(e.target.value) || 0));
                                  setAllocs({ ...allocs, [inv.id]: v });
                                }}
                                className="h-7 w-24 text-right tabular-nums"
                              />
                              <button
                                type="button"
                                className="text-[11px] text-primary hover:underline"
                                onClick={() => setAllocs({ ...allocs, [inv.id]: Math.min(outstanding, Math.max(0, remaining + a)) })}
                              >
                                Max
                              </button>
                            </div>
                          </td>
                          <td className={cn("p-2 text-right tabular-nums font-medium", after === 0 && "text-success")}>{fmt(after)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setStep(0)} className="gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>
              <Button size="sm" onClick={submit} className="gap-1.5">
                <Save className="h-3.5 w-3.5" /> Confirm Allocation
              </Button>
            </div>
          </EditCard>
        </>
      )}
    </EditScreen>
  );
}

interface PaymentFormStepProps {
  customers: Address[];
  customer: Address | null;
  onCancel: () => void;
  onNext: () => void;
}

function PaymentFormStep({
  customers, customer, onCancel, onNext,
}: PaymentFormStepProps) {
  const { watch, setValue, formState: { isSubmitting } } = useFormContext<PaymentFormValues>();
  const form = watch();
  const set = <K extends keyof PaymentFormValues>(k: K, v: PaymentFormValues[K]) =>
    setValue(k, v as never, { shouldDirty: true, shouldTouch: true });
  const [q, setQ] = useState("");
  const matches = useMemo(() => {
    const term = q.toLowerCase();
    return customers
      .filter((c) => !term || c.code.toLowerCase().includes(term) || c.name.toLowerCase().includes(term))
      .slice(0, 8);
  }, [customers, q]);

  return (
    <>
      <EditCard title="Step 1 · Payment Details" description="Enter payment information.">
        <FormGrid cols={3}>
          <Field label="Payment Ref" required>
            <Input value={form.refMain} onChange={(e) => set("refMain", e.target.value)} className="h-8 font-mono" />
          </Field>
          <Field label="Date">
            <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className="h-8" />
          </Field>
          <Field label="Amount" required>
            <Input
              type="number" step="0.01" placeholder="0.00"
              value={form.amount || ""} onChange={(e) => set("amount", Number(e.target.value) || 0)}
              className="h-8 text-right tabular-nums"
            />
          </Field>

          <Field label="Customer" required className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by code or name…"
                value={customer ? `${customer.code} · ${customer.name}` : q}
                onChange={(e) => { setQ(e.target.value); set("customerCode", ""); }}
                className="pl-8 h-8"
              />
              {!customer && q && matches.length > 0 && (
                <div className="absolute z-20 mt-1 left-0 right-0 max-h-52 overflow-auto bg-card border border-border rounded-md shadow-md">
                  {matches.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { set("customerCode", c.code); setQ(""); }}
                      className="w-full flex items-center justify-between gap-2 px-3 py-1.5 text-left text-[13px] hover:bg-accent/60 border-b border-border last:border-b-0"
                    >
                      <span className="font-mono">{c.code}</span>
                      <span className="flex-1 truncate mx-2">{c.name}</span>
                      <span className="text-[11px] text-muted-foreground">{c.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>
          <Field label="Currency">
            <Input value={form.currency} onChange={(e) => set("currency", e.target.value)} className="h-8 font-mono" />
          </Field>

          <Field label="Pay Method">
            <select value={form.payMethod} onChange={(e) => set("payMethod", e.target.value)} className="h-8 px-2 rounded border border-border bg-background text-[13px]">
              <option>BANK</option><option>CASH</option><option>CARD</option><option>CHEQUE</option><option>OTHER</option>
            </select>
          </Field>
          <Field label="Bank Account">
            <Input value={form.bankAcct} onChange={(e) => set("bankAcct", e.target.value)} className="h-8" />
          </Field>
          <Field label="Bank Currency">
            <Input value={form.bankCurrency} onChange={(e) => set("bankCurrency", e.target.value)} className="h-8 font-mono" />
          </Field>

          <Field label="Trans Ref">
            <Input value={form.transRef} onChange={(e) => set("transRef", e.target.value)} className="h-8 font-mono" />
          </Field>
          <Field label="Audit Ref">
            <Input value={form.auditRef} onChange={(e) => set("auditRef", e.target.value)} className="h-8 font-mono" />
          </Field>
          <Field label="Tax Period">
            <Input value={form.taxPeriod} onChange={(e) => set("taxPeriod", e.target.value)} className="h-8 font-mono" />
          </Field>

          <Field label="Profit Centre">
            <Input value={form.profCentre} onChange={(e) => set("profCentre", e.target.value)} className="h-8" />
          </Field>
          <Field label="Comment" className="md:col-span-2">
            <Input value={form.comment} onChange={(e) => set("comment", e.target.value)} className="h-8" placeholder="Optional…" />
          </Field>
        </FormGrid>
      </EditCard>

      <div className="flex items-center justify-end gap-2 mt-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="button" size="sm" onClick={onNext} disabled={isSubmitting} className="gap-1.5">
          Next: Allocate <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </>
  );
}

