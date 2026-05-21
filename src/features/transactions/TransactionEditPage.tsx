import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { Trash2, Save, Plus } from "lucide-react";
import { useTxns } from "@/store";
import { EditScreen, EditCard } from "@/components/edit-screen";
import { Field, FormGrid } from "@/components/form-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/pill";
import { CopyableCode } from "@/components/app-shell";
import { InlineNumber, InlineText } from "@/components/inline-edit";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { toast } from "sonner";
import type { Transaction, TxnLine, TxnAllocation, TxnKind, TranType, TxnLineUpdate, TxnAllocationUpdate } from "@/lib/types";
import { firstFormErrorMessage, useEntityForm } from "@/lib/form";
import { TransactionFormSchema, type TransactionFormValues } from "./transaction-form-schema";

const routeApi = getRouteApi("/transactions/$id");

const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

export function TransactionEditPage() {
  const { id } = routeApi.useParams();
  const nav = useNavigate();
  const { items, update, remove } = useTxns();
  const item = items.find(i => i.id === id);

  const form = useEntityForm<TransactionFormValues>({
    schema: TransactionFormSchema,
    defaultValues: item ?? ({} as Transaction),
    resetValues: item ?? null,
    resetKey: id,
  });

  const { watch, setValue, handleSubmit, isDirty, isSubmitting } = form;
  const draft = watch();

  const deleteConfirm = useDeleteConfirm<{ id: string }>({
    onConfirm: async ({ id }) => {
      remove(id);
      toast.success("Removed");
      nav({ to: "/transactions" });
    },
  });

  if (!item || !draft?.id) {
    return (
      <EditScreen backTo="/transactions" title="Transaction not found">
        <p className="text-muted-foreground text-[13px]">This transaction may have been deleted.</p>
      </EditScreen>
    );
  }

  const set = <K extends keyof Transaction>(k: K, v: Transaction[K]) =>
    setValue(k as keyof TransactionFormValues, v as never, { shouldDirty: true, shouldTouch: true });

  const lines = draft.txnLines ?? [];
  const allocs = draft.allocations ?? [];
  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const allocated = allocs.reduce((s, a) => s + a.amount, 0);
  const unallocated = Math.abs(draft.value) - allocated;

  const setLines = (next: TxnLine[]) => {
    const total = next.reduce((s, l) => s + l.qty * l.price, 0);
    setValue("txnLines", next, { shouldDirty: true });
    setValue("lines", next.length, { shouldDirty: true });
    setValue(
      "value",
      draft.kind === "Payment" ? -Math.abs(total) : total,
      { shouldDirty: true },
    );
    setValue("exclusiveValue", +(total / 1.2).toFixed(2), { shouldDirty: true });
  };
  const updLine = (lid: string, p: TxnLineUpdate) => setLines(lines.map(l => l.id === lid ? { ...l, ...p } : l));
  const addLine = () => setLines([...lines, { id: `tl_${Date.now()}`, itemCode: "", description: "", qty: 1, price: 0 }]);
  const rmLine = (lid: string) => setLines(lines.filter(l => l.id !== lid));

  const setAllocs = (next: TxnAllocation[]) => set("allocations", next);
  const updAlloc = (lid: string, p: TxnAllocationUpdate) => setAllocs(allocs.map(a => a.id === lid ? { ...a, ...p } : a));
  const addAlloc = () => setAllocs([...allocs, { id: `al_${Date.now()}`, invoiceRef: "", amount: Math.max(0, unallocated) }]);
  const rmAlloc = (lid: string) => setAllocs(allocs.filter(a => a.id !== lid));

  const save = handleSubmit(
    (values) => {
      update(item.id, values);
      toast.success("Transaction saved");
      nav({ to: "/transactions" });
    },
    (errors) => {
      toast.error(firstFormErrorMessage(errors) ?? "Please fix the highlighted fields");
    },
  );
  const onDelete = () => {
    deleteConfirm.requestDelete({
      title: "Delete transaction",
      entityName: draft.refMain,
      entityType: "transaction",
      meta: { id: item.id },
    });
  };

  return (
    <FormProvider {...form}>
    <DeleteConfirmDialog state={deleteConfirm} />
    <EditScreen
      backTo="/transactions"
      backLabel="Back to Transactions"
      title={`${draft.kind} ${draft.refMain}`}
      subtitle={<span>{draft.addrName} · <CopyableCode value={draft.addrCode} /></span>}
      badges={
        <>
          <Pill variant={draft.kind === "Invoice" ? "primary" : draft.kind === "Payment" ? "success" : "warning"}>{draft.kind}</Pill>
          <Pill variant={draft.status === "Paid" ? "success" : draft.status === "Partial" ? "warning" : "neutral"}>{draft.status}</Pill>
        </>
      }
      actions={
        <>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-destructive hover:text-destructive" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
          <Button size="sm" className="h-8 gap-1.5" onClick={save} disabled={isSubmitting || !isDirty}><Save className="h-3.5 w-3.5" /> Save</Button>
        </>
      }
    >
      <EditCard title="Main Detail">
        <FormGrid cols={3}>
          <Field label="Ref Main" required><Input value={draft.refMain} onChange={e => set("refMain", e.target.value)} className="h-8 font-mono" /></Field>
          <Field label="Kind">
            <select value={draft.kind} onChange={e => set("kind", e.target.value as TxnKind)} className="h-8 px-2 rounded border border-border bg-background text-[13px]">
              <option>Invoice</option><option>Payment</option><option>Credit</option>
            </select>
          </Field>
          <Field label="Status">
            <select value={draft.status} onChange={e => set("status", e.target.value as Transaction["status"])} className="h-8 px-2 rounded border border-border bg-background text-[13px]">
              <option>Open</option><option>Paid</option><option>Partial</option><option>Void</option>
            </select>
          </Field>
          <Field label="Addr Code"><Input value={draft.addrCode} onChange={e => set("addrCode", e.target.value)} className="h-8 font-mono" /></Field>
          <Field label="Addr Name" className="md:col-span-2"><Input value={draft.addrName} onChange={e => set("addrName", e.target.value)} className="h-8" /></Field>
          <Field label="Date"><Input type="date" value={draft.date} onChange={e => set("date", e.target.value)} className="h-8" /></Field>
          <Field label="Delivery Date"><Input type="date" value={draft.delvDate ?? ""} onChange={e => set("delvDate", e.target.value)} className="h-8" /></Field>
          <Field label="Due Date"><Input type="date" value={draft.dueDate ?? ""} onChange={e => set("dueDate", e.target.value)} className="h-8" /></Field>
          <Field label="Tran Type">
            <select value={draft.tranType ?? "Sale"} onChange={e => set("tranType", e.target.value as TranType)} className="h-8 px-2 rounded border border-border bg-background text-[13px]">
              <option>Sale</option><option>Purchase</option><option>Refund</option><option>Adjustment</option>
            </select>
          </Field>
          <Field label="Prof Centre"><Input value={draft.profCentre ?? ""} onChange={e => set("profCentre", e.target.value)} className="h-8" /></Field>
          <Field label="Tax Period"><Input value={draft.taxPeriod ?? ""} onChange={e => set("taxPeriod", e.target.value)} className="h-8 font-mono" /></Field>
          <Field label="Trans Ref"><Input value={draft.transRef ?? ""} onChange={e => set("transRef", e.target.value)} className="h-8 font-mono" /></Field>
          <Field label="Audit Ref"><Input value={draft.auditRef ?? ""} onChange={e => set("auditRef", e.target.value)} className="h-8 font-mono" /></Field>
          <Field label="Agent"><Input value={draft.agent ?? ""} onChange={e => set("agent", e.target.value)} className="h-8" /></Field>
          <Field label="Comm %"><Input type="number" step="0.01" value={draft.commPct ?? 0} onChange={e => set("commPct", Number(e.target.value))} className="h-8 text-right tabular-nums" /></Field>
        </FormGrid>
      </EditCard>

      <EditCard
        title={draft.kind === "Payment" ? "Breakdown" : "Stock Lines"}
        description="Line items for this transaction."
        footer={
          <div className="flex items-center justify-end gap-6 text-[13px]">
            <span className="text-muted-foreground">Subtotal <span className="text-foreground tabular-nums font-medium ml-1">{fmt(subtotal)}</span></span>
            <span className="text-muted-foreground">Total <span className="text-foreground tabular-nums font-semibold ml-1">{fmt(Math.abs(draft.value))}</span></span>
          </div>
        }
      >
        <div className="flex justify-end mb-2">
          <Button size="sm" className="h-8 gap-1.5" onClick={addLine}><Plus className="h-3.5 w-3.5" /> Add line</Button>
        </div>
        <table className="w-full text-[13px]">
          <thead className="text-[11.5px] uppercase text-muted-foreground border-b border-border">
            <tr>
              <th className="text-left font-medium pb-1.5 w-28">Code</th>
              <th className="text-left font-medium pb-1.5">Description</th>
              <th className="text-right font-medium pb-1.5 w-20">Qty</th>
              <th className="text-right font-medium pb-1.5 w-24">Price</th>
              <th className="text-right font-medium pb-1.5 w-24">Total</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {lines.map(l => (
              <tr key={l.id} className="border-b border-border/60">
                <td className="py-1.5"><InlineText value={l.itemCode} placeholder="—" onSave={v => updLine(l.id, { itemCode: v })} /></td>
                <td className="py-1.5"><InlineText value={l.description} placeholder="Description" onSave={v => updLine(l.id, { description: v })} /></td>
                <td className="py-1.5 text-right"><InlineNumber value={l.qty} onSave={v => updLine(l.id, { qty: v })} /></td>
                <td className="py-1.5 text-right"><InlineNumber value={l.price} onSave={v => updLine(l.id, { price: v })} /></td>
                <td className="py-1.5 text-right tabular-nums font-medium">{fmt(l.qty * l.price)}</td>
                <td className="py-1.5 text-right">
                  <button onClick={() => rmLine(l.id)} className="text-muted-foreground hover:text-destructive p-1">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {lines.length === 0 && (
              <tr><td colSpan={6} className="text-center py-6 text-muted-foreground text-[12.5px]">No lines yet.</td></tr>
            )}
          </tbody>
        </table>
      </EditCard>

      <EditCard title="VAT & Discount">
        <FormGrid cols={3}>
          <Field label="Currency"><Input value={draft.currency ?? "GBP"} onChange={e => set("currency", e.target.value)} className="h-8 font-mono" /></Field>
          <Field label="VAT Band">
            <select value={draft.vatBand ?? "Standard"} onChange={e => set("vatBand", e.target.value)} className="h-8 px-2 rounded border border-border bg-background text-[13px]">
              <option>Standard</option><option>Reduced</option><option>Zero</option>
            </select>
          </Field>
          <Field label="VAT Code"><Input value={draft.vatCode ?? ""} onChange={e => set("vatCode", e.target.value)} className="h-8 font-mono" /></Field>
          <Field label="Rate %"><Input type="number" value={draft.ratePct ?? 0} onChange={e => set("ratePct", Number(e.target.value))} className="h-8 text-right tabular-nums" /></Field>
          <Field label="Exclusive Value"><Input type="number" step="0.01" value={draft.exclusiveValue ?? 0} onChange={e => set("exclusiveValue", Number(e.target.value))} className="h-8 text-right tabular-nums" /></Field>
          <Field label="Discount Given"><Input type="number" step="0.01" value={draft.discountGiven ?? 0} onChange={e => set("discountGiven", Number(e.target.value))} className="h-8 text-right tabular-nums" /></Field>
        </FormGrid>
      </EditCard>

      <EditCard title="Bank & Terms">
        <FormGrid cols={3}>
          <Field label="Bank Account"><Input value={draft.bankAcct ?? ""} onChange={e => set("bankAcct", e.target.value)} className="h-8" /></Field>
          <Field label="Bank Currency"><Input value={draft.bankCurrency ?? "GBP"} onChange={e => set("bankCurrency", e.target.value)} className="h-8 font-mono" /></Field>
          <Field label="Control Code"><Input value={draft.controlCode ?? ""} onChange={e => set("controlCode", e.target.value)} className="h-8 font-mono" /></Field>
          <Field label="Pay Terms"><Input value={draft.payTerms ?? ""} onChange={e => set("payTerms", e.target.value)} className="h-8" /></Field>
          <Field label="Standard Days"><Input type="number" value={draft.standardDays ?? 0} onChange={e => set("standardDays", Number(e.target.value))} className="h-8 text-right tabular-nums" /></Field>
          <Field label="Settle Days"><Input type="number" value={draft.settleDays ?? 0} onChange={e => set("settleDays", Number(e.target.value))} className="h-8 text-right tabular-nums" /></Field>
          <Field label="Settle Disc %"><Input type="number" step="0.01" value={draft.settleDiscPct ?? 0} onChange={e => set("settleDiscPct", Number(e.target.value))} className="h-8 text-right tabular-nums" /></Field>
          <Field label="Acct Balance"><Input type="number" step="0.01" value={draft.acctBalance ?? 0} onChange={e => set("acctBalance", Number(e.target.value))} className="h-8 text-right tabular-nums" /></Field>
          <Field label="Overdue"><Input type="number" step="0.01" value={draft.overdue ?? 0} onChange={e => set("overdue", Number(e.target.value))} className="h-8 text-right tabular-nums" /></Field>
        </FormGrid>
      </EditCard>

      {draft.kind !== "Invoice" && (
        <EditCard
          title="Allocations"
          description="Apply this payment / credit to invoices."
          footer={
            <div className="flex items-center justify-end gap-6 text-[13px]">
              <span className="text-muted-foreground">Allocated <span className="text-foreground tabular-nums font-medium ml-1">{fmt(allocated)}</span></span>
              <span className="text-muted-foreground">Unallocated <span className={`tabular-nums font-medium ml-1 ${unallocated > 0.01 ? "text-warning" : "text-success"}`}>{fmt(unallocated)}</span></span>
            </div>
          }
        >
          <div className="flex justify-end mb-2">
            <Button size="sm" className="h-8 gap-1.5" onClick={addAlloc}><Plus className="h-3.5 w-3.5" /> Add allocation</Button>
          </div>
          <table className="w-full text-[13px]">
            <thead className="text-[11.5px] uppercase text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left font-medium pb-1.5">Invoice Ref</th>
                <th className="text-right font-medium pb-1.5 w-32">Amount</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {allocs.map(a => (
                <tr key={a.id} className="border-b border-border/60">
                  <td className="py-1.5"><InlineText value={a.invoiceRef} placeholder="INV-…" onSave={v => updAlloc(a.id, { invoiceRef: v })} /></td>
                  <td className="py-1.5 text-right"><InlineNumber value={a.amount} onSave={v => updAlloc(a.id, { amount: v })} /></td>
                  <td className="py-1.5 text-right">
                    <button onClick={() => rmAlloc(a.id)} className="text-muted-foreground hover:text-destructive p-1">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {allocs.length === 0 && (
                <tr><td colSpan={3} className="text-center py-6 text-muted-foreground text-[12.5px]">No allocations yet.</td></tr>
              )}
            </tbody>
          </table>
        </EditCard>
      )}

      <EditCard title="Comment">
        <textarea
          className="w-full min-h-[80px] p-2 rounded-md border border-border bg-background text-[13px] resize-y"
          value={draft.comment ?? ""}
          onChange={e => set("comment", e.target.value)}
        />
      </EditCard>
    </EditScreen>
    </FormProvider>
  );
}
