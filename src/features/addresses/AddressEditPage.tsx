import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { FormProvider } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { addresses } from "@/api/address";
import type { ApiError } from "@/api/_client";
import { EditScreen, EditCard } from "@/components/edit-screen";
import { ReferenceField } from "@/components/reference-field";
import { FormCheckboxField, FormDateField, FormSelectField, FormTextareaField, FormTextField } from "@/components/form";
import type { FieldPath } from "react-hook-form";
import { Field, FormGrid } from "@/components/form-primitives";
import { ReferenceKlass } from "@/lib/reference-registry";
import type { ReferenceOption } from "@/lib/reference";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Pill } from "@/components/pill";
import { toast } from "sonner";
import type { Address, AddressFlags } from "@/lib/types";
import { applyApiFieldErrors, firstFormErrorMessage, useEntityForm } from "@/lib/form";
import { AddressFormSchema, type AddressFormValues } from "./address-form-schema";
import { useAddressDetail } from "./hooks";
import { addressToPayload, mapRowToAddress } from "./map-address";

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
    id: `a_${Date.now()}`,
    code: "",
    name: "",
    type: "Customer",
    address1: "",
    town: "",
    country: "",
  };
}

export function AddressEditPage() {
  const { id } = routeApi.useParams();
  const nav = useNavigate();
  const isNew = id === "new";

  const detailQuery = useAddressDetail(id, !isNew);

  const resetValues = useMemo(() => {
    if (isNew) return blankAddress();
    if (!detailQuery.data) return null;
    return mapRowToAddress(detailQuery.data);
  }, [isNew, detailQuery.data]);

  const form = useEntityForm<AddressFormValues>({
    schema: AddressFormSchema,
    defaultValues: blankAddress(),
    resetValues,
    resetKey: id,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    setError,
    isDirty,
    isSubmitting,
  } = form;

  const draft = watch();

  const createSupplier = addresses.hooks.useCreateSupplier();
  const createCustomer = addresses.hooks.useCreateCustomer();
  const updateAddress = addresses.hooks.useUpdate();

  const isSaving =
    isSubmitting ||
    createSupplier.isPending ||
    createCustomer.isPending ||
    updateAddress.isPending;

  if (!isNew && detailQuery.isPending) {
    return (
      <EditScreen backTo="/addresses" title="Loading address…">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      </EditScreen>
    );
  }

  if (!isNew && detailQuery.isError) {
    return (
      <EditScreen backTo="/addresses" title="Address not found">
        <p className="text-muted-foreground text-[13px]">
          {(detailQuery.error as ApiError)?.message ?? "This address may have been deleted."}
        </p>
        <Button variant="outline" size="sm" className="mt-3 h-8" onClick={() => detailQuery.refetch()}>
          Try again
        </Button>
      </EditScreen>
    );
  }

  const set = <K extends keyof Address>(k: K, v: Address[K]) =>
    setValue(k as keyof AddressFormValues, v as never, { shouldDirty: true, shouldTouch: true });

  const bindRef =
    (idKey: keyof Address, labelKey: keyof Address) =>
    (refId: string | number | null, opt?: ReferenceOption) => {
      const numId = refId == null || refId === "" ? undefined : Number(refId);
      setValue(
        idKey as keyof AddressFormValues,
        (Number.isFinite(numId) ? numId : undefined) as never,
        { shouldDirty: true },
      );
      if (opt) {
        setValue(labelKey as keyof AddressFormValues, opt.name as never, { shouldDirty: true });
      } else if (refId == null || refId === "") {
        setValue(labelKey as keyof AddressFormValues, "" as never, { shouldDirty: true });
      }
    };

  const save = handleSubmit(
    (values) => {
      const payload = addressToPayload(values);
      if (isNew) {
        const createOpts = {
          onSuccess: (row: { id: string | number }) => {
            toast.success("Address created");
            nav({ to: "/address/$id", params: { id: String(row.id) } });
          },
          onError: (err: ApiError) => {
            if (!applyApiFieldErrors(setError, err)) toast.error(err.message);
          },
        };
        if (values.type === "Supplier") createSupplier.mutate(payload, createOpts);
        else createCustomer.mutate(payload, createOpts);
        return;
      }
      updateAddress.mutate(
        { id: values.id, data: payload },
        {
          onSuccess: () => toast.success("Address saved"),
          onError: (err: ApiError) => {
            if (!applyApiFieldErrors(setError, err)) toast.error(err.message);
          },
        },
      );
    },
    (errors) => {
      toast.error(firstFormErrorMessage(errors) ?? "Please fix the highlighted fields");
    },
  );

  return (
    <FormProvider {...form}>
    <EditScreen
      backTo="/addresses"
      backLabel="Back to Addresses"
      title={isNew ? "New Address" : (draft.name || draft.code)}
      badges={<Pill variant={draft.type === "Supplier" ? "info" : "primary"}>{draft.type}</Pill>}
      actions={
        <Button size="sm" className="h-8 gap-1.5" onClick={save} disabled={isSaving || (!isNew && !isDirty)}>
          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {isNew ? "Create" : "Save"}
        </Button>
      }
    >
      {/* Header identity strip */}
      <EditCard title="Identity">
        <FormGrid cols={4}>
          <FormSelectField<AddressFormValues> name="type" label="Kind">
            <option value="Customer">Customer</option>
            <option value="Supplier">Supplier</option>
          </FormSelectField>
          <FormTextField<AddressFormValues> name="code" label="Code" required mono inputClassName="h-8 font-mono" />
          <FormTextField<AddressFormValues> name="name" label="Name" required inputClassName="h-8" />
          <FormDateField<AddressFormValues> name="created" label="Created" />
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
              <ReferenceField label="Country" klass={ReferenceKlass.Country} value={draft.countryId ?? null} displayLabel={draft.country} placeholder="Search countries…" onChange={bindRef("countryId", "country")} />
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
                  <ReferenceField label="Invoice Env" klass={ReferenceKlass.InvoiceEnvironment} value={draft.invoiceEnvId ?? null} displayLabel={draft.invoiceEnv} placeholder="Search…" onChange={bindRef("invoiceEnvId", "invoiceEnv")} />
                  <ReferenceField label="Credit Env" klass={ReferenceKlass.InvoiceEnvironment} value={draft.creditEnvId ?? null} displayLabel={draft.creditEnv} placeholder="Search…" onChange={bindRef("creditEnvId", "creditEnv")} />
                  <ReferenceField label="Currency" klass={ReferenceKlass.Currency} value={draft.orderCurrencyId ?? null} displayLabel={draft.currency} placeholder="Search…" onChange={bindRef("orderCurrencyId", "currency")} />
                  <ReferenceField label="Price" klass={ReferenceKlass.PriceCategory} value={draft.orderPriceId ?? null} displayLabel={draft.priceCategory} placeholder="Search…" onChange={bindRef("orderPriceId", "priceCategory")} />
                  <ReferenceField label="Cost Code" klass={ReferenceKlass.CostCode} value={draft.orderCostCodeId ?? null} displayLabel={draft.costCode} placeholder="Search…" onChange={bindRef("orderCostCodeId", "costCode")} />
                  <Field label="FOB Factor"><Input value={draft.fobFactor ?? ""} onChange={e => set("fobFactor", e.target.value)} className="h-8" /></Field>
                  <Field label="Overall(Inv) Dsc%"><Input type="number" value={draft.overallInvDscPct ?? ""} onChange={e => set("overallInvDscPct", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                  <Field label="Whlsl (Item) Dsc%"><Input type="number" value={draft.whlslItemDscPct ?? ""} onChange={e => set("whlslItemDscPct", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                  <Field label="Vat Reg"><Input value={draft.vatReg ?? ""} onChange={e => set("vatReg", e.target.value)} className="h-8" /></Field>
                  <ReferenceField label="Vat Kind" klass={ReferenceKlass.VatKind} value={draft.vatKindId ?? null} displayLabel={draft.vatKind} placeholder="Search…" onChange={bindRef("vatKindId", "vatKind")} />
                  <ReferenceField label="Order Kind" klass={ReferenceKlass.OrderKind} value={draft.orderKindId ?? null} displayLabel={draft.orderKind} placeholder="Search…" onChange={bindRef("orderKindId", "orderKind")} />
                  <ReferenceField label="Vat Rate" klass={ReferenceKlass.VatRateCode} value={draft.vatRateCodeId ?? null} displayLabel={draft.vatRate} placeholder="Search…" onChange={bindRef("vatRateCodeId", "vatRate")} />
                  <ReferenceField label="Language" klass={ReferenceKlass.Language} value={draft.languageId ?? null} displayLabel={draft.language} placeholder="Search…" onChange={bindRef("languageId", "language")} />
                  <ReferenceField label="Barcode Label" klass={ReferenceKlass.LabelSource} value={draft.labelSourceId ?? null} displayLabel={draft.barcodeLabel} placeholder="Search…" onChange={bindRef("labelSourceId", "barcodeLabel")} />
                  <ReferenceField label="Special Invoice" className="md:col-span-2" klass={ReferenceKlass.SpecialCustomer} value={draft.specialInvsId ?? null} displayLabel={draft.specialInvoice} placeholder="Search…" onChange={bindRef("specialInvsId", "specialInvoice")} />
                </FormGrid>
              </EditCard>
            </div>
            <div>
              <EditCard title="Payment">
                <FormGrid cols={2}>
                  <ReferenceField label="Pay Terms" klass={ReferenceKlass.PayTerm} value={draft.payTermId ?? null} displayLabel={draft.payTerms} placeholder="Search…" onChange={bindRef("payTermId", "payTerms")} />
                  <Field label="Standard Days"><Input type="number" value={draft.standardDays ?? ""} onChange={e => set("standardDays", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                  <Field label="Settle Days"><Input type="number" value={draft.settleDays ?? ""} onChange={e => set("settleDays", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                  <Field label="Settle Discount"><Input type="number" value={draft.settleDiscount ?? ""} onChange={e => set("settleDiscount", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                  <ReferenceField label="Pay Method" klass={ReferenceKlass.PaymentMethod} value={draft.payMethodId ?? null} displayLabel={draft.payMethod} placeholder="Search…" onChange={bindRef("payMethodId", "payMethod")} />
                  <ReferenceField label="Bank Acct" klass={ReferenceKlass.BankAccount} value={draft.bankAccountId ?? null} displayLabel={draft.bankAcct} placeholder="Search…" onChange={bindRef("bankAccountId", "bankAcct")} />
                </FormGrid>
              </EditCard>
              <EditCard title="Shipping">
                <FormGrid cols={2}>
                  <ReferenceField label="Ship From" klass={ReferenceKlass.ShipFrom} value={draft.shipFromId ?? null} displayLabel={draft.shipFrom} placeholder="Search…" onChange={bindRef("shipFromId", "shipFrom")} />
                  <ReferenceField label="Warehouse" klass={ReferenceKlass.Warehouse} value={draft.warehouseId ?? null} displayLabel={draft.warehouse} placeholder="Search…" onChange={bindRef("warehouseId", "warehouse")} />
                  <ReferenceField label="Ship Method" klass={ReferenceKlass.ShipMethod} value={draft.shipMethodId ?? null} displayLabel={draft.shipMethod} placeholder="Search…" onChange={bindRef("shipMethodId", "shipMethod")} />
                  <Field label="Transit Day"><Input type="number" value={draft.transitDay ?? ""} onChange={e => set("transitDay", Number(e.target.value))} className="h-8 tabular-nums" /></Field>
                  <ReferenceField label="Ship Charging" klass={ReferenceKlass.ShippingCharge} value={draft.shippingChargeId ?? null} displayLabel={draft.shipCharging} placeholder="Search…" onChange={bindRef("shippingChargeId", "shipCharging")} />
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
                <ReferenceField label="Account Manager" klass={ReferenceKlass.AccountManager} value={draft.accountManagerId ?? null} displayLabel={draft.accountManager} placeholder="Search…" onChange={bindRef("accountManagerId", "accountManager")} />
                <ReferenceField label="Agent" klass={ReferenceKlass.Agent} value={draft.agentId ?? null} displayLabel={draft.agent} placeholder="Search…" onChange={bindRef("agentId", "agent")} />
                <ReferenceField label="Profit Centre" klass={ReferenceKlass.ProfitCentre} value={draft.profitCentreId ?? null} displayLabel={draft.profitCentre} placeholder="Search…" onChange={bindRef("profitCentreId", "profitCentre")} />
              </FormGrid>
            </EditCard>
            <EditCard title="Flags">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex flex-col gap-2">
                  {FLAGS_LEFT.map(({ key, label }) => (
                    <FormCheckboxField<AddressFormValues>
                      key={key}
                      name={`flags.${key}` as FieldPath<AddressFormValues>}
                      label={label}
                      inline
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {FLAGS_RIGHT.map(({ key, label }) => (
                    <FormCheckboxField<AddressFormValues>
                      key={key}
                      name={`flags.${key}` as FieldPath<AddressFormValues>}
                      label={label}
                      inline
                    />
                  ))}
                </div>
              </div>
            </EditCard>
          </div>
        </TabsContent>

        {/* NOTES */}
        <TabsContent value="notes" className="mt-3">
          <EditCard title="Notes">
            <FormTextareaField<AddressFormValues> name="notes" minHeightClass="min-h-[160px]" />
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
              <ReferenceField label="Currency" klass={ReferenceKlass.Currency} value={draft.costFactorCurrencyId ?? null} displayLabel={draft.costCurrency} placeholder="Search…" onChange={bindRef("costFactorCurrencyId", "costCurrency")} />
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
    </EditScreen>
    </FormProvider>
  );
}
