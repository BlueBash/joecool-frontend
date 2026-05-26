import { Controller, useFormContext } from "react-hook-form";
import { ReferenceSelect } from "@/components/reference-select";
import { Field } from "@/components/form-primitives";
import { FieldError } from "@/components/form";
import { referenceLabel, type ReferenceOption } from "@/lib/reference";
import { ReferenceKlass } from "@/lib/reference-registry";
import type { StockFormValues } from "../stock-form-schema";
import { STOCK_FIELD_CLASS } from "./field-classes";
import {
  dimensionSpecValuesCountFromOption,
  resizeDimensionNoOfDimension,
} from "./dimension-sizes";
import { refId } from "./utils";
import { DimensionSpecSizeFields } from "./DimensionSpecSizeFields";

export function DimensionSpecField() {
  const { TXT } = STOCK_FIELD_CLASS;
  const {
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<StockFormValues>();
  const displayLabel = watch("dimensionSpec") as string | undefined;
  const error = errors.dimensionSpecId?.message as string | undefined;

  return (
    <>
      <Field label="Dimension Spec" required={false}>
        <Controller
          control={control}
          name="dimensionSpecId"
          render={({ field }) => (
            <ReferenceSelect
              klass={ReferenceKlass.DimensionSpec}
              value={field.value ?? null}
              displayLabel={displayLabel}
              disabled={isSubmitting}
              inputClassName={TXT}
              placeholder="Search specs…"
              onChange={(id, opt?: ReferenceOption) => {
                field.onChange(refId(id));
                const count = dimensionSpecValuesCountFromOption(opt);
                if (opt) {
                  setValue("dimensionSpec", referenceLabel(opt) as never, { shouldDirty: true });
                } else if (id == null || id === "") {
                  setValue("dimensionSpec", "" as never, { shouldDirty: true });
                }
                setValue("dimensionSpecSlotCount", count as never, { shouldDirty: true });
                const current = watch("dimensionNoOfDimension") as
                  | Record<string, string>
                  | undefined;
                setValue(
                  "dimensionNoOfDimension",
                  resizeDimensionNoOfDimension(current, count) as never,
                  { shouldDirty: true },
                );
              }}
            />
          )}
        />
        <FieldError id={error ? "dimensionSpecId-error" : undefined} message={error} />
      </Field>
      <DimensionSpecSizeFields />
    </>
  );
}
