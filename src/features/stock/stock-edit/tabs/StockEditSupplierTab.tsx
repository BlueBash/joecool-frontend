import type { StockEditTabProps } from "../types";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { Field, FormGrid } from "@/components/form-primitives";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { STOCK_FIELD_CLASS } from "../field-classes";

export function StockEditSupplierTab(props: StockEditTabProps) {
  const { draft, set } = props;
  const { TXT, NUM, MONO } = STOCK_FIELD_CLASS;

  return (
    <TabsContent value="supplier" className="mt-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <EditCard title="Supplier">
                <FormGrid cols={2}>
                  <Field label="Code">
                    <Input
                      value={draft.supplierCode ?? ""}
                      onChange={(e) => set("supplierCode", e.target.value)}
                      className={MONO}
                    />
                  </Field>
                  <Field label="Name">
                    <Input
                      value={draft.supplierName ?? ""}
                      onChange={(e) => set("supplierName", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="Country">
                    <Input
                      value={draft.supplierCountry ?? ""}
                      onChange={(e) => set("supplierCountry", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="ISO Code">
                    <Input
                      value={draft.supplierIso ?? ""}
                      onChange={(e) => set("supplierIso", e.target.value)}
                      className={MONO}
                    />
                  </Field>
                  <Field label="Supplier Item Code">
                    <Input
                      value={draft.supplierItemCode ?? ""}
                      onChange={(e) => set("supplierItemCode", e.target.value)}
                      className={MONO}
                    />
                  </Field>
                  <Field label="Buyer">
                    <Input
                      value={draft.buyer ?? ""}
                      onChange={(e) => set("buyer", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                </FormGrid>
              </EditCard>
              <EditCard title="Manufacturer">
                <FormGrid cols={2}>
                  <Field label="Code">
                    <Input
                      value={draft.manufacturerCode ?? ""}
                      onChange={(e) => set("manufacturerCode", e.target.value)}
                      className={MONO}
                    />
                  </Field>
                  <Field label="Name">
                    <Input
                      value={draft.manufacturerName ?? ""}
                      onChange={(e) => set("manufacturerName", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="Country">
                    <Input
                      value={draft.manufacturerCountry ?? ""}
                      onChange={(e) => set("manufacturerCountry", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="ISO Code">
                    <Input
                      value={draft.manufacturerIso ?? ""}
                      onChange={(e) => set("manufacturerIso", e.target.value)}
                      className={MONO}
                    />
                  </Field>
                  <Field label="Manufr Item Code" className="md:col-span-2">
                    <Input
                      value={draft.manufrItemCode ?? ""}
                      onChange={(e) => set("manufrItemCode", e.target.value)}
                      className={MONO}
                    />
                  </Field>
                </FormGrid>
              </EditCard>
              <EditCard title="Reorder Settings">
                <FormGrid cols={1}>
                  <Field label="Wholesale Re-Order Level">
                    <Input
                      type="number"
                      value={draft.wholesaleReorderLevel ?? ""}
                      onChange={(e) => set("wholesaleReorderLevel", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Re-Order Quantity">
                    <Input
                      type="number"
                      value={draft.reorderQty ?? ""}
                      onChange={(e) => set("reorderQty", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Wholesale Top Up To">
                    <Input
                      type="number"
                      value={draft.wholesaleTopUpTo ?? ""}
                      onChange={(e) => set("wholesaleTopUpTo", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                </FormGrid>
              </EditCard>
            </div>
    </TabsContent>
  );
}
