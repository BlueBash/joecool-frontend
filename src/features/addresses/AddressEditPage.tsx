import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Save } from "lucide-react";
import { useAddresses } from "@/store";
import { EditScreen, EditCard, StickyFormFooter } from "@/components/edit-screen";
import { Field, FormGrid } from "@/components/form-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Pill } from "@/components/pill";
import { toast } from "sonner";
import type { Address, AddressType, AddressFlags } from "@/lib/types";

const routeApi = getRouteApi("/address/$id");

type AddressFlagToggleRow = { key: keyof AddressFlags; label: string };

const FLAGS_LEFT = [
  { key: "flag1", label: "Flag 1" }, { key: "flag2", label: "Flag 2" }, { key: "flag3", label: "Flag 3" },
  { key: "stop", label: "Stop" }, { key: "bad", label: "Bad" }, { key: "shop", label: "Shop" },
  { key: "ownShop", label: "Own Shop" }, { key: "apOnly", label: "AP Only" }, { key: "salesLead", label: "Sales Lead" },
] satisfies AddressFlagToggleRow[];
const FLAGS_RIGHT = [
  { key: "statement", label: "Statement" }, { key: "whlslEmailShots", label: "Whlsl EMail Shots" },
  { key: "reorderPrompts", label: "Re-Order Prompts" }, { key: "orderBalnsPrint", label: "Order Balns Print" },
  { key: "lateOrderSheet", label: "Late Order Sheet" }, { key: "allowOverdue", label: "Allow Overdue" },
  { key: "bestSellerConsider", label: "Best Seller Consider" }, { key: "customsInvoice", label: "Customs Invoice" },
] satisfies AddressFlagToggleRow[];

const ADDRESS_EDIT_TABS = [
  ["address", "Address"], ["contact", "Contact"], ["terms", "Terms"],
  ["flags", "Flags & Agent"], ["notes", "Notes"], ["order", "Order"],
  ["turnover", "Turnover & History"], ["cost", "Cost Factor"],
] as const satisfies readonly (readonly [string, string])[];

function blankAddress(): Address {
  return {
    id: `a_${Date.now()}`, code: "", name: "", type: "Customer",
    address1: "", town: "", country: "",
  };
}

export function AddressEditPage() {
  const { id } = routeApi.useParams();
  const nav = useNavigate();
  const { items, add, update, remove } = useAddresses();
  const isNew = id === "new";
  const item = isNew ? undefined : items.find(i => i.id === id);
  const [draft, setDraft] = useState<Address | undefined>(isNew ? blankAddress() : item);

  if (!isNew && (!item || !draft)) {
    return (
      <EditScreen backTo="/addresses" title="Address not found">
        <p className="text-muted-foreground text-[13px]">This address may have been deleted.</p>
      </EditScreen>
    );
  }
  if (!draft) return null;

  const set = <K extends keyof Address>(k: K, v: Address[K]) => setDraft(d => ({ ...(d as Address), [k]: v }));
  const setFlag = (k: keyof AddressFlags, v: boolean) =>
    setDraft(d => ({ ...(d as Address), flags: { ...(d as Address).flags, [k]: v } }));

  const save = () => {
    if (!draft.code || !draft.name) { toast.error("Code and Name are required"); return; }
    if (isNew) { add(draft); toast.success("Address created"); }
    else { update(draft.id, draft); toast.success("Address saved"); }
    nav({ to: "/addresses" });
  };
  const onDelete = () => { if (isNew) { nav({ to: "/addresses" }); return; } remove(draft.id); toast.success("Removed"); nav({ to: "/addresses" }); };

  const f = draft.flags ?? {};

  return (
    <EditScreen
      backTo="/addresses"
      backLabel="Back to Addresses"
      title={isNew ? "New Address" : (draft.name || draft.code)}
      badges={<Pill variant={draft.type === "Supplier" ? "info" : "primary"}>{draft.type}</Pill>}
      actions={
        <>
          {!isNew && (
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-destructive hover:text-destructive" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          )}
          <Button size="sm" className="h-8 gap-1.5" onClick={save}><Save className="h-3.5 w-3.5" /> {isNew ? "Create" : "Save"}</Button>
        </>
      }
    >
      {/* Header identity strip */}
      <EditCard title="Identity">
        <FormGrid cols={4}>
          <Field label="Kind">
            <select value={draft.type} onChange={e => set("type", e.target.value as AddressType)} className="h-8 px-2 rounded border border-border bg-background text-[13px]">
              <option>Customer</option>
              <option>Supplier</option>
            </select>
          </Field>
          <Field label="Code" required><Input value={draft.code} onChange={e => set("code", e.target.value)} className="h-8 font-mono" /></Field>
          <Field label="Name" required><Input value={draft.name} onChange={e => set("name", e.target.value)} className="h-8" /></Field>
          <Field label="Created"><Input type="date" value={draft.created ?? ""} onChange={e => set("created", e.target.value)} className="h-8" /></Field>
        </FormGrid>
      </EditCard>

      <Tabs defaultValue="address" className="w-full">
        <TabsList className="bg-transparent p-0 h-auto border-b border-border rounded-none w-full justify-start gap-1">
          {ADDRESS_EDIT_TABS.map(([v, l]) => (
            <TabsTrigger key={v} value={v}
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3 h-9 text-[13px]"
            >{l}</TabsTrigger>
          ))}
        </TabsList>

        {/* ADDRESS */}
        <TabsContent value="address" className="mt-3">
          <EditCard title="Address">
            <FormGrid cols={2}>
              <Field label="Address Line 1"><Input value={draft.address1} onChange={e => set("address1", e.target.value)} className="h-8" /></Field>
              <Field label="Address Line 2"><Input value={draft.address2 ?? ""} onChange={e => set("address2", e.target.value)} className="h-8" /></Field>
              <Field label="Region"><Input value={draft.region ?? ""} onChange={e => set("region", e.target.value)} className="h-8" /></Field>
              <Field label="Town"><Input value={draft.town} onChange={e => set("town", e.target.value)} className="h-8" /></Field>
              <Field label="State/County"><Input value={draft.region ?? ""} onChange={e => set("region", e.target.value)} className="h-8" /></Field>
              <Field label="Zip/Post Code"><Input value={draft.zip ?? ""} onChange={e => set("zip", e.target.value)} className="h-8 font-mono" /></Field>
              <Field label="Website"><Input value={draft.website ?? ""} onChange={e => set("website", e.target.value)} className="h-8" /></Field>
              <div className="grid grid-cols-[1fr_120px] gap-2">
                <Field label="Category"><Input value={draft.category ?? ""} onChange={e => set("category", e.target.value)} className="h-8" /></Field>
                <Field label="Code"><Input value={draft.categoryCode ?? ""} onChange={e => set("categoryCode", e.target.value)} className="h-8 font-mono" /></Field>
              </div>
              <Field label="Country"><Input value={draft.country} onChange={e => set("country", e.target.value)} className="h-8" /></Field>
              <div className="grid grid-cols-[1fr_120px] gap-2">
                <Field label="Area"><Input value={draft.area ?? ""} onChange={e => set("area", e.target.value)} className="h-8" /></Field>
                <Field label="Code"><Input value={draft.areaCode ?? ""} onChange={e => set("areaCode", e.target.value)} className="h-8 font-mono" /></Field>
              </div>
            </FormGrid>
          </EditCard>
          <EditCard title="Delivery Account">
            <Field label="Delivery Account">
              <Input value={draft.deliveryAccount ?? ""} onChange={e => set("deliveryAccount", e.target.value)} className="h-8" />
            </Field>
          </EditCard>
        </TabsContent>

        {/* CONTACT */}
        <TabsContent value="contact" className="mt-3">
          <EditCard title="Contact">
            <FormGrid cols={3}>
              <Field label="Contact Name"><Input value={draft.contact ?? ""} onChange={e => set("contact", e.target.value)} className="h-8" /></Field>
              <Field label="Email"><Input type="email" value={draft.email ?? ""} onChange={e => set("email", e.target.value)} className="h-8" /></Field>
              <Field label="Phone"><Input value={draft.phone ?? ""} onChange={e => set("phone", e.target.value)} className="h-8 font-mono" /></Field>
            </FormGrid>
          </EditCard>
        </TabsContent>

        {/* TERMS */}
        <TabsContent value="terms" className="mt-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <EditCard title="Invoicing">
                <FormGrid cols={2}>
                  <Field label="Invoice Env"><Input value={draft.invoiceEnv ?? ""} onChange={e => set("invoiceEnv", e.target.value)} className="h-8" /></Field>
                  <Field label="Credit Env"><Input value={draft.creditEnv ?? ""} onChange={e => set("creditEnv", e.target.value)} className="h-8" /></Field>
                  <Field label="Currency"><Input value={draft.currency ?? ""} onChange={e => set("currency", e.target.value)} className="h-8" /></Field>
                  <Field label="Price"><Input value={draft.priceCategory ?? ""} onChange={e => set("priceCategory", e.target.value)} className="h-8" /></Field>
                  <Field label="Cost Code"><Input value={draft.costCode ?? ""} onChange={e => set("costCode", e.target.value)} className="h-8" /></Field>
                  <Field label="FOB Factor"><Input value={draft.fobFactor ?? ""} onChange={e => set("fobFactor", e.target.value)} className="h-8" /></Field>
                  <Field label="Overall(Inv) Dsc%"><Input type="number" value={draft.overallInvDscPct ?? ""} onChange={e => set("overallInvDscPct", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                  <Field label="Whlsl (Item) Dsc%"><Input type="number" value={draft.whlslItemDscPct ?? ""} onChange={e => set("whlslItemDscPct", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                  <Field label="Vat Reg"><Input value={draft.vatReg ?? ""} onChange={e => set("vatReg", e.target.value)} className="h-8" /></Field>
                  <Field label="Vat Kind"><Input value={draft.vatKind ?? ""} onChange={e => set("vatKind", e.target.value)} className="h-8" /></Field>
                  <Field label="Order Kind"><Input value={draft.orderKind ?? ""} onChange={e => set("orderKind", e.target.value)} className="h-8" /></Field>
                  <Field label="Vat Rate"><Input value={draft.vatRate ?? ""} onChange={e => set("vatRate", e.target.value)} className="h-8" /></Field>
                  <Field label="Language"><Input value={draft.language ?? ""} onChange={e => set("language", e.target.value)} className="h-8" /></Field>
                  <Field label="Barcode Label"><Input value={draft.barcodeLabel ?? ""} onChange={e => set("barcodeLabel", e.target.value)} className="h-8" /></Field>
                  <Field label="Special Invoice" className="md:col-span-2"><Input value={draft.specialInvoice ?? ""} onChange={e => set("specialInvoice", e.target.value)} className="h-8" /></Field>
                </FormGrid>
              </EditCard>
            </div>
            <div>
              <EditCard title="Payment">
                <FormGrid cols={2}>
                  <Field label="Pay Terms"><Input value={draft.payTerms ?? ""} onChange={e => set("payTerms", e.target.value)} className="h-8" /></Field>
                  <Field label="Standard Days"><Input type="number" value={draft.standardDays ?? ""} onChange={e => set("standardDays", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                  <Field label="Settle Days"><Input type="number" value={draft.settleDays ?? ""} onChange={e => set("settleDays", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                  <Field label="Settle Discount"><Input type="number" value={draft.settleDiscount ?? ""} onChange={e => set("settleDiscount", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                  <Field label="Pay Method"><Input value={draft.payMethod ?? ""} onChange={e => set("payMethod", e.target.value)} className="h-8" /></Field>
                  <Field label="Bank Acct"><Input value={draft.bankAcct ?? ""} onChange={e => set("bankAcct", e.target.value)} className="h-8 font-mono" /></Field>
                </FormGrid>
              </EditCard>
              <EditCard title="Shipping">
                <FormGrid cols={2}>
                  <Field label="Ship From"><Input value={draft.shipFrom ?? ""} onChange={e => set("shipFrom", e.target.value)} className="h-8" /></Field>
                  <Field label="Warehouse"><Input value={draft.warehouse ?? ""} onChange={e => set("warehouse", e.target.value)} className="h-8" /></Field>
                  <Field label="Ship Method"><Input value={draft.shipMethod ?? ""} onChange={e => set("shipMethod", e.target.value)} className="h-8" /></Field>
                  <Field label="Transit Day"><Input type="number" value={draft.transitDay ?? ""} onChange={e => set("transitDay", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                  <Field label="Ship Charging"><Input value={draft.shipCharging ?? ""} onChange={e => set("shipCharging", e.target.value)} className="h-8" /></Field>
                  <Field label="Charge"><Input type="number" value={draft.charge ?? ""} onChange={e => set("charge", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                </FormGrid>
              </EditCard>
            </div>
          </div>
        </TabsContent>

        {/* FLAGS & AGENT */}
        <TabsContent value="flags" className="mt-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditCard title="Agent">
              <FormGrid cols={1}>
                <Field label="Account Manager"><Input value={draft.accountManager ?? ""} onChange={e => set("accountManager", e.target.value)} className="h-8" /></Field>
                <Field label="Agent"><Input value={draft.agent ?? ""} onChange={e => set("agent", e.target.value)} className="h-8" /></Field>
                <Field label="Profit Centre"><Input value={draft.profitCentre ?? ""} onChange={e => set("profitCentre", e.target.value)} className="h-8" /></Field>
              </FormGrid>
            </EditCard>
            <EditCard title="Flags">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex flex-col gap-2">
                  {FLAGS_LEFT.map(({ key, label }) => (
                    <label key={key} className="inline-flex items-center gap-2 text-[13px]">
                      <input type="checkbox" checked={!!f[key]} onChange={e => setFlag(key, e.target.checked)} className="h-3.5 w-3.5" />
                      {label}
                    </label>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {FLAGS_RIGHT.map(({ key, label }) => (
                    <label key={key} className="inline-flex items-center gap-2 text-[13px]">
                      <input type="checkbox" checked={!!f[key]} onChange={e => setFlag(key, e.target.checked)} className="h-3.5 w-3.5" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </EditCard>
          </div>
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

        {/* ORDER */}
        <TabsContent value="order" className="mt-3">
          <EditCard title="Order Summary" description="Read-only aggregates across order kinds.">
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px] border-collapse">
                <thead>
                  <tr className="text-muted-foreground border-b border-border">
                    <th className="text-left font-medium py-1.5 pr-3"></th>
                    {["Confirmed", "Regular", "Unique", "Quotes", "Own Shops", "Dropped"].map(h => (
                      <th key={h} className="text-right font-medium py-1.5 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {["Orders","Total Lines","Balance Lines","Bal Qtys","GBP Bal Values","Boxed Lines","Boxed Qtys","GBP Boxed Values","Allocated Lines","Allocated Qtys","GBP Allocated Values","Dropped Lines","Dropped Qtys","GBP Dropped Values"].map(row => (
                    <tr key={row} className="border-b border-border/60">
                      <td className="py-1.5 pr-3 text-foreground">{row}</td>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <td key={i} className="text-right py-1.5 px-3 tabular-nums text-muted-foreground">{row.includes("Values") ? "0.00" : "0"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </EditCard>
        </TabsContent>

        {/* TURNOVER */}
        <TabsContent value="turnover" className="mt-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <EditCard title="Account">
              <FormGrid cols={1}>
                <Field label="Addr"><Input value={draft.code} readOnly className="h-8 font-mono" /></Field>
                <Field label="Balance"><Input className="h-8 tabular-nums" defaultValue="0.00" /></Field>
                <Field label="Unallocated"><Input className="h-8 tabular-nums" defaultValue="0.00" /></Field>
                <Field label="Credit Limit"><Input className="h-8 tabular-nums" defaultValue="0.00" /></Field>
              </FormGrid>
            </EditCard>
            <EditCard title="Last 12 Months">
              <ul className="text-[12.5px] divide-y divide-border">
                {["Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"].map(m => (
                  <li key={m} className="flex justify-between py-1"><span>{m}</span><span className="tabular-nums text-muted-foreground">0.00</span></li>
                ))}
              </ul>
            </EditCard>
            <EditCard title="Previous 12 Months">
              <ul className="text-[12.5px] divide-y divide-border">
                {["Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"].map(m => (
                  <li key={m} className="flex justify-between py-1"><span>{m}</span><span className="tabular-nums text-muted-foreground">0.00</span></li>
                ))}
              </ul>
            </EditCard>
          </div>
        </TabsContent>

        {/* COST FACTOR */}
        <TabsContent value="cost" className="mt-3">
          <EditCard title="Cost Factor" description='Main "Stock Costs Price" parameters applied to all Stock items belonging to the Supplier.'>
            <FormGrid cols={3}>
              <Field label="Items"><Input value={draft.items ?? ""} onChange={e => set("items", e.target.value)} className="h-8" /></Field>
              <Field label="Supp FOB Factor"><Input value={draft.suppFobFactor ?? ""} onChange={e => set("suppFobFactor", e.target.value)} className="h-8" /></Field>
              <Field label="Currency"><Input value={draft.costCurrency ?? ""} onChange={e => set("costCurrency", e.target.value)} className="h-8" /></Field>
            </FormGrid>
          </EditCard>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditCard title="Country Of Origin Costs">
              <FormGrid cols={2}>
                <Field label="Agent Comm %"><Input type="number" value={draft.agentCommPct ?? ""} onChange={e => set("agentCommPct", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                <Field label="Agent Packing Charge %"><Input type="number" value={draft.agentPackingChargePct ?? ""} onChange={e => set("agentPackingChargePct", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                <Field label="Quality %"><Input type="number" value={draft.qualityPct ?? ""} onChange={e => set("qualityPct", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                <Field label="Probs %"><Input type="number" value={draft.probsPct ?? ""} onChange={e => set("probsPct", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                <Field label="Charges %"><Input type="number" value={draft.chargesPct ?? ""} onChange={e => set("chargesPct", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                <Field label="Freight to UK %"><Input type="number" value={draft.freightToUkPct ?? ""} onChange={e => set("freightToUkPct", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                <Field label="FOB Admin Charges %" className="md:col-span-2"><Input type="number" value={draft.fobAdminChargesPct ?? ""} onChange={e => set("fobAdminChargesPct", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
              </FormGrid>
            </EditCard>
            <EditCard title="UK Costs">
              <FormGrid cols={2}>
                <Field label="UK Clear %"><Input type="number" value={draft.ukClearPct ?? ""} onChange={e => set("ukClearPct", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                <Field label="UK Delivery %"><Input type="number" value={draft.ukDeliveryPct ?? ""} onChange={e => set("ukDeliveryPct", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                <Field label="UK Duty %" className="md:col-span-2"><Input type="number" value={draft.ukDutyPct ?? ""} onChange={e => set("ukDutyPct", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                <Field label="Master UniqID"><Input value={draft.masterUniqId ?? ""} onChange={e => set("masterUniqId", e.target.value)} className="h-8 font-mono" /></Field>
                <Field label="Work UniqID"><Input value={draft.workUniqId ?? ""} onChange={e => set("workUniqId", e.target.value)} className="h-8 font-mono" /></Field>
              </FormGrid>
            </EditCard>
          </div>
        </TabsContent>
      </Tabs>

      <StickyFormFooter>
        <Button variant="outline" size="sm" onClick={() => nav({ to: "/addresses" })}>Cancel</Button>
        <Button size="sm" className="gap-1.5" onClick={save}><Save className="h-3.5 w-3.5" /> Save Address</Button>
      </StickyFormFooter>
    </EditScreen>
  );
}
