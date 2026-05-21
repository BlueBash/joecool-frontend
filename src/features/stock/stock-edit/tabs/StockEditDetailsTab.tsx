import { toast } from "sonner";
import type { StockEditTabProps } from "../types";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { Field, FormGrid } from "@/components/form-primitives";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { STOCK_FIELD_CLASS } from "../field-classes";

export function StockEditDetailsTab(props: StockEditTabProps) {
  const { draft, set } = props;
  const { TXT, NUM, MONO } = STOCK_FIELD_CLASS;

  return (
    <TabsContent value="details" className="mt-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <EditCard title="Fitting Sizes">
                <Field label="Item">
                  <Input value={draft.code} disabled className={MONO} />
                </Field>
                <FormGrid cols={2} className="mt-2">
                  <Field label="Fitting Pack Assort">
                    <Input
                      value={draft.fittingPackAssort ?? ""}
                      onChange={(e) => set("fittingPackAssort", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="Fitting Measure">
                    <Input
                      value={draft.fittingMeasure ?? ""}
                      onChange={(e) => set("fittingMeasure", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="Fitting Spec" className="md:col-span-2">
                    <Input
                      value={draft.fittingSpec ?? ""}
                      onChange={(e) => set("fittingSpec", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                </FormGrid>
              </EditCard>
              <EditCard title="Dimensions">
                <Field label="Item">
                  <Input value={draft.code} disabled className={MONO} />
                </Field>
                <FormGrid cols={2} className="mt-2">
                  <Field label="Dimension Pack">
                    <Input
                      value={draft.dimensionPack ?? ""}
                      onChange={(e) => set("dimensionPack", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="Dimension Measure">
                    <Input
                      value={draft.dimensionMeasure ?? ""}
                      onChange={(e) => set("dimensionMeasure", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="Dimension Spec" className="md:col-span-2">
                    <Input
                      value={draft.dimensionSpec ?? ""}
                      onChange={(e) => set("dimensionSpec", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                </FormGrid>
              </EditCard>
              <EditCard title="Stock Specifications">
                <FormGrid cols={3}>
                  <Field label="Pack Quantity">
                    <Input
                      type="number"
                      value={draft.packQuantity ?? 0}
                      onChange={(e) => set("packQuantity", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Weight (gm)">
                    <Input
                      type="number"
                      value={draft.weightGm ?? 0}
                      onChange={(e) => set("weightGm", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Volume">
                    <Input
                      type="number"
                      value={draft.volume ?? 0}
                      onChange={(e) => set("volume", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                </FormGrid>
                <h4 className="text-[12px] font-semibold mt-3 mb-1.5 text-muted-foreground uppercase tracking-wide">
                  Dimensions
                </h4>
                <FormGrid cols={3}>
                  <Field label="Length">
                    <Input
                      type="number"
                      value={draft.length ?? 0}
                      onChange={(e) => set("length", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Breadth">
                    <Input
                      type="number"
                      value={draft.breadth ?? 0}
                      onChange={(e) => set("breadth", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Height">
                    <Input
                      type="number"
                      value={draft.height ?? 0}
                      onChange={(e) => set("height", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                </FormGrid>
                <h4 className="text-[12px] font-semibold mt-3 mb-1.5 text-muted-foreground uppercase tracking-wide">
                  Pack Labels
                </h4>
                <div className="flex items-end gap-2">
                  <Field label="A4 Pack Labels" className="flex-1">
                    <Input
                      type="number"
                      value={draft.a4PackLabels ?? 0}
                      onChange={(e) => set("a4PackLabels", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Button size="sm" className="h-8" onClick={() => toast.success("Print queued")}>
                    Print Sheets
                  </Button>
                </div>
              </EditCard>
            </div>
    </TabsContent>
  );
}
