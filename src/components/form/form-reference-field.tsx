import { memo } from "react";
import { Controller, useFormContext, type FieldPath, type FieldValues } from "react-hook-form";
import { ReferenceSelect, type ReferenceSelectProps } from "@/components/reference-select";
import { Field } from "@/components/form-primitives";
import type { ReferenceOption } from "@/lib/reference";
import { FieldError } from "./field-error";

export interface FormReferenceFieldProps<T extends FieldValues>
  extends Omit<ReferenceSelectProps, "value" | "onChange"> {
  name: FieldPath<T>;
  labelKey?: FieldPath<T>;
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
}

function refId(v: string | number | null): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function FormReferenceFieldInner<T extends FieldValues>({
  name,
  labelKey,
  label,
  required,
  hint,
  className,
  disabled,
  ...selectProps
}: FormReferenceFieldProps<T>) {
  const {
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;
  const errorId = error ? `${String(name)}-error` : undefined;
  const displayLabel = labelKey ? (watch(labelKey) as string | undefined) : undefined;

  return (
    <Field label={label} required={required} hint={hint} className={className}>
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
              if (labelKey && opt) {
                setValue(labelKey, opt.name as never, { shouldDirty: true });
              }
            }}
          />
        )}
      />
      <FieldError id={errorId} message={error} />
    </Field>
  );
}

export const FormReferenceField = memo(FormReferenceFieldInner) as typeof FormReferenceFieldInner;
