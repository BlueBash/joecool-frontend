import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  RING_SIZE_REFERENCE_DISPLAY,
  STOCK_PACKAGING_REFERENCE_DISPLAY,
} from "@/lib/reference-display";
import { ReferenceKlass } from "@/lib/reference-registry";
import type { StockEditMakeupTabProps } from "../types";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { Field, FormGrid } from "@/components/form-primitives";
import {
  FormNumberField,
  FormReferenceField,
  FormTextareaField,
  FormTextField,
} from "@/components/form";
import type { StockFormValues } from "../../stock-form-schema";
import { refId } from "../utils";
import { STOCK_FIELD_CLASS } from "../field-classes";
import {
  StockTitleCompositionProvider,
  useStockTitleCompositionContext,
} from "../StockTitleCompositionContext";
import { StockTitleReferenceField } from "../StockTitleReferenceField";

function MaterialsSection() {
  const { NUM } = STOCK_FIELD_CLASS;
  const { control } = useFormContext<StockFormValues>();
  const { syncTitles } = useStockTitleCompositionContext();
  const { fields, append, remove } = useFieldArray({ control, name: "materials" });

  return (
    <EditCard
      title="Materials & Compositions"
      headerActions={
        <span
          className="text-[12px] text-primary flex items-center hover:underline cursor-pointer"
          onClick={() => {
            append({ materialId: undefined, name: "", composite: 0, showInTitle: false });
            syncTitles();
          }}
        >
          <Plus className="h-3.5 w-3.5" /> Add Material
        </span>
      }
    >
      <div className="space-y-2">
        {fields.length === 0 && (
          <p className="text-[12.5px] text-muted-foreground">No materials added.</p>
        )}
        {fields.map((row, index) => (
          <div key={row.id} className="grid grid-cols-[1fr_90px_28px] gap-2 items-end">
            <StockTitleReferenceField<StockFormValues>
              name={`materials.${index}.materialId`}
              labelKey={`materials.${index}.name`}
              showInTitleName={`materials.${index}.showInTitle`}
              label="Material"
              klass={ReferenceKlass.Material}
              placeholder="Search materials…"
            />
            <FormNumberField<StockFormValues>
              name={`materials.${index}.composite`}
              label="Composite %"
              inputClassName={NUM}
            />
            <button
              type="button"
              onClick={() => {
                remove(index);
                syncTitles();
              }}
              className="h-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </EditCard>
  );
}

function MakeupTabContent({ onGenerateBarcodes }: StockEditMakeupTabProps) {
  const { TXT, NUM } = STOCK_FIELD_CLASS;
  const { setValue } = useFormContext<StockFormValues>();

  return (
    <TabsContent value="makeup" className="mt-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <EditCard title="Description">
            <FormGrid cols={2}>
              <StockTitleReferenceField<StockFormValues>
                name="categoryId"
                labelKey="category"
                showInTitleName="categoryShowInTitle"
                label="Category"
                klass={ReferenceKlass.Category}
                placeholder="Search categories…"
              />
              <StockTitleReferenceField<StockFormValues>
                name="colourId"
                labelKey="color"
                showInTitleName="colorShowInTitle"
                label="Color"
                klass={ReferenceKlass.Colour}
                placeholder="Search colours…"
              />
              <StockTitleReferenceField<StockFormValues>
                name="displayId"
                labelKey="displayName"
                showInTitleName="displayShowInTitle"
                label="Display"
                klass={ReferenceKlass.Display}
                placeholder="Search displays…"
                onReferenceChange={(id, opt) => {
                  if (opt) {
                    if (opt.code) setValue("displayCode", opt.code, { shouldDirty: true });
                    const displayCost =
                      opt.cost != null && opt.cost !== "" ? Number(opt.cost) : undefined;
                    if (displayCost != null && Number.isFinite(displayCost)) {
                      setValue("cost", displayCost, { shouldDirty: true });
                    }
                  } else if (id == null || id === "") {
                    setValue("displayCode", "", { shouldDirty: true });
                    setValue("cost", undefined, { shouldDirty: true });
                  }
                }}
              />
              <FormNumberField<StockFormValues>
                name="cost"
                label="Display Cost"
                step="0.01"
                disabled={true}
                readOnly={true}
                inputClassName={NUM}
              />
              <FormReferenceField<StockFormValues>
                name="ringSizeId"
                labelKey="size"
                label="Ring size"
                klass={ReferenceKlass.RingSize}
                displayConfig={RING_SIZE_REFERENCE_DISPLAY}
                placeholder="Search sizes…"
              />
              <FormTextareaField<StockFormValues>
                name="uniqueDescription"
                label="Unique Description"
                placeholder="e.g., woven and knotted with tie string"
                rows={4}
                minHeightClass=""
                className="[&_textarea]:mt-2"
              />
            </FormGrid>
          </EditCard>

          <EditCard title="Product Details">
            <FormGrid cols={2}>
              <FormReferenceField<StockFormValues>
                name="assortmentId"
                labelKey="assortment"
                label="Assortment"
                klass={ReferenceKlass.Assortment}
                placeholder="Search…"
              />
              <FormReferenceField<StockFormValues>
                name="collectionId"
                labelKey="collection"
                label="Collection"
                klass={ReferenceKlass.Collection}
                placeholder="Search…"
              />
              <FormReferenceField<StockFormValues>
                name="selectionId"
                labelKey="selections"
                label="Selections"
                klass={ReferenceKlass.Selection}
                placeholder="Search…"
              />
              <FormReferenceField<StockFormValues>
                name="packagingId"
                labelKey="packaging"
                label="Packaging"
                klass={ReferenceKlass.Stock}
                displayConfig={STOCK_PACKAGING_REFERENCE_DISPLAY}
                placeholder="Search packaging stock…"
              />
              <FormReferenceField<StockFormValues>
                name="genderId"
                labelKey="gender"
                label="Gender"
                klass={ReferenceKlass.TargetGender}
                placeholder="Search…"
              />
              <FormTextField<StockFormValues>
                name="unchanged"
                label="Unchanged"
                inputClassName={TXT}
              />
              <FormReferenceField<StockFormValues>
                name="unitId"
                labelKey="units"
                label="Units"
                klass={ReferenceKlass.Unit}
                placeholder="Search…"
              />
              <FormReferenceField<StockFormValues>
                name="tariffCodeId"
                labelKey="itemTariff"
                label="Item Tariff"
                klass={ReferenceKlass.CustomTarrifCode}
                placeholder="Search…"
              />
              <FormReferenceField<StockFormValues>
                name="vatRateCodeId"
                labelKey="vatRate"
                label="VAT Rate"
                klass={ReferenceKlass.VatRateCode}
                placeholder="Search…"
              />
              <FormTextField<StockFormValues>
                name="categoryTariff"
                label="Category Tariff"
                inputClassName={TXT}
              />
              <FormTextField<StockFormValues>
                name="frontLocation"
                label="Front Location"
                inputClassName={TXT}
              />
              <FormTextField<StockFormValues>
                name="backLocation"
                label="Back Location"
                inputClassName={TXT}
              />
              <FormTextField<StockFormValues>
                name="catalogueLocation"
                label="Catalogue Location"
                inputClassName={TXT}
                className="md:col-span-2"
              />
            </FormGrid>
          </EditCard>
        </div>

        <div>
          <EditCard
            title="Barcodes"
            headerActions={
              <span
                className="text-[12px] text-primary flex items-center hover:underline cursor-pointer"
                onClick={() => void onGenerateBarcodes()}
              >
                Get Barcode Numbers
              </span>
            }
          >
            <FormGrid cols={1}>
              <FormTextField<StockFormValues>
                name="packBarcode"
                label="Pack Barcode"
                readOnly={true}
                inputClassName={STOCK_FIELD_CLASS.MONO}
              />
              <FormTextField<StockFormValues>
                name="retailBarcode"
                label="Retail Barcode"
                mono
                readOnly={true}
                inputClassName={STOCK_FIELD_CLASS.MONO}
              />
            </FormGrid>
          </EditCard>

          <MaterialsSection />
        </div>
      </div>
    </TabsContent>
  );
}

export function StockEditMakeupTab({
  onGenerateBarcodes,
  resetSeed,
  isStockCreated,
}: StockEditMakeupTabProps) {
  return (
    <StockTitleCompositionProvider resetSeed={resetSeed} isStockCreated={isStockCreated}>
      <MakeupTabContent onGenerateBarcodes={onGenerateBarcodes} />
    </StockTitleCompositionProvider>
  );
}
