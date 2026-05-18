import { memo } from "react";
import { useFormContext, type FieldPath, type FieldValues } from "react-hook-form";
import { Field } from "@/components/form-primitives";
import { cn } from "@/lib/utils";
import { FieldError } from "./field-error";

export interface FormTextareaFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  minHeightClass?: string;
}

function FormTextareaFieldInner<T extends FieldValues>({
  name,
  label,
  required,
  hint,
  className,
  rows,
  placeholder,
  disabled,
  minHeightClass = "min-h-[160px]",
}: FormTextareaFieldProps<T>) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;
  const errorId = error ? `${String(name)}-error` : undefined;

  const textarea = (
    <textarea
      rows={rows}
      placeholder={placeholder}
      disabled={disabled ?? isSubmitting}
      aria-invalid={!!error}
      aria-describedby={errorId}
      className={cn(
        "w-full p-2 rounded-md border border-border bg-background text-[13px] resize-y",
        minHeightClass,
      )}
      {...register(name)}
    />
  );

  if (!label) {
    return (
      <div className={className}>
        {textarea}
        <FieldError id={errorId} message={error} />
      </div>
    );
  }

  return (
    <Field label={label} required={required} hint={hint} className={className}>
      {textarea}
      <FieldError id={errorId} message={error} />
    </Field>
  );
}

export const FormTextareaField = memo(FormTextareaFieldInner) as typeof FormTextareaFieldInner;
