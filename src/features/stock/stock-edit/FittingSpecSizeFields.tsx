import { useFormContext } from "react-hook-form";
import { FormTextField } from "@/components/form";
import type { StockFormValues } from "../stock-form-schema";
import { STOCK_FIELD_CLASS } from "./field-classes";
import { fittingSizeSlotKey } from "./fitting-sizes";

export function FittingSpecSizeFields() {
  const { TXT } = STOCK_FIELD_CLASS;
  const { watch } = useFormContext<StockFormValues>();
  const slotCount = watch("fittingSpecSlotCount") ?? 0;

  if (slotCount <= 0) return null;

  return (
    <div className="border-t border-border pt-4">
      <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Sizes
      </p>
      <div className="h-40 overflow-y-auto">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: slotCount }, (_, i) => {
            const index = i + 1;
            const key = fittingSizeSlotKey(index);
            return (
              <FormTextField<StockFormValues>
                key={key}
                name={`fittingNoOfSizes.${key}`}
                label={`Size ${index}`}
                inputClassName={TXT}
                placeholder={`Enter size ${index}…`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
