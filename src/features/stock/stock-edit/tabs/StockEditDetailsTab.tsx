import { toast } from "sonner";
import { useFormContext } from "react-hook-form";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { FormGrid } from "@/components/form-primitives";
import { FormNumberField, FormReferenceField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { ReferenceKlass } from "@/lib/reference-registry";
import type { StockFormValues } from "../../stock-form-schema";
import { DimensionSpecField } from "../DimensionSpecField";
import { FittingSpecField } from "../FittingSpecField";
import { STOCK_FIELD_CLASS } from "../field-classes";
import { StockSettingsMessageDialog } from "../StockSettingsMessageDialog";
import { StockSettingsMessageLink } from "../StockSettingsMessageLink";
import { useStockSettingsMessages } from "../useStockSettingsMessages";

export function StockEditDetailsTab() {
  const { TXT, NUM } = STOCK_FIELD_CLASS;
  const { getValues } = useFormContext<StockFormValues>();
  const { modal, closeModal, openFittingMessages, openDimensionMessages } =
    useStockSettingsMessages(getValues);

  return (
    <TabsContent value="details" className="mt-3">
      <StockSettingsMessageDialog
        open={modal.open}
        onOpenChange={(open) => !open && closeModal()}
        kind={modal.kind}
        loading={modal.loading}
        retail={modal.retail}
        wholesale={modal.wholesale}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <EditCard
          title="Fitting Sizes"
          headerActions={<StockSettingsMessageLink onClick={openFittingMessages} />}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormReferenceField<StockFormValues>
              name="fittingPackAssortId"
              labelKey="fittingPackAssort"
              label="Fitting Pack Assort"
              klass={ReferenceKlass.FittingSizePackAssortment}
              inputClassName={TXT}
              placeholder="Search pack assortments…"
            />
            <FormReferenceField<StockFormValues>
              name="fittingMeasureId"
              labelKey="fittingMeasure"
              label="Fitting Measure"
              klass={ReferenceKlass.FittingSizeMeasure}
              inputClassName={TXT}
              placeholder="Search measures…"
            />
            <FittingSpecField />
          </div>
        </EditCard>
        <EditCard
          title="Dimensions"
          headerActions={<StockSettingsMessageLink onClick={openDimensionMessages} />}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormReferenceField<StockFormValues>
              name="dimensionPackId"
              labelKey="dimensionPack"
              label="Dimension Pack"
              klass={ReferenceKlass.DimensionPackAssortment}
              inputClassName={TXT}
              placeholder="Search pack assortments…"
            />
            <FormReferenceField<StockFormValues>
              name="dimensionMeasureId"
              labelKey="dimensionMeasure"
              label="Dimension Measure"
              klass={ReferenceKlass.DimensionMeasure}
              inputClassName={TXT}
              placeholder="Search measures…"
            />
            <DimensionSpecField />
          </div>
        </EditCard>
        <EditCard title="Stock Specifications">
          <FormGrid cols={3}>
            <FormNumberField<StockFormValues>
              name="packQuantity"
              label="Pack Quantity"
              inputClassName={NUM}
            />
            <FormNumberField<StockFormValues>
              name="weightGm"
              label="Weight (gm)"
              inputClassName={NUM}
            />
            <FormNumberField<StockFormValues> name="volume" label="Volume" inputClassName={NUM} />
          </FormGrid>
          <h4 className="text-[12px] font-semibold mt-3 mb-1.5 text-muted-foreground uppercase tracking-wide">
            Dimensions
          </h4>
          <FormGrid cols={3}>
            <FormNumberField<StockFormValues> name="length" label="Length" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="breadth" label="Breadth" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="height" label="Height" inputClassName={NUM} />
          </FormGrid>
          <h4 className="text-[12px] font-semibold mt-3 mb-1.5 text-muted-foreground uppercase tracking-wide">
            Pack Labels
          </h4>
          <div className="flex items-end gap-2">
            <FormNumberField<StockFormValues>
              name="a4PackLabels"
              label="A4 Pack Labels"
              inputClassName={NUM}
              className="flex-1"
            />
            <Button size="sm" className="h-8" onClick={() => toast.success("Print queued")}>
              Print Sheets
            </Button>
          </div>
        </EditCard>
      </div>
    </TabsContent>
  );
}
