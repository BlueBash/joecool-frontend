import { memo } from "react";
import { Controller, useFormContext, type FieldPath, type FieldValues } from "react-hook-form";
import { DateField } from "@/components/date-field";
import { Field } from "@/components/form-primitives";
import { FieldError } from "./field-error";

export interface FormDateFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
}

function FormDateFieldInner<T extends FieldValues>({
  name,
  label,
  required,
  hint,
  className,
  inputClassName,
  disabled,
  readOnly,
  placeholder,
}: FormDateFieldProps<T>) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;
  const errorId = error ? `${String(name)}-error` : undefined;

  return (
    <Field label={label} required={required} hint={hint} className={className}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DateField
            id={String(name)}
            name={field.name}
            value={field.value ?? ""}
            onChange={(v) => field.onChange(v ?? "")}
            onBlur={field.onBlur}
            disabled={disabled ?? isSubmitting}
            readOnly={readOnly}
            placeholder={placeholder}
            inputClassName={inputClassName}
            aria-invalid={!!error}
            aria-describedby={errorId}
          />
        )}
      />
      <FieldError id={errorId} message={error} />
    </Field>
  );
}

export const FormDateField = memo(FormDateFieldInner) as typeof FormDateFieldInner;
