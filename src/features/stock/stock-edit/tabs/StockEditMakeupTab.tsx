import { Plus, Trash2 } from "lucide-react";
import { ReferenceField } from "@/components/reference-field";
import { ReferenceKlass } from "@/lib/reference-registry";
import type { StockEditMakeupTabProps } from "../types";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { Field, FormGrid } from "@/components/form-primitives";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { STOCK_FIELD_CLASS } from "../field-classes";

export function StockEditMakeupTab(props: StockEditMakeupTabProps) {
  const { draft, set, bindRef, materials, setMaterial, addMaterial, removeMaterial, onGenerateBarcodes } =
    props;
  const { TXT, NUM, MONO } = STOCK_FIELD_CLASS;

  return (
    <TabsContent value="makeup" className="mt-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <EditCard title="Description">
                  <FormGrid cols={2}>
                    <ReferenceField
                      label="Category"
                      klass={ReferenceKlass.Category}
                      value={draft.categoryId ?? null}
                      displayLabel={draft.category}
                      placeholder="Search categories…"
                      onChange={bindRef("categoryId", "category")}
                    />
                    <Field label="Category Code">
                      <Input
                        value={draft.categoryCode ?? ""}
                        onChange={(e) => set("categoryCode", e.target.value)}
                        className={MONO}
                      />
                    </Field>
                    <ReferenceField
                      label="Color"
                      klass={ReferenceKlass.Colour}
                      value={draft.colourId ?? null}
                      displayLabel={draft.color}
                      placeholder="Search colours…"
                      onChange={bindRef("colourId", "color")}
                    />
                    <Field label="Color Code">
                      <Input
                        value={draft.colorCode ?? ""}
                        onChange={(e) => set("colorCode", e.target.value)}
                        className={MONO}
                      />
                    </Field>
                    <ReferenceField
                      label="Display"
                      klass={ReferenceKlass.Display}
                      value={draft.displayId ?? null}
                      displayLabel={draft.displayName}
                      placeholder="Search displays…"
                      onChange={(id, opt) => {
                        bindRef("displayId", "displayName")(id, opt);
                        if (opt?.code) set("displayCode", opt.code);
                      }}
                    />
                    <Field label="Display Code">
                      <Input
                        value={draft.displayCode ?? ""}
                        onChange={(e) => set("displayCode", e.target.value)}
                        className={MONO}
                      />
                    </Field>
                    <Field label="Cost">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.cost ?? draft.costPrice}
                        onChange={(e) => set("cost", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <ReferenceField
                      label="Ring size"
                      klass={ReferenceKlass.RingSize}
                      value={draft.size ?? null}
                      displayLabel={draft.size}
                      placeholder="Search sizes…"
                      onChange={(id, opt) =>
                        set("size", opt?.name ?? (id != null ? String(id) : ""))
                      }
                    />
                    <Field label="Unique Description" className="md:col-span-2">
                      <Input
                        value={draft.uniqueDescription ?? ""}
                        onChange={(e) => set("uniqueDescription", e.target.value)}
                        className={TXT}
                        placeholder="e.g., woven and knotted with tie string"
                      />
                    </Field>
                  </FormGrid>
                </EditCard>

                <EditCard title="Product Details">
                  <FormGrid cols={2}>
                    <ReferenceField
                      label="Assortment"
                      klass={ReferenceKlass.Assortment}
                      value={draft.assortmentId ?? null}
                      displayLabel={draft.assortment}
                      placeholder="Search…"
                      onChange={bindRef("assortmentId", "assortment")}
                    />
                    <ReferenceField
                      label="Collection"
                      klass={ReferenceKlass.Collection}
                      value={draft.collectionId ?? null}
                      displayLabel={draft.collection}
                      placeholder="Search…"
                      onChange={bindRef("collectionId", "collection")}
                    />
                    <ReferenceField
                      label="Selections"
                      klass={ReferenceKlass.Selection}
                      value={draft.selectionId ?? null}
                      displayLabel={draft.selections}
                      placeholder="Search…"
                      onChange={bindRef("selectionId", "selections")}
                    />
                    <ReferenceField
                      label="Packaging"
                      klass={ReferenceKlass.Packaging}
                      value={draft.packagingId ?? null}
                      displayLabel={draft.packaging}
                      placeholder="Search…"
                      onChange={bindRef("packagingId", "packaging")}
                    />
                    <ReferenceField
                      label="Gender"
                      klass={ReferenceKlass.TargetGender}
                      value={draft.genderId ?? null}
                      displayLabel={draft.gender}
                      placeholder="Search…"
                      onChange={bindRef("genderId", "gender")}
                    />
                    <Field label="Unchanged">
                      <Input
                        value={draft.unchanged ?? ""}
                        onChange={(e) => set("unchanged", e.target.value)}
                        className={TXT}
                      />
                    </Field>
                    <ReferenceField
                      label="Units"
                      klass={ReferenceKlass.Unit}
                      value={draft.unitId ?? null}
                      displayLabel={draft.units}
                      placeholder="Search…"
                      onChange={bindRef("unitId", "units")}
                    />
                    <ReferenceField
                      label="Item Tariff"
                      klass={ReferenceKlass.CustomTarrifCode}
                      value={draft.tariffCodeId ?? null}
                      displayLabel={draft.itemTariff}
                      placeholder="Search…"
                      onChange={bindRef("tariffCodeId", "itemTariff")}
                    />
                    <ReferenceField
                      label="VAT Rate"
                      klass={ReferenceKlass.VatRateCode}
                      value={draft.vatRateCodeId ?? null}
                      displayLabel={draft.vatRate}
                      placeholder="Search…"
                      onChange={bindRef("vatRateCodeId", "vatRate")}
                    />
                    <Field label="Category Tariff">
                      <Input
                        value={draft.categoryTariff ?? ""}
                        onChange={(e) => set("categoryTariff", e.target.value)}
                        className={TXT}
                      />
                    </Field>
                    <Field label="Front Location">
                      <Input
                        value={draft.frontLocation ?? "A"}
                        onChange={(e) => set("frontLocation", e.target.value)}
                        className={TXT}
                      />
                    </Field>
                    <Field label="Back Location">
                      <Input
                        value={draft.backLocation ?? "A"}
                        onChange={(e) => set("backLocation", e.target.value)}
                        className={TXT}
                      />
                    </Field>
                    <Field label="Catalogue Location" className="md:col-span-2">
                      <Input
                        value={draft.catalogueLocation ?? ""}
                        onChange={(e) => set("catalogueLocation", e.target.value)}
                        className={TXT}
                      />
                    </Field>
                  </FormGrid>
                </EditCard>
              </div>

              <div>
                <EditCard title="Barcodes">
                  <FormGrid cols={1}>
                    <Field label="Pack Barcode">
                      <Input
                        value={draft.packBarcode ?? ""}
                        onChange={(e) => set("packBarcode", e.target.value)}
                        className={MONO}
                      />
                    </Field>
                    <Field label="Retail Barcode">
                      <Input
                        value={draft.retailBarcode ?? ""}
                        onChange={(e) => set("retailBarcode", e.target.value)}
                        className={MONO}
                      />
                    </Field>
                  </FormGrid>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      className="mt-3 h-8"
                      onClick={() => void onGenerateBarcodes()}
                    >
                      Get Barcode Numbers
                    </Button>
                  </div>
                </EditCard>

                <EditCard title="Materials & Compositions">
                  <div className="space-y-2">
                    {materials.length === 0 && (
                      <p className="text-[12.5px] text-muted-foreground">No materials added.</p>
                    )}
                    {materials.map((m, i) => (
                      <div key={i} className="grid grid-cols-[1fr_90px_28px] gap-2 items-end">
                        <Field label="Material">
                          <Input
                            value={m.material}
                            onChange={(e) => setMaterial(i, { material: e.target.value })}
                            className={TXT}
                          />
                        </Field>
                        <Field label="Composite %">
                          <Input
                            type="number"
                            value={m.composite}
                            onChange={(e) => setMaterial(i, { composite: Number(e.target.value) })}
                            className={NUM}
                          />
                        </Field>
                        <button
                          onClick={() => removeMaterial(i)}
                          className="h-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 mt-1"
                        onClick={addMaterial}
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Material
                      </Button>
                    </div>
                  </div>
                </EditCard>
              </div>
            </div>
    </TabsContent>
  );
}
