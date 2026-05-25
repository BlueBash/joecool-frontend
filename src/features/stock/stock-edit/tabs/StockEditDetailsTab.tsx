import { toast } from "sonner";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { FormGrid } from "@/components/form-primitives";
import { FormNumberField, FormTextField } from "@/components/form";
import { Button } from "@/components/ui/button";
import type { StockFormValues } from "../../stock-form-schema";
import { StockItemCodeField } from "../form-helpers";
import { STOCK_FIELD_CLASS } from "../field-classes";

export function StockEditDetailsTab() {
  const { TXT, NUM } = STOCK_FIELD_CLASS;

  return (
    <TabsContent value="details" className="mt-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <EditCard title="Fitting Sizes">
          <StockItemCodeField />
          <FormGrid cols={2} className="mt-2">
            <FormTextField<StockFormValues>
              name="fittingPackAssort"
              label="Fitting Pack Assort"
              inputClassName={TXT}
            />
            <FormTextField<StockFormValues>
              name="fittingMeasure"
              label="Fitting Measure"
              inputClassName={TXT}
            />
            <FormTextField<StockFormValues>
              name="fittingSpec"
              label="Fitting Spec"
              inputClassName={TXT}
              className="md:col-span-2"
            />
          </FormGrid>
        </EditCard>
        <EditCard title="Dimensions">
          <StockItemCodeField />
          <FormGrid cols={2} className="mt-2">
            <FormTextField<StockFormValues>
              name="dimensionPack"
              label="Dimension Pack"
              inputClassName={TXT}
            />
            <FormTextField<StockFormValues>
              name="dimensionMeasure"
              label="Dimension Measure"
              inputClassName={TXT}
            />
            <FormTextField<StockFormValues>
              name="dimensionSpec"
              label="Dimension Spec"
              inputClassName={TXT}
              className="md:col-span-2"
            />
          </FormGrid>
        </EditCard>
        <EditCard title="Stock Specifications">
          <FormGrid cols={3}>
            <FormNumberField<StockFormValues> name="packQuantity" label="Pack Quantity" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="weightGm" label="Weight (gm)" inputClassName={NUM} />
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
