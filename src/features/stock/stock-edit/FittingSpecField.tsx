import { Controller, useFormContext } from "react-hook-form";
import { ReferenceSelect } from "@/components/reference-select";
import { Field } from "@/components/form-primitives";
import { FieldError } from "@/components/form";
import { referenceLabel, type ReferenceOption } from "@/lib/reference";
import { ReferenceKlass } from "@/lib/reference-registry";
import type { StockFormValues } from "../stock-form-schema";
import { STOCK_FIELD_CLASS } from "./field-classes";
import {
  fittingSpecValuesCountFromOption,
  resizeFittingNoOfSizes,
} from "./fitting-sizes";
import { refId } from "./utils";
import { FittingSpecSizeFields } from "./FittingSpecSizeFields";

export function FittingSpecField() {
  const { TXT } = STOCK_FIELD_CLASS;
  const {
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<StockFormValues>();
  const displayLabel = watch("fittingSpec") as string | undefined;
  const error = errors.fittingSpecId?.message as string | undefined;

  return (
    <>
      <Field label="Fitting Spec" required={false}>
        <Controller
          control={control}
          name="fittingSpecId"
          render={({ field }) => (
            <ReferenceSelect
              klass={ReferenceKlass.FittingSizeSpec}
              value={field.value ?? null}
              displayLabel={displayLabel}
              disabled={isSubmitting}
              inputClassName={TXT}
              placeholder="Search specs…"
              onChange={(id, opt?: ReferenceOption) => {
                field.onChange(refId(id));
                const count = fittingSpecValuesCountFromOption(opt);
                if (opt) {
                  setValue("fittingSpec", referenceLabel(opt) as never, { shouldDirty: true });
                } else if (id == null || id === "") {
                  setValue("fittingSpec", "" as never, { shouldDirty: true });
                }
                setValue("fittingSpecSlotCount", count as never, { shouldDirty: true });
                const current = watch("fittingNoOfSizes") as Record<string, string> | undefined;
                setValue(
                  "fittingNoOfSizes",
                  resizeFittingNoOfSizes(current, count) as never,
                  { shouldDirty: true },
                );
              }}
            />
          )}
        />
        <FieldError id={error ? "fittingSpecId-error" : undefined} message={error} />
      </Field>
      <FittingSpecSizeFields />
    </>
  );
}
