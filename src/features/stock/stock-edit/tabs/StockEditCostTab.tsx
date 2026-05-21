import { toast } from "sonner";
import type { StockEditTabProps } from "../types";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { Field, FormGrid } from "@/components/form-primitives";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { STOCK_FIELD_CLASS } from "../field-classes";

export function StockEditCostTab(props: StockEditTabProps) {
  const { draft, set } = props;
  const { TXT, NUM, MONO } = STOCK_FIELD_CLASS;

  return (
    <TabsContent value="cost" className="mt-3">
            <EditCard title="Supplier">
              <FormGrid cols={3}>
                <Field label="Supplier Code">
                  <Input
                    value={draft.supplierCode ?? ""}
                    onChange={(e) => set("supplierCode", e.target.value)}
                    className={MONO}
                  />
                </Field>
                <Field label="Supplier Name">
                  <Input
                    value={draft.supplierName ?? ""}
                    onChange={(e) => set("supplierName", e.target.value)}
                    className={TXT}
                  />
                </Field>
                <Field label="Supplier FOB X">
                  <Input
                    type="number"
                    step="0.01"
                    value={draft.supplierFobX ?? ""}
                    onChange={(e) => set("supplierFobX", Number(e.target.value))}
                    className={NUM}
                  />
                </Field>
              </FormGrid>
            </EditCard>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <EditCard title="Country Of Origin Costs">
                <div className="flex justify-end mb-2">
                  <Field label="Currency" className="max-w-[140px]">
                    <Input
                      value={draft.currencyCode ?? "CNY"}
                      onChange={(e) => set("currencyCode", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                </div>
                <FormGrid cols={2}>
                  <Field label="Facty Cost">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.factyCost ?? ""}
                      onChange={(e) => set("factyCost", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Per">
                    <Input
                      type="number"
                      value={draft.factyPer ?? 1}
                      onChange={(e) => set("factyPer", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="First Cost" className="md:col-span-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.factyCost ?? ""}
                      disabled
                      className={NUM}
                    />
                  </Field>
                  <Field label="Facty Pack">
                    <Input
                      value={draft.factyPack ?? ""}
                      onChange={(e) => set("factyPack", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="Amount">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.factyAmount ?? ""}
                      onChange={(e) => set("factyAmount", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Facty Invd" className="md:col-span-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.factyInvd ?? ""}
                      onChange={(e) => set("factyInvd", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Packaging">
                    <Input
                      value={draft.packagingName ?? ""}
                      onChange={(e) => set("packagingName", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="New Amount">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.packagingNewAmount ?? 0}
                      onChange={(e) => set("packagingNewAmount", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Agent Com%">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.agentCommPct ?? ""}
                      onChange={(e) => set("agentCommPct", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Agent Amount">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.agentAmount ?? ""}
                      onChange={(e) => set("agentAmount", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Agent Base">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.agentBase ?? ""}
                      onChange={(e) => set("agentBase", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Agent Cost">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.agentCost ?? ""}
                      onChange={(e) => set("agentCost", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Agent Pack%">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.agentPackPct ?? ""}
                      onChange={(e) => set("agentPackPct", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Agent Pack Amount">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.agentPackAmount ?? ""}
                      onChange={(e) => set("agentPackAmount", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Quality%">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.qualityPct ?? 0}
                      onChange={(e) => set("qualityPct", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Probs%">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.probsPct ?? 0}
                      onChange={(e) => set("probsPct", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Charges%">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.chargesPct ?? 0}
                      onChange={(e) => set("chargesPct", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="FOB Charges%">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.fobChargesPct ?? 0}
                      onChange={(e) => set("fobChargesPct", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Item OB">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.itemOb ?? ""}
                      onChange={(e) => set("itemOb", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="FOB Base">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.fobBase ?? ""}
                      onChange={(e) => set("fobBase", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="JC Packing">
                    <Input
                      value={draft.jcPacking ?? ""}
                      onChange={(e) => set("jcPacking", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="JC Packing Amount">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.jcPackingAmount ?? ""}
                      onChange={(e) => set("jcPackingAmount", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="JC OB Cost" className="md:col-span-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.jcObCost ?? ""}
                      onChange={(e) => set("jcObCost", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Freight%">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.freightPct ?? ""}
                      onChange={(e) => set("freightPct", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Freight% Amount">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.freightAmount ?? ""}
                      onChange={(e) => set("freightAmount", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Arrive UK">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.arriveUk ?? ""}
                      onChange={(e) => set("arriveUk", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Calc FOB X">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.calcFobX ?? ""}
                      onChange={(e) => set("calcFobX", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                </FormGrid>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="h-8" onClick={() => toast.success("Saved FOB X")}>
                    Save FOB X in Supp Addr Record
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => toast.success("Saved")}
                  >
                    Save as Supp Defaults
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => toast.success("Read")}
                  >
                    Read Supp Defaults
                  </Button>
                </div>
              </EditCard>

              <div>
                <EditCard title="Exchange Rate">
                  <FormGrid cols={2}>
                    <Field label="Current Rate">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.currentRate ?? ""}
                        onChange={(e) => set("currentRate", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Last Used X Rate">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.lastUsedXRate ?? ""}
                        onChange={(e) => set("lastUsedXRate", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Buy Adjust %">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.buyAdjustPct ?? ""}
                        onChange={(e) => set("buyAdjustPct", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Effective Rate">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.effectiveRate ?? ""}
                        onChange={(e) => set("effectiveRate", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Arrive UK Rate">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.arriveUkRate ?? ""}
                        onChange={(e) => set("arriveUkRate", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="(Up) GBP">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.upGbp ?? ""}
                        onChange={(e) => set("upGbp", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                  </FormGrid>
                </EditCard>

                <EditCard title="UK Costs">
                  <FormGrid cols={3}>
                    <Field label="UK Duty %">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.ukDutyPct ?? ""}
                        onChange={(e) => set("ukDutyPct", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="UK Duty% Amount">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.ukDutyAmount ?? ""}
                        onChange={(e) => set("ukDutyAmount", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Duty Paid">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.dutyPaid ?? ""}
                        onChange={(e) => set("dutyPaid", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Clearance %">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.clearancePct ?? ""}
                        onChange={(e) => set("clearancePct", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Clearance% Amount">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.clearanceAmount ?? ""}
                        onChange={(e) => set("clearanceAmount", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="UK Landed">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.ukLanded ?? ""}
                        onChange={(e) => set("ukLanded", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Delivery %">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.deliveryPct ?? ""}
                        onChange={(e) => set("deliveryPct", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Delivery% Amount">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.deliveryAmount ?? ""}
                        onChange={(e) => set("deliveryAmount", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Delivered">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.delivered ?? ""}
                        onChange={(e) => set("delivered", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Assembly">
                      <Input
                        value={draft.assembly ?? ""}
                        onChange={(e) => set("assembly", e.target.value)}
                        className={TXT}
                      />
                    </Field>
                    <Field label="Assembly Amount">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.assemblyAmount ?? ""}
                        onChange={(e) => set("assemblyAmount", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Assembled">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.assembled ?? ""}
                        onChange={(e) => set("assembled", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Display">
                      <Input
                        value={draft.display ?? ""}
                        onChange={(e) => set("display", e.target.value)}
                        className={TXT}
                      />
                    </Field>
                    <Field label="Display Amount">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.displayAmount ?? ""}
                        onChange={(e) => set("displayAmount", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Calc Ready">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.calcReady ?? ""}
                        onChange={(e) => set("calcReady", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Per">
                      <Input
                        type="number"
                        value={draft.per ?? 1}
                        onChange={(e) => set("per", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Rounded Up">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.roundedUp ?? ""}
                        onChange={(e) => set("roundedUp", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Landed Factr">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.landedFactr ?? ""}
                        onChange={(e) => set("landedFactr", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Stored Ready">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.storedReady ?? ""}
                        onChange={(e) => set("storedReady", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Calcd Markup">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.calcdMarkup ?? ""}
                        onChange={(e) => set("calcdMarkup", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="GBP Whlsl">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.gbpWhlsl ?? ""}
                        onChange={(e) => set("gbpWhlsl", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                  </FormGrid>
                </EditCard>
              </div>
            </div>
    </TabsContent>
  );
}
