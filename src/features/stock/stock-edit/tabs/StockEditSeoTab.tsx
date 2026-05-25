import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { FormReferenceField, FormTextareaField, FormTextField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { ReferenceKlass } from "@/lib/reference-registry";
import { STOCK_RANGE_REFERENCE_DISPLAY } from "@/lib/reference-display";
import type { StockFormValues } from "../../stock-form-schema";
import { STOCK_FIELD_CLASS } from "../field-classes";

export function StockEditSeoTab() {
  const { TXT } = STOCK_FIELD_CLASS;
  const { control } = useFormContext<StockFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "ranges" });

  return (
    <TabsContent value="seo" className="mt-3">
      <EditCard title="Wholesale/Consumer Blurb">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormTextareaField<StockFormValues>
            name="wholesaleBlurb"
            label="Wholesale Blurb"
            rows={4}
            minHeightClass=""
            className="[&_textarea]:mt-2"
          />
          <FormTextareaField<StockFormValues>
            name="consumerBlurb"
            label="Consumer Blurb"
            rows={4}
            minHeightClass=""
            className="[&_textarea]:mt-2"
          />
        </div>
      </EditCard>
      <EditCard title="SEO">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-medium text-foreground">Ranges</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => append({ range: "" })}
              >
                <Plus className="h-3.5 w-3.5" /> Add Range
              </Button>
            </div>
            {fields.length === 0 && (
              <p className="text-[12.5px] text-muted-foreground">No ranges added.</p>
            )}
            <div className="grid grid-cols-2 gap-2">
              {fields.map((row, index) => (
                <div key={row.id} className="grid grid-cols-[1fr_28px] gap-2 items-end">
                  <FormReferenceField<StockFormValues>
                    name={`ranges.${index}.rangeId`}
                    labelKey={`ranges.${index}.range`}
                    label="Range"
                    klass={ReferenceKlass.Range}
                    displayConfig={STOCK_RANGE_REFERENCE_DISPLAY}
                    placeholder="Search ranges…"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="h-8 text-muted-foreground hover:text-destructive"
                    aria-label="Remove range"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <FormTextareaField<StockFormValues>
              name="seoKeywords"
              label="Keywords"
              hint="Use : as separator"
              rows={2}
              minHeightClass=""
              className="[&_textarea]:mt-2"
            />
          </div>
        </div>
      </EditCard>
    </TabsContent>
  );
}
