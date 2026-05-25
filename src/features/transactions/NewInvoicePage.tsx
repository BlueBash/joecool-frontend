import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Check, ArrowRight, ArrowLeft, Save } from "lucide-react";
import { useAddressDirectory } from "@/features/addresses/hooks";
import { EditScreen, EditCard } from "@/components/edit-screen";
import { DateField } from "@/components/date-field";
import { Field, FormGrid } from "@/components/form-primitives";
import { todayApiDate } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Pill } from "@/components/pill";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Address, Order, OrderLine, Transaction, TxnLine } from "@/lib/types";

const STEPS = ["Customer", "Orders", "Validation", "Form"] as const;
type Step = 0 | 1 | 2 | 3;

const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
type ValidationMode = "as-ordered" | "outstanding-only" | "manual";

interface StepperProps {
  step: number;
  steps: readonly string[];
}

interface StepFooterProps {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  backLabel?: string;
}

interface CustomerStepProps {
  customers: Address[];
  picked: Address | null;
  onPick: (customer: Address | null) => void;
  onNext: () => void;
  onCancel: () => void;
}

interface OrdersStepProps {
  customer: Address;
  orders: Order[];
  picked: Set<string>;
  onChange: (next: Set<string>) => void;
  onBack: () => void;
  onNext: () => void;
}

interface ValidationStepProps {
  orders: Order[];
  mode: ValidationMode;
  setMode: (mode: ValidationMode) => void;
  lineQtys: Record<string, number>;
  setLineQtys: (next: Record<string, number>) => void;
  onBack: () => void;
  onNext: () => void;
}

interface InvoiceFormStepProps {
  customer: Address;
  lines: TxnLine[];
  total: number;
  onBack: () => void;
  onConfirm: (txn: Transaction) => void;
}

export function NewInvoicePage() {
  const nav = useNavigate();
  const addressDirectory = useAddressDirectory({ page: 1, pageSize: 500 });
  const customers = useMemo(
    () => addressDirectory.items.filter((a) => a.type === "Customer"),
    [addressDirectory.items],
  );
  const allOrders: Order[] = [];

  const [step, setStep] = useState<Step>(0);
  const [customer, setCustomer] = useState<Address | null>(null);
  const [pickedOrderIds, setPickedOrderIds] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<ValidationMode>("as-ordered");
  const [lineQtys, setLineQtys] = useState<Record<string, number>>({});

  const customerOrders = useMemo(
    () => (customer ? allOrders.filter((o) => o.addrCode === customer.code) : []),
    [allOrders, customer],
  );
  const pickedOrders = useMemo(
    () => customerOrders.filter((o) => pickedOrderIds.has(o.id)),
    [customerOrders, pickedOrderIds],
  );

  const allLines = useMemo(() => {
    const out: { order: Order; line: OrderLine }[] = [];
    pickedOrders.forEach((o) => o.lines.forEach((l) => out.push({ order: o, line: l })));
    return out;
  }, [pickedOrders]);

  const finalLines: TxnLine[] = useMemo(
    () =>
      allLines.map(({ order, line }) => {
        const key = `${order.id}:${line.id}`;
        const qty = mode === "manual" ? (lineQtys[key] ?? line.qty) : line.qty;
        return {
          id: `tl_${key}`,
          itemCode: line.itemCode,
          description: `${line.itemName} (Order ${order.code})`,
          qty,
          price: line.price,
        };
      }),
    [allLines, mode, lineQtys],
  );

  const total = finalLines.reduce((s, l) => s + l.qty * l.price, 0);

  const goNext = () => setStep((s) => Math.min(3, (s + 1)) as Step);
  const goBack = () => {
    if (step === 0) nav({ to: "/transactions" });
    else setStep((s) => Math.max(0, (s - 1)) as Step);
  };

  return (
    <EditScreen
      backTo="/transactions"
      backLabel="Cancel & back"
      title="New Invoice Transaction"
      subtitle={<Stepper step={step} steps={STEPS} />}
    >
      {step === 0 && (
        <CustomerStep
          customers={customers}
          picked={customer}
          onPick={setCustomer}
          onNext={() => customer && goNext()}
          onCancel={() => nav({ to: "/transactions" })}
        />
      )}
      {step === 1 && customer && (
        <OrdersStep
          customer={customer}
          orders={customerOrders}
          picked={pickedOrderIds}
          onChange={setPickedOrderIds}
          onBack={goBack}
          onNext={() => pickedOrderIds.size > 0 && goNext()}
        />
      )}
      {step === 2 && (
        <ValidationStep
          orders={pickedOrders}
          mode={mode}
          setMode={setMode}
          lineQtys={lineQtys}
          setLineQtys={setLineQtys}
          onBack={goBack}
          onNext={goNext}
        />
      )}
      {step === 3 && customer && (
        <InvoiceFormStep
          customer={customer}
          lines={finalLines}
          total={total}
          onBack={goBack}
          onConfirm={() => {
            toast.info("Transactions API is not connected yet.");
            nav({ to: "/transactions" });
          }}
        />
      )}
    </EditScreen>
  );
}

function Stepper({ step, steps }: StepperProps) {
  return (
    <div className="flex items-center gap-2 mt-1">
      {steps.map((s, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={s} className="flex items-center gap-2">
            <span
              className={cn(
                "h-5 w-5 grid place-items-center rounded-full text-[11px] font-semibold",
                done && "bg-success text-success-foreground",
                active && "bg-primary text-primary-foreground",
                !done && !active && "bg-muted text-muted-foreground",
              )}
            >
              {done ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            <span className={cn("text-[12.5px]", active ? "text-foreground font-medium" : "text-muted-foreground")}>{s}</span>
            {i < steps.length - 1 && <span className="w-6 h-px bg-border" />}
          </div>
        );
      })}
    </div>
  );
}

function StepFooter({
  onBack, onNext, nextLabel = "Next", nextDisabled, backLabel = "Back",
}: StepFooterProps) {
  return (
    <div className="flex items-center justify-end gap-2 mt-4">
      <Button variant="outline" size="sm" onClick={onBack} className="gap-1.5">
        <ArrowLeft className="h-3.5 w-3.5" /> {backLabel}
      </Button>
      <Button size="sm" onClick={onNext} disabled={nextDisabled} className="gap-1.5">
        {nextLabel} <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

/* ---------------- Step 1: Customer ---------------- */
function CustomerStep({
  customers, picked, onPick, onNext, onCancel,
}: CustomerStepProps) {
  const [mode, setMode] = useState<"Code" | "Name">("Code");
  const [q, setQ] = useState("");
  const matches = useMemo(() => {
    if (!q.trim()) return customers.slice(0, 10);
    const term = q.toLowerCase();
    return customers
      .filter((c) => (mode === "Code" ? c.code : c.name).toLowerCase().includes(term))
      .slice(0, 12);
  }, [customers, q, mode]);

  return (
    <EditCard title="Step 1 · Select Customer" description="Search customers by code or name.">
      <div className="flex items-center gap-2 mb-3">
        <div className="inline-flex rounded-md border border-border p-0.5 bg-muted/40">
          {(["Code", "Name"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "px-3 h-7 rounded text-[12.5px]",
                mode === m ? "bg-background shadow-sm font-medium" : "text-muted-foreground",
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => { setQ(e.target.value); onPick(null); }}
            placeholder={mode === "Code" ? "Search by code…" : "Search by name…"}
            className="pl-8 h-8 text-[13px]"
            autoFocus
          />
        </div>
      </div>

      <div className="border border-border rounded-md max-h-72 overflow-auto bg-background">
        {matches.length === 0 && (
          <div className="px-3 py-6 text-center text-[12.5px] text-muted-foreground">No customers found</div>
        )}
        {matches.map((c) => {
          const isPicked = picked?.id === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onPick(c)}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-3 py-2 text-left text-[13px] border-b border-border last:border-b-0",
                isPicked ? "bg-primary/10" : "hover:bg-accent/50",
              )}
            >
              <span className="font-mono w-24 shrink-0">{c.code}</span>
              <span className="flex-1 truncate">{c.name}</span>
              <span className="text-[11.5px] text-muted-foreground">{c.country}</span>
              {isPicked && <Check className="h-4 w-4 text-primary" />}
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="mt-3 rounded-md border border-border bg-accent/30 px-3 py-2 text-[13px]">
          Selected: <span className="font-mono">{picked.code}</span> · <span className="font-medium">{picked.name}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 mt-4">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={onNext} disabled={!picked} className="gap-1.5">
          Confirm <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </EditCard>
  );
}

/* ---------------- Step 2: Orders ---------------- */
function OrdersStep({
  customer, orders, picked, onChange, onBack, onNext,
}: OrdersStepProps) {
  const toggleAll = () => {
    if (picked.size === orders.length) onChange(new Set());
    else onChange(new Set(orders.map((o) => o.id)));
  };
  const toggle = (id: string) => {
    const next = new Set(picked);
    next.has(id) ? next.delete(id) : next.add(id);
    onChange(next);
  };
  const orderTotal = (o: Order) => o.lines.reduce((s, l) => s + l.qty * l.price, 0);

  return (
    <EditCard
      title="Step 2 · Select Orders"
      description={`Orders for ${customer.name} (${customer.code}).`}
    >
      {orders.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-[13px]">
          No orders found for this customer.
        </div>
      ) : (
        <div className="border border-border rounded-md overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-muted/50 text-[11.5px] uppercase text-muted-foreground">
              <tr>
                <th className="w-9 p-2"><Checkbox checked={picked.size === orders.length && orders.length > 0} onCheckedChange={toggleAll} /></th>
                <th className="text-left font-medium p-2">Order Code</th>
                <th className="text-left font-medium p-2">Status</th>
                <th className="text-left font-medium p-2">Written</th>
                <th className="text-right font-medium p-2">Lines</th>
                <th className="text-right font-medium p-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => toggle(o.id)}
                  className={cn(
                    "border-t border-border cursor-pointer hover:bg-accent/40",
                    picked.has(o.id) && "bg-primary/5",
                  )}
                >
                  <td className="p-2"><Checkbox checked={picked.has(o.id)} onCheckedChange={() => toggle(o.id)} /></td>
                  <td className="p-2 font-mono font-medium">{o.code}</td>
                  <td className="p-2"><Pill variant="neutral">{o.status}</Pill></td>
                  <td className="p-2 text-muted-foreground tabular-nums">{o.written}</td>
                  <td className="p-2 text-right tabular-nums">{o.lines.length}</td>
                  <td className="p-2 text-right tabular-nums font-medium">{fmt(orderTotal(o))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-[12px] text-muted-foreground mt-2">{picked.size} order(s) selected</div>

      <StepFooter onBack={onBack} onNext={onNext} nextLabel="Proceed" nextDisabled={picked.size === 0} />
    </EditCard>
  );
}

/* ---------------- Step 3: Validation ---------------- */
function ValidationStep({
  orders, mode, setMode, lineQtys, setLineQtys, onBack, onNext,
}: ValidationStepProps) {
  const validationOptions = [
    { id: "as-ordered" as const, label: "Invoice as ordered", desc: "Use ordered quantities for every line." },
    { id: "outstanding-only" as const, label: "Outstanding only", desc: "Skip lines already invoiced or balanced." },
    { id: "manual" as const, label: "Manual quantities", desc: "Edit each line quantity individually." },
  ] satisfies readonly { id: ValidationMode; label: string; desc: string }[];

  return (
    <>
      <EditCard title="Step 3 · Validate Orders" description="Choose how to invoice the selected orders.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {validationOptions.map((o) => (
            <button
              key={o.id}
              onClick={() => setMode(o.id)}
              className={cn(
                "text-left rounded-md border p-3 transition-colors",
                mode === o.id ? "border-primary bg-primary/5" : "border-border hover:bg-accent/40",
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  "h-4 w-4 rounded-full border grid place-items-center",
                  mode === o.id ? "border-primary bg-primary" : "border-border",
                )}>
                  {mode === o.id && <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
                </span>
                <span className="text-[13px] font-medium">{o.label}</span>
              </div>
              <p className="text-[11.5px] text-muted-foreground leading-relaxed">{o.desc}</p>
            </button>
          ))}
        </div>
      </EditCard>

      <EditCard title="Selected Lines" description="Review and adjust quantities before generating the invoice.">
        <div className="border border-border rounded-md overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-muted/50 text-[11.5px] uppercase text-muted-foreground">
              <tr>
                <th className="text-left font-medium p-2">Order</th>
                <th className="text-left font-medium p-2">Item</th>
                <th className="text-left font-medium p-2">Description</th>
                <th className="text-right font-medium p-2 w-24">Ordered</th>
                <th className="text-right font-medium p-2 w-28">Invoice Qty</th>
                <th className="text-right font-medium p-2 w-24">Price</th>
                <th className="text-right font-medium p-2 w-28">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.flatMap((o) => o.lines.map((l) => {
                const key = `${o.id}:${l.id}`;
                const qty = mode === "manual" ? (lineQtys[key] ?? l.qty) : l.qty;
                return (
                  <tr key={key} className="border-t border-border">
                    <td className="p-2 font-mono text-muted-foreground">{o.code}</td>
                    <td className="p-2 font-mono">{l.itemCode}</td>
                    <td className="p-2 truncate">{l.itemName}</td>
                    <td className="p-2 text-right tabular-nums text-muted-foreground">{l.qty}</td>
                    <td className="p-2 text-right">
                      <Input
                        type="number"
                        value={qty}
                        disabled={mode !== "manual"}
                        onChange={(e) => setLineQtys({ ...lineQtys, [key]: Number(e.target.value) || 0 })}
                        className="h-7 text-right tabular-nums"
                      />
                    </td>
                    <td className="p-2 text-right tabular-nums">{fmt(l.price)}</td>
                    <td className="p-2 text-right tabular-nums font-medium">{fmt(qty * l.price)}</td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
        <StepFooter onBack={onBack} onNext={onNext} nextLabel="Confirm" />
      </EditCard>
    </>
  );
}

/* ---------------- Step 4: Form ---------------- */
function InvoiceFormStep({
  customer, lines, total, onBack, onConfirm,
}: InvoiceFormStepProps) {
  const [form, setForm] = useState({
    refMain: "",
    date: "",
    delvDate: "",
    dueDate: "",
    tranType: "Sale" as const,
    profCentre: "MAIN",
    taxPeriod: "",
    transRef: "",
    auditRef: "",
    agent: customer.agent ?? "",
    commPct: 0,
    vatBand: "Standard",
    ratePct: 20,
    vatCode: "S",
    currency: customer.currency ?? "GBP",
    payTerms: customer.payTerms ?? "30 days net",
    standardDays: customer.standardDays ?? 30,
    settleDays: customer.settleDays ?? 0,
    settleDiscPct: customer.settleDiscount ?? 0,
    bankAcct: customer.bankAcct ?? "",
    comment: "",
  });
  useEffect(() => {
    const today = todayApiDate();
    setForm((f) => ({
      ...f,
      refMain: f.refMain || `INV-${String(Date.now()).slice(-5)}`,
      date: f.date || today,
      delvDate: f.delvDate || today,
      dueDate: f.dueDate || today,
      taxPeriod: f.taxPeriod || today.slice(0, 7),
    }));
  }, []);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const exclusive = +(total / (1 + form.ratePct / 100)).toFixed(2);

  const submit = () => {
    const id = `t_${Date.now()}`;
    onConfirm({
      id,
      refMain: form.refMain,
      kind: "Invoice",
      addrCode: customer.code,
      addrName: customer.name,
      date: form.date,
      invoicedQty: lines.reduce((s, l) => s + l.qty, 0),
      balancedQty: 0,
      lines: lines.length,
      value: total,
      status: "Open",
      tranType: form.tranType,
      profCentre: form.profCentre,
      taxPeriod: form.taxPeriod,
      delvDate: form.delvDate,
      dueDate: form.dueDate,
      transRef: form.transRef,
      auditRef: form.auditRef,
      agent: form.agent,
      commPct: form.commPct,
      vatBand: form.vatBand,
      ratePct: form.ratePct,
      vatCode: form.vatCode,
      comment: form.comment,
      payTerms: form.payTerms,
      currency: form.currency,
      mainCode: customer.code,
      postCode: customer.zip,
      exclusiveValue: exclusive,
      bankAcct: form.bankAcct,
      bankCurrency: form.currency,
      standardDays: form.standardDays,
      settleDays: form.settleDays,
      settleDiscPct: form.settleDiscPct,
      txnLines: lines,
      allocations: [],
    });
  };

  return (
    <>
      <EditCard title="Step 4 · Invoice Details" description="Review the invoice before submission.">
        <FormGrid cols={3}>
          <Field label="Invoice Ref" required>
            <Input value={form.refMain} onChange={(e) => set("refMain", e.target.value)} className="h-8 font-mono" />
          </Field>
          <Field label="Customer">
            <Input value={`${customer.code} · ${customer.name}`} disabled className="h-8" />
          </Field>
          <Field label="Currency">
            <Input value={form.currency} onChange={(e) => set("currency", e.target.value)} className="h-8 font-mono" />
          </Field>
          <Field label="Invoice Date">
            <DateField value={form.date} onChange={(v) => set("date", v ?? "")} className="h-8" />
          </Field>
          <Field label="Delivery Date">
            <DateField value={form.delvDate} onChange={(v) => set("delvDate", v ?? "")} className="h-8" />
          </Field>
          <Field label="Due Date">
            <DateField value={form.dueDate} onChange={(v) => set("dueDate", v ?? "")} className="h-8" />
          </Field>
          <Field label="Profit Centre">
            <Input value={form.profCentre} onChange={(e) => set("profCentre", e.target.value)} className="h-8" />
          </Field>
          <Field label="Tax Period">
            <Input value={form.taxPeriod} onChange={(e) => set("taxPeriod", e.target.value)} className="h-8 font-mono" />
          </Field>
          <Field label="Trans Ref">
            <Input value={form.transRef} onChange={(e) => set("transRef", e.target.value)} className="h-8 font-mono" />
          </Field>
        </FormGrid>
      </EditCard>

      <EditCard title="VAT & Agent">
        <FormGrid cols={3}>
          <Field label="VAT Band">
            <select value={form.vatBand} onChange={(e) => set("vatBand", e.target.value)} className="h-8 px-2 rounded border border-border bg-background text-[13px]">
              <option>Standard</option><option>Reduced</option><option>Zero</option>
            </select>
          </Field>
          <Field label="VAT Code">
            <Input value={form.vatCode} onChange={(e) => set("vatCode", e.target.value)} className="h-8 font-mono" />
          </Field>
          <Field label="Rate %">
            <Input type="number" value={form.ratePct} onChange={(e) => set("ratePct", Number(e.target.value))} className="h-8 text-right tabular-nums" />
          </Field>
          <Field label="Agent">
            <Input value={form.agent} onChange={(e) => set("agent", e.target.value)} className="h-8" />
          </Field>
          <Field label="Comm %">
            <Input type="number" step="0.01" value={form.commPct} onChange={(e) => set("commPct", Number(e.target.value))} className="h-8 text-right tabular-nums" />
          </Field>
          <Field label="Audit Ref">
            <Input value={form.auditRef} onChange={(e) => set("auditRef", e.target.value)} className="h-8 font-mono" />
          </Field>
        </FormGrid>
      </EditCard>

      <EditCard title="Payment Terms">
        <FormGrid cols={3}>
          <Field label="Pay Terms"><Input value={form.payTerms} onChange={(e) => set("payTerms", e.target.value)} className="h-8" /></Field>
          <Field label="Standard Days"><Input type="number" value={form.standardDays} onChange={(e) => set("standardDays", Number(e.target.value))} className="h-8 text-right tabular-nums" /></Field>
          <Field label="Settle Days"><Input type="number" value={form.settleDays} onChange={(e) => set("settleDays", Number(e.target.value))} className="h-8 text-right tabular-nums" /></Field>
          <Field label="Settle Disc %"><Input type="number" step="0.01" value={form.settleDiscPct} onChange={(e) => set("settleDiscPct", Number(e.target.value))} className="h-8 text-right tabular-nums" /></Field>
          <Field label="Bank Account"><Input value={form.bankAcct} onChange={(e) => set("bankAcct", e.target.value)} className="h-8" /></Field>
        </FormGrid>
      </EditCard>

      <EditCard
        title="Line Items"
        description={`${lines.length} line(s) included.`}
        footer={
          <div className="flex items-center justify-end gap-6 text-[13px]">
            <span className="text-muted-foreground">Exclusive <span className="text-foreground tabular-nums font-medium ml-1">{fmt(exclusive)}</span></span>
            <span className="text-muted-foreground">VAT <span className="text-foreground tabular-nums font-medium ml-1">{fmt(total - exclusive)}</span></span>
            <span className="text-muted-foreground">Total <span className="text-foreground tabular-nums font-semibold ml-1">{fmt(total)}</span></span>
          </div>
        }
      >
        <table className="w-full text-[13px]">
          <thead className="text-[11.5px] uppercase text-muted-foreground border-b border-border">
            <tr>
              <th className="text-left font-medium pb-1.5 w-28">Code</th>
              <th className="text-left font-medium pb-1.5">Description</th>
              <th className="text-right font-medium pb-1.5 w-20">Qty</th>
              <th className="text-right font-medium pb-1.5 w-24">Price</th>
              <th className="text-right font-medium pb-1.5 w-24">Total</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.id} className="border-b border-border/60">
                <td className="py-1.5 font-mono">{l.itemCode}</td>
                <td className="py-1.5">{l.description}</td>
                <td className="py-1.5 text-right tabular-nums">{l.qty}</td>
                <td className="py-1.5 text-right tabular-nums">{fmt(l.price)}</td>
                <td className="py-1.5 text-right tabular-nums font-medium">{fmt(l.qty * l.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </EditCard>

      <EditCard title="Comment">
        <textarea
          className="w-full min-h-[70px] p-2 rounded-md border border-border bg-background text-[13px] resize-y"
          value={form.comment}
          onChange={(e) => set("comment", e.target.value)}
          placeholder="Optional comment…"
        />
      </EditCard>

      <div className="flex items-center justify-end gap-2 mt-2">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Button>
        <Button size="sm" onClick={submit} className="gap-1.5">
          <Save className="h-3.5 w-3.5" /> Save Invoice
        </Button>
      </div>
    </>
  );
}
