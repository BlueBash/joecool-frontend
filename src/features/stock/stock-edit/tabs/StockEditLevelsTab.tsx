import { toast } from "sonner";
import type { StockEditTabProps } from "../types";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { Field, FormGrid } from "@/components/form-primitives";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { STOCK_FIELD_CLASS } from "../field-classes";

export function StockEditLevelsTab(props: StockEditTabProps) {
  const { draft, set } = props;
  const { TXT, NUM, MONO } = STOCK_FIELD_CLASS;

  return (
    <TabsContent value="levels" className="mt-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <EditCard title="Balance Orders — Customer">
                  <table className="w-full text-[12.5px]">
                    <thead className="text-muted-foreground border-b border-border">
                      <tr>
                        <th className="text-left py-1.5"></th>
                        {["Regular", "Codir", "Forecast", "Dropped"].map((h) => (
                          <th key={h} className="text-right px-2">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {["Orders", "Qntys", "Values"].map((r) => (
                        <tr key={r} className="border-b border-border/60">
                          <td className="py-1.5 font-medium">{r}</td>
                          {[0, 1, 2, 3].map((i) => (
                            <td key={i} className="px-2 py-1">
                              <Input
                                className={`${NUM} text-right`}
                                defaultValue={r === "Values" ? "0.00" : "0"}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </EditCard>
                <EditCard title="Balance Orders — Supplier">
                  <table className="w-full text-[12.5px]">
                    <thead className="text-muted-foreground border-b border-border">
                      <tr>
                        <th className="text-left py-1.5"></th>
                        {["Regular", "Codir", "Forecast", "Dropped"].map((h) => (
                          <th key={h} className="text-right px-2">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {["Orders", "Qntys", "Values"].map((r) => (
                        <tr key={r} className="border-b border-border/60">
                          <td className="py-1.5 font-medium">{r}</td>
                          {[0, 1, 2, 3].map((i) => (
                            <td key={i} className="px-2 py-1">
                              <Input
                                className={`${NUM} text-right`}
                                defaultValue={r === "Values" ? "0.00" : "0"}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </EditCard>
              </div>
              <EditCard title="Stock Position">
                <FormGrid cols={2}>
                  <Field label="Warehouse Levels">
                    <Input
                      type="number"
                      value={draft.warehouseLevels ?? 0}
                      onChange={(e) => set("warehouseLevels", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Boxes">
                    <Input
                      type="number"
                      value={draft.boxes ?? 0}
                      onChange={(e) => set("boxes", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Stock Allocated">
                    <Input
                      type="number"
                      value={draft.stockAllocated ?? 0}
                      onChange={(e) => set("stockAllocated", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Customer Orders">
                    <Input
                      type="number"
                      value={draft.customerOrders ?? 0}
                      onChange={(e) => set("customerOrders", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Transit">
                    <Input
                      type="number"
                      value={draft.transit ?? 0}
                      onChange={(e) => set("transit", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Transit Allocated">
                    <Input
                      type="number"
                      value={draft.transitAllocated ?? 0}
                      onChange={(e) => set("transitAllocated", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Supplier Orders">
                    <Input
                      type="number"
                      value={draft.supplierOrders ?? 0}
                      onChange={(e) => set("supplierOrders", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="China/CO">
                    <Input
                      type="number"
                      value={draft.chinaCo ?? 0}
                      onChange={(e) => set("chinaCo", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Shelf">
                    <Input
                      type="number"
                      value={draft.shelf ?? 0}
                      onChange={(e) => set("shelf", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Free">
                    <Input
                      type="number"
                      value={draft.free ?? 0}
                      onChange={(e) => set("free", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Available">
                    <Input
                      type="number"
                      value={draft.available ?? 0}
                      onChange={(e) => set("available", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Spare">
                    <Input
                      type="number"
                      value={draft.spare ?? 0}
                      onChange={(e) => set("spare", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Sup CODIR">
                    <Input
                      type="number"
                      value={draft.supCodir ?? 0}
                      onChange={(e) => set("supCodir", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="12 Mth Sls">
                    <Input
                      type="number"
                      value={draft.twelveMthSls ?? 0}
                      onChange={(e) => set("twelveMthSls", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Stock/Sls">
                    <Input
                      type="number"
                      value={draft.stockSls ?? 0}
                      onChange={(e) => set("stockSls", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Spare/Sls">
                    <Input
                      type="number"
                      value={draft.spareSls ?? 0}
                      onChange={(e) => set("spareSls", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                </FormGrid>
                <Button
                  size="sm"
                  className="mt-3 h-8 w-full"
                  onClick={() => toast.success("Adjusted")}
                >
                  Adjust
                </Button>
              </EditCard>
            </div>
    </TabsContent>
  );
}
