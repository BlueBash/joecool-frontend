import { useFormContext } from "react-hook-form";
import { FormTextField } from "@/components/form";
import type { StockFormValues } from "../stock-form-schema";
import { STOCK_FIELD_CLASS } from "./field-classes";
import { dimensionSlotKey } from "./dimension-sizes";

export function DimensionSpecSizeFields() {
  const { TXT } = STOCK_FIELD_CLASS;
  const { watch } = useFormContext<StockFormValues>();
  const slotCount = watch("dimensionSpecSlotCount") ?? 0;

  if (slotCount <= 0) return null;

  return (
    <div className="border-t border-border pt-4">
      <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Dimensions
      </p>
      <div className="h-40 overflow-y-auto">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: slotCount }, (_, i) => {
            const index = i + 1;
            const key = dimensionSlotKey(index);
            return (
              <FormTextField<StockFormValues>
                key={key}
                name={`dimensionNoOfDimension.${key}`}
                label={`Dimension ${index}`}
                inputClassName={TXT}
                placeholder={`Enter dimension ${index}…`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
