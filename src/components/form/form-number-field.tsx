import { memo } from "react";
import { useFormContext, type FieldPath, type FieldValues } from "react-hook-form";
import { Field } from "@/components/form-primitives";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldError } from "./field-error";

export interface FormNumberFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  inputClassName?: string;
  step?: string | number;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

function FormNumberFieldInner<T extends FieldValues>({
  name,
  label,
  required,
  hint,
  className,
  inputClassName,
  step,
  placeholder,
  disabled,
  readOnly,
}: FormNumberFieldProps<T>) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;
  const errorId = error ? `${String(name)}-error` : undefined;

  return (
    <Field label={label} required={required} hint={hint} className={className}>
      <Input
        type="number"
        step={step}
        placeholder={placeholder}
        disabled={disabled ?? isSubmitting}
        readOnly={readOnly}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={cn("h-8 tabular-nums text-[13px]", inputClassName)}
        {...register(name, { valueAsNumber: true })}
      />
      <FieldError id={errorId} message={error} />
    </Field>
  );
}

export const FormNumberField = memo(FormNumberFieldInner) as typeof FormNumberFieldInner;
