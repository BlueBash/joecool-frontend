import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { Trash2, Save, Plus, Printer, Mail } from "lucide-react";
import { useOrders, useStocks } from "@/store";
import { EditScreen, EditCard } from "@/components/edit-screen";
import { Field, FormGrid } from "@/components/form-primitives";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/pill";
import { CopyableCode } from "@/components/app-shell";
import { InlineNumber } from "@/components/inline-edit";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { toast } from "sonner";
import type { Order, OrderStatus, OrderKind, OrderLineUpdate } from "@/lib/types";
import { firstFormErrorMessage, useEntityForm } from "@/lib/form";
import { OrderFormSchema, type OrderFormValues } from "./order-form-schema";

const routeApi = getRouteApi("/order/$id");

const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

const TXT = "h-8 text-[13px]";
const NUM = "h-8 tabular-nums text-[13px]";

const ORDER_EDIT_TABS = [
  ["header", "Order Header"], ["address", "Order Address"], ["ship", "Ship And Pay"],
  ["items", "Items List"], ["summary", "Item Summary"], ["notes", "Notes"],
  ["messages", "Messages"], ["ledger", "Live Ledger"], ["sheet", "Spreadsheet"],
] as const satisfies readonly (readonly [string, string])[];

export function OrderEditPage() {
  const { id } = routeApi.useParams();
  const nav = useNavigate();
  const { items, update, remove } = useOrders();
  const stocks = useStocks(s => s.items);
  const item = items.find(i => i.id === id);
  const [lineCode, setLineCode] = useState("");

  const form = useEntityForm<OrderFormValues>({
    schema: OrderFormSchema,
    defaultValues: item ?? ({} as Order),
    resetValues: item ?? null,
    resetKey: id,
  });

  const { watch, setValue, handleSubmit, isDirty, isSubmitting } = form;
  const draft = watch();

  const deleteConfirm = useDeleteConfirm<{ id: string }>({
    onConfirm: async ({ id }) => {
      remove(id);
      toast.success("Removed");
      nav({ to: "/orders" });
    },
  });

  if (!item || !draft?.id) {
    return (
      <EditScreen backTo="/orders" title="Order not found">
        <p className="text-muted-foreground text-[13px]">This order may have been deleted.</p>
      </EditScreen>
    );
  }

  const set = <K extends keyof Order>(k: K, v: Order[K]) =>
    setValue(k as keyof OrderFormValues, v as never, { shouldDirty: true, shouldTouch: true });
  const totalQty = draft.lines.reduce((s, l) => s + l.qty, 0);
  const totalVal = draft.lines.reduce((s, l) => s + l.qty * l.price, 0);

  const updateLine = (lineId: string, patch: OrderLineUpdate) =>
    set("lines", draft.lines.map(l => l.id === lineId ? { ...l, ...patch } : l));
  const removeLine = (lineId: string) => set("lines", draft.lines.filter(l => l.id !== lineId));
  const addLine = () => {
    const code = lineCode.toUpperCase();
    const stk = stocks.find(s => s.code === code);
    if (!stk) { toast.error("Stock code not found"); return; }
    set("lines", [...draft.lines, { id: `ol_${Date.now()}`, itemCode: stk.code, itemName: stk.title, qty: 1, price: stk.sellingPrice, per: 1 }]);
    setLineCode("");
  };

  const save = handleSubmit(
    (values) => {
      update(item.id, values);
      toast.success("Order saved");
      nav({ to: "/orders" });
    },
    (errors) => {
      toast.error(firstFormErrorMessage(errors) ?? "Please fix the highlighted fields");
    },
  );
  const onDelete = () => {
    deleteConfirm.requestDelete({
      title: "Delete order",
      entityName: draft.code,
      entityType: "order",
      meta: { id: item.id },
    });
  };

  return (
    <FormProvider {...form}>
    <DeleteConfirmDialog state={deleteConfirm} />
    <EditScreen
      backTo="/orders"
      backLabel="Back to Orders"
      title={`Order ${draft.code}`}
      subtitle={<span>{draft.addrName} · <CopyableCode value={draft.addrCode} /></span>}
      badges={
        <>
          <Pill variant={draft.addrType === "Supplier" ? "info" : "primary"}>{draft.addrType}</Pill>
          <Pill variant={draft.status === "Shipped" ? "success" : draft.status === "Cancelled" ? "danger" : draft.status === "Confirmed" ? "info" : "neutral"}>{draft.status}</Pill>
        </>
      }
      actions={
        <>
          <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => toast.success("Print job sent")}><Printer className="h-3.5 w-3.5" /> Print</Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => toast.success("Email sent")}><Mail className="h-3.5 w-3.5" /> Email</Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-destructive hover:text-destructive" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
          <Button size="sm" className="h-8 gap-1.5" onClick={save} disabled={isSubmitting || !isDirty}><Save className="h-3.5 w-3.5" /> Save</Button>
        </>
      }
    >
      {/* Identity strip */}
      <EditCard title="Identity">
        <FormGrid cols={3}>
          <Field label="Log Ref"><Input value={draft.logRef} onChange={e => set("logRef", e.target.value)} className={`${TXT} font-mono`} /></Field>
          <Field label="Name"><Input value={draft.addrName} onChange={e => set("addrName", e.target.value)} className={TXT} /></Field>
          <Field label="Code"><Input value={draft.code} onChange={e => set("code", e.target.value)} className={`${TXT} font-mono`} /></Field>
        </FormGrid>
      </EditCard>

      <Tabs defaultValue="header" className="w-full">
        <TabsList className="bg-transparent p-0 h-auto border-b border-border rounded-none w-full justify-start gap-1 flex-wrap">
          {ORDER_EDIT_TABS.map(([v, l]) => (
            <TabsTrigger key={v} value={v}
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3 h-9 text-[13px]"
            >{l}</TabsTrigger>
          ))}
        </TabsList>

        {/* ORDER HEADER */}
        <TabsContent value="header" className="mt-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <EditCard title="References">
              <FormGrid cols={2}>
                <Field label="Log Ref"><Input value={draft.logRef} onChange={e => set("logRef", e.target.value)} className={`${TXT} font-mono`} /></Field>
                <Field label="Our Ref"><Input value={draft.ourRef ?? ""} onChange={e => set("ourRef", e.target.value)} className={`${TXT} font-mono`} /></Field>
                <Field label="Their Ref"><Input value={draft.theirRef ?? ""} onChange={e => set("theirRef", e.target.value)} className={`${TXT} font-mono`} /></Field>
                <Field label="Order Kind">
                  <select value={draft.kind} onChange={e => set("kind", e.target.value as OrderKind)} className="h-8 px-2 rounded border border-border bg-background text-[13px]">
                    <option>REGULAR</option><option>SAMPLE</option><option>BACKORDER</option>
                  </select>
                </Field>
                <Field label="Status">
                  <select value={draft.status} onChange={e => set("status", e.target.value as OrderStatus)} className="h-8 px-2 rounded border border-border bg-background text-[13px]">
                    <option>Draft</option><option>Confirmed</option><option>Shipped</option><option>Cancelled</option>
                  </select>
                </Field>
              </FormGrid>
              <div className="mt-3 flex items-center gap-4">
                <label className="inline-flex items-center gap-2 text-[13px]">
                  <input type="checkbox" checked={!!draft.confirmed} onChange={e => set("confirmed", e.target.checked)} className="h-3.5 w-3.5" />
                  Confirmed
                </label>
                <label className="inline-flex items-center gap-2 text-[13px]">
                  <input type="checkbox" checked={!!draft.allowAllocs} onChange={e => set("allowAllocs", e.target.checked)} className="h-3.5 w-3.5" />
                  Allow Allocs
                </label>
              </div>
            </EditCard>

            <EditCard title="Venues & People">
              <FormGrid cols={2}>
                <Field label="Venues"><Input value={draft.venues ?? ""} onChange={e => set("venues", e.target.value)} className={TXT} /></Field>
                <Field label="Centre"><Input value={draft.centre ?? ""} onChange={e => set("centre", e.target.value)} className={TXT} /></Field>
                <Field label="Select an A/C Manager"><Input value={draft.selectAcManager ?? ""} onChange={e => set("selectAcManager", e.target.value)} className={TXT} /></Field>
                <Field label="Inputer"><Input value={draft.inputer ?? ""} onChange={e => set("inputer", e.target.value)} className={TXT} /></Field>
                <Field label="Agent"><Input value={draft.agent ?? ""} onChange={e => set("agent", e.target.value)} className={TXT} /></Field>
                <Field label="Comm Rate"><Input type="number" value={draft.agentCommRate ?? ""} onChange={e => set("agentCommRate", Number(e.target.value))} className={NUM} /></Field>
                <Field label="Author"><Input value={draft.author ?? ""} onChange={e => set("author", e.target.value)} className={TXT} /></Field>
                <Field label="Comm Rate"><Input type="number" value={draft.authorCommRate ?? ""} onChange={e => set("authorCommRate", Number(e.target.value))} className={NUM} /></Field>
                <Field label="Source"><Input value={draft.source ?? ""} onChange={e => set("source", e.target.value)} className={TXT} /></Field>
                <Field label="Comm Rate"><Input type="number" value={draft.sourceCommRate ?? ""} onChange={e => set("sourceCommRate", Number(e.target.value))} className={NUM} /></Field>
              </FormGrid>
            </EditCard>

            <EditCard title="Environment & Pricing">
              <FormGrid cols={2}>
                <Field label="Inv Environment"><Input value={draft.invEnvironment ?? ""} onChange={e => set("invEnvironment", e.target.value)} className={TXT} /></Field>
                <Field label="Cost Code"><Input value={draft.costCode ?? ""} onChange={e => set("costCode", e.target.value)} className={TXT} /></Field>
                <Field label="Currency"><Input value={draft.currency ?? ""} onChange={e => set("currency", e.target.value)} className={TXT} /></Field>
                <Field label="VAT Kind"><Input value={draft.vatKind ?? ""} onChange={e => set("vatKind", e.target.value)} className={TXT} /></Field>
                <Field label="Price"><Input value={draft.price ?? ""} onChange={e => set("price", e.target.value)} className={TXT} /></Field>
                <Field label="VAT Rate Code"><Input value={draft.vatRateCode ?? ""} onChange={e => set("vatRateCode", e.target.value)} className={TXT} /></Field>
              </FormGrid>
            </EditCard>
          </div>

          <EditCard title="Dates & Charges">
            <FormGrid cols={4}>
              <Field label="Date Written"><Input type="date" value={draft.written} onChange={e => set("written", e.target.value)} className={TXT} /></Field>
              <Field label="Date Lodged"><Input type="date" value={draft.dateLodged ?? ""} onChange={e => set("dateLodged", e.target.value)} className={TXT} /></Field>
              <Field label="Date Ship"><Input type="date" value={draft.ship} onChange={e => set("ship", e.target.value)} className={TXT} /></Field>
              <Field label="Date Cancel"><Input type="date" value={draft.cancel} onChange={e => set("cancel", e.target.value)} className={TXT} /></Field>
              <Field label="Date Expect"><Input type="date" value={draft.dateExpect ?? ""} onChange={e => set("dateExpect", e.target.value)} className={TXT} /></Field>
              <Field label="Date Delivery First"><Input type="date" value={draft.dateDeliveryFirst ?? ""} onChange={e => set("dateDeliveryFirst", e.target.value)} className={TXT} /></Field>
              <Field label="Date Delivery Last"><Input type="date" value={draft.dateDeliveryLast ?? ""} onChange={e => set("dateDeliveryLast", e.target.value)} className={TXT} /></Field>
              <Field label="Date Pickup First"><Input type="date" value={draft.datePickupFirst ?? ""} onChange={e => set("datePickupFirst", e.target.value)} className={TXT} /></Field>
              <Field label="Date Pickup Last"><Input type="date" value={draft.datePickupLast ?? ""} onChange={e => set("datePickupLast", e.target.value)} className={TXT} /></Field>
              <Field label="Date Invoice First"><Input type="date" value={draft.dateInvoiceFirst ?? ""} onChange={e => set("dateInvoiceFirst", e.target.value)} className={TXT} /></Field>
              <Field label="Date Invoice Last"><Input type="date" value={draft.dateInvoiceLast ?? ""} onChange={e => set("dateInvoiceLast", e.target.value)} className={TXT} /></Field>
              <Field label="Priority">
                <select value={draft.priority ?? "Normal"} onChange={e => set("priority", e.target.value)} className="h-8 px-2 rounded border border-border bg-background text-[13px]">
                  <option>Low</option><option>Normal</option><option>High</option><option>Urgent</option>
                </select>
              </Field>
              <Field label="FOB Charge"><Input type="number" value={draft.fobCharge ?? ""} onChange={e => set("fobCharge", Number(e.target.value))} className={NUM} /></Field>
              <Field label="Discount Overall"><Input type="number" value={draft.discountOverall ?? ""} onChange={e => set("discountOverall", Number(e.target.value))} className={NUM} /></Field>
              <Field label="Discount Items"><Input type="number" value={draft.discountItems ?? ""} onChange={e => set("discountItems", Number(e.target.value))} className={NUM} /></Field>
              <Field label="Barcode Source"><Input value={draft.barcodeSource ?? ""} onChange={e => set("barcodeSource", e.target.value)} className={TXT} /></Field>
              <Field label="Language"><Input value={draft.language ?? "English"} onChange={e => set("language", e.target.value)} className={TXT} /></Field>
            </FormGrid>
          </EditCard>
        </TabsContent>

        {/* ORDER ADDRESS */}
        <TabsContent value="address" className="mt-3">
          <EditCard title="Buyer">
            <FormGrid cols={4}>
              <Field label="VAT Reg No"><Input value={draft.vatRegNo ?? ""} onChange={e => set("vatRegNo", e.target.value)} className={`${TXT} font-mono`} /></Field>
              <Field label="Email"><Input type="email" value={draft.email ?? ""} onChange={e => set("email", e.target.value)} className={TXT} /></Field>
              <Field label="Buyer Name"><Input value={draft.buyerName ?? ""} onChange={e => set("buyerName", e.target.value)} className={TXT} /></Field>
              <Field label="Category"><Input value={draft.category ?? ""} onChange={e => set("category", e.target.value)} className={TXT} /></Field>
            </FormGrid>
          </EditCard>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditCard title="Invoice Address">
              <Field label="Inv Address Code">
                <Input value={draft.invAddressCode ?? draft.addrCode} onChange={e => set("invAddressCode", e.target.value)} className={`${TXT} font-mono`} />
              </Field>
            </EditCard>
            <EditCard title="Delivery Address">
              <Field label="Delivery Address Code">
                <Input value={draft.delAddressCode ?? draft.addrCode} onChange={e => set("delAddressCode", e.target.value)} className={`${TXT} font-mono`} />
              </Field>
            </EditCard>
          </div>
        </TabsContent>

        {/* SHIP & PAY */}
        <TabsContent value="ship" className="mt-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditCard title="Shipping">
              <FormGrid cols={2}>
                <Field label="Ship From"><Input value={draft.shipFrom ?? ""} onChange={e => set("shipFrom", e.target.value)} className={TXT} /></Field>
                <Field label="Ship Method"><Input value={draft.shipMethod ?? ""} onChange={e => set("shipMethod", e.target.value)} className={TXT} /></Field>
                <Field label="Ship Charging"><Input value={draft.shipCharging ?? ""} onChange={e => set("shipCharging", e.target.value)} className={TXT} /></Field>
                <Field label="Charge"><Input type="number" value={draft.charge ?? 0} onChange={e => set("charge", Number(e.target.value))} className={NUM} /></Field>
                <Field label="Transit Days"><Input type="number" value={draft.transitDays ?? 0} onChange={e => set("transitDays", Number(e.target.value))} className={NUM} /></Field>
              </FormGrid>
            </EditCard>
            <EditCard title="Payment">
              <FormGrid cols={2}>
                <Field label="Pay Method"><Input value={draft.payMethod ?? ""} onChange={e => set("payMethod", e.target.value)} className={TXT} /></Field>
                <Field label="Pay Terms"><Input value={draft.payTerms ?? ""} onChange={e => set("payTerms", e.target.value)} className={TXT} /></Field>
                <Field label="Bank Acct"><Input value={draft.bankAcct ?? ""} onChange={e => set("bankAcct", e.target.value)} className={`${TXT} font-mono`} /></Field>
                <Field label="Standard Days"><Input type="number" value={draft.standardDays ?? 0} onChange={e => set("standardDays", Number(e.target.value))} className={NUM} /></Field>
                <Field label="Settle Days"><Input type="number" value={draft.settleDays ?? 0} onChange={e => set("settleDays", Number(e.target.value))} className={NUM} /></Field>
                <Field label="Settle Disc%"><Input type="number" value={draft.settleDiscPct ?? 0} onChange={e => set("settleDiscPct", Number(e.target.value))} className={NUM} /></Field>
                <Field label="Pay Status">
                  <select value={draft.payStatus ?? "Unpaid"} onChange={e => set("payStatus", e.target.value)} className="h-8 px-2 rounded border border-border bg-background text-[13px]">
                    <option>Unpaid</option><option>Partial</option><option>Paid</option>
                  </select>
                </Field>
              </FormGrid>
            </EditCard>
          </div>
        </TabsContent>

        {/* ITEMS */}
        <TabsContent value="items" className="mt-3">
          <EditCard
            title="Items"
            description="Line items in this order."
            footer={
              <div className="flex items-center justify-end gap-6 text-[13px]">
                <span className="text-muted-foreground">Total Qty <span className="text-foreground tabular-nums font-medium ml-1">{totalQty}</span></span>
                <span className="text-muted-foreground">Total Value <span className="text-foreground tabular-nums font-semibold ml-1">{fmt(totalVal)}</span></span>
              </div>
            }
          >
            <div className="flex items-center gap-2 mb-3">
              <Plus className="h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Stock code (e.g. JC66501)"
                value={lineCode}
                onChange={e => setLineCode(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addLine(); }}
                className="h-8 max-w-[260px] text-[13px] font-mono"
              />
              <Button size="sm" className="h-8" onClick={addLine}>Add Line</Button>
            </div>
            <table className="w-full text-[13px]">
              <thead className="text-[11.5px] uppercase text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left font-medium pb-1.5">Code</th>
                  <th className="text-left font-medium pb-1.5">Item</th>
                  <th className="text-right font-medium pb-1.5 w-20">Qty</th>
                  <th className="text-right font-medium pb-1.5 w-24">Price</th>
                  <th className="text-right font-medium pb-1.5 w-24">Total</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {draft.lines.map(line => (
                  <tr key={line.id} className="border-b border-border/60 group">
                    <td className="py-1.5"><CopyableCode value={line.itemCode} /></td>
                    <td className="py-1.5 truncate max-w-[260px]">{line.itemName}</td>
                    <td className="py-1.5 text-right"><InlineNumber value={line.qty} onSave={v => updateLine(line.id, { qty: v })} /></td>
                    <td className="py-1.5 text-right"><InlineNumber value={line.price} onSave={v => updateLine(line.id, { price: v })} /></td>
                    <td className="py-1.5 text-right tabular-nums font-medium">{fmt(line.qty * line.price)}</td>
                    <td className="py-1.5 text-right">
                      <button onClick={() => removeLine(line.id)} className="text-muted-foreground hover:text-destructive p-1">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {draft.lines.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-6 text-muted-foreground text-[12.5px]">No items yet — add one above.</td></tr>
                )}
              </tbody>
            </table>
          </EditCard>
        </TabsContent>

        {/* ITEM SUMMARY */}
        <TabsContent value="summary" className="mt-3">
          <EditCard title="Item Summary">
            <div className="flex items-end justify-between gap-3 mb-3">
              <Field label="Exch Rate" className="max-w-[160px]">
                <Input type="number" step="0.01" value={draft.exchRate ?? 1} onChange={e => set("exchRate", Number(e.target.value))} className={NUM} />
              </Field>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px] border-collapse">
                <thead>
                  <tr className="text-muted-foreground border-b border-border">
                    <th className="text-left font-medium py-1.5 pr-3"></th>
                    {["Lines","Qntys","Curr Values","GBP Values","Wght (gm)","Vol (cc)"].map(h => (
                      <th key={h} className="text-right font-medium py-1.5 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Original", draft.lines.length, totalQty, totalVal],
                    ["Balance", draft.lines.length, totalQty, totalVal],
                    ["Allocated", 0, 0, 0],
                    ["Invoiced", 0, 0, 0],
                    ["Dropped", 0, 0, 0],
                    ["Picked", 0, 0, 0],
                  ].map(([row, l, q, v]) => (
                    <tr key={row as string} className="border-b border-border/60">
                      <td className="py-1.5 pr-3 font-medium">{row}</td>
                      <td className="py-1.5 px-3 text-right tabular-nums">{l}</td>
                      <td className="py-1.5 px-3 text-right tabular-nums">{q}</td>
                      <td className="py-1.5 px-3 text-right tabular-nums">{(v as number).toFixed(2)}</td>
                      <td className="py-1.5 px-3 text-right tabular-nums">{((v as number) * (draft.exchRate ?? 1) * 0.78).toFixed(2)}</td>
                      <td className="py-1.5 px-3 text-right tabular-nums">0.00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </EditCard>
        </TabsContent>

        {/* NOTES */}
        <TabsContent value="notes" className="mt-3">
          <EditCard title="Notes">
            <textarea
              className="w-full min-h-[160px] p-2 rounded-md border border-border bg-background text-[13px] resize-y"
              value={draft.notes ?? ""}
              onChange={e => set("notes", e.target.value)}
            />
          </EditCard>
        </TabsContent>

        {/* MESSAGES */}
        <TabsContent value="messages" className="mt-3">
          <EditCard title="Messages">
            <textarea
              className="w-full min-h-[160px] p-2 rounded-md border border-border bg-background text-[13px] resize-y"
              value={draft.messages ?? ""}
              onChange={e => set("messages", e.target.value)}
              placeholder="Internal/customer messages…"
            />
          </EditCard>
        </TabsContent>

        {/* LIVE LEDGER */}
        <TabsContent value="ledger" className="mt-3">
          <EditCard title="Live Ledger">
            <table className="w-full text-[13px]">
              <thead className="text-[11.5px] uppercase text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left font-medium pb-1.5">Type</th>
                  <th className="text-left font-medium pb-1.5">Ref Main</th>
                  <th className="text-right font-medium pb-1.5">Value Total</th>
                  <th className="text-right font-medium pb-1.5">Value Exclusive</th>
                  <th className="text-right font-medium pb-1.5">Settle Days</th>
                  <th className="text-left font-medium pb-1.5">Lodged Date</th>
                  <th className="text-left font-medium pb-1.5">Complete</th>
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan={7} className="text-center py-8 text-muted-foreground text-[12.5px]">No ledger entries.</td></tr>
              </tbody>
            </table>
          </EditCard>
        </TabsContent>

        {/* SPREADSHEET */}
        <TabsContent value="sheet" className="mt-3">
          <EditCard title="Spreadsheet Export" description="Pick months and fields to export.">
            <p className="text-[13px] text-muted-foreground">Export configuration available — contact admin to enable.</p>
          </EditCard>
        </TabsContent>
      </Tabs>
    </EditScreen>
    </FormProvider>
  );
}
