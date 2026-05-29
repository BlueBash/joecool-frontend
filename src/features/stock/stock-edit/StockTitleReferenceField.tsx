import { memo } from "react";
import { Controller, useFormContext, type FieldPath, type FieldValues } from "react-hook-form";
import { ReferenceSelect, type ReferenceSelectProps } from "@/components/reference-select";
import { Field } from "@/components/form-primitives";
import { FieldError } from "@/components/form/field-error";
import { Checkbox } from "@/components/ui/checkbox";
import { referenceDisplayText, type ReferenceOption } from "@/lib/reference";
import { referenceNameForTitle } from "./stock-title-composition";
import type { StockFormValues } from "../stock-form-schema";
import { useStockTitleCompositionContext } from "./StockTitleCompositionContext";
import { refId } from "./utils";

export interface StockTitleReferenceFieldProps<T extends FieldValues>
  extends Omit<ReferenceSelectProps, "value" | "onChange"> {
  name: FieldPath<T>;
  labelKey?: FieldPath<T>;
  amountKey?: FieldPath<T>;
  showInTitleName: FieldPath<StockFormValues>;
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  onReferenceChange?: (id: string | number | null, opt?: ReferenceOption) => void;
}

function StockTitleReferenceFieldInner<T extends FieldValues>({
  name,
  labelKey,
  amountKey,
  showInTitleName,
  label,
  required,
  hint,
  className,
  disabled,
  onReferenceChange,
  ...selectProps
}: StockTitleReferenceFieldProps<T>) {
  const { applyReferenceSelection, setShowInTitle } = useStockTitleCompositionContext();
  const {
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;
  const errorId = error ? `${String(name)}-error` : undefined;
  const displayLabel = labelKey ? (watch(labelKey) as string | undefined) : undefined;
  const fieldValue = watch(name);
  const hasValue = fieldValue != null && fieldValue !== "";
  const showChecked = !!watch(showInTitleName as FieldPath<T>);

  return (
    <Field label={label} required={required} hint={hint} className={className}>
      <div className="flex gap-2 items-center">
        <div className="flex shrink-0 items-center pt-0.5" title="Include in title">
          <Checkbox
            size="sm"
            checked={showChecked}
            disabled={!hasValue || disabled || isSubmitting}
            aria-label={`Include ${label} in title`}
            onCheckedChange={(v) => setShowInTitle(showInTitleName, Boolean(v))}
          />
        </div>
        <div className="flex-1 min-w-0">
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <ReferenceSelect
                {...selectProps}
                value={field.value ?? null}
                displayLabel={displayLabel}
                disabled={disabled ?? isSubmitting}
                onChange={(id, opt?: ReferenceOption) => {
                  field.onChange(refId(id));
                  const dirty = { shouldDirty: true };
                  const cleared = id == null || id === "";
                  if (labelKey) {
                    if (opt) {
                      const labelText = amountKey
                        ? referenceDisplayText(opt, selectProps.displayConfig)
                        : referenceNameForTitle(opt, selectProps.displayConfig);
                      setValue(labelKey, labelText as never, dirty);
                    } else if (cleared) {
                      setValue(labelKey, "" as never, dirty);
                    }
                  }
                  if (amountKey) {
                    if (opt) {
                      setValue(amountKey, (Number(opt.cost) || 0) as never, dirty);
                    } else if (cleared) {
                      setValue(amountKey, 0 as never, dirty);
                    }
                  }
                  onReferenceChange?.(id, opt);
                  applyReferenceSelection(showInTitleName, opt, cleared);
                }}
              />
            )}
          />
        </div>
      </div>
      <FieldError id={errorId} message={error} />
    </Field>
  );
}

export const StockTitleReferenceField = memo(
  StockTitleReferenceFieldInner,
) as typeof StockTitleReferenceFieldInner;
