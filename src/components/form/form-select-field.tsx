import { memo, type ReactNode } from "react";
import { Controller, useFormContext, type FieldPath, type FieldValues } from "react-hook-form";
import { Field } from "@/components/form-primitives";
import { cn } from "@/lib/utils";
import { FieldError } from "./field-error";

const SELECT_CLASS =
  "h-8 px-2 rounded border border-border bg-background text-[13px] w-full";

export interface FormSelectFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  disabled?: boolean;
  children: ReactNode;
}

function FormSelectFieldInner<T extends FieldValues>({
  name,
  label,
  required,
  hint,
  className,
  disabled,
  children,
}: FormSelectFieldProps<T>) {
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
          <select
            {...field}
            value={field.value ?? ""}
            disabled={disabled ?? isSubmitting}
            aria-invalid={!!error}
            aria-describedby={errorId}
            className={cn(SELECT_CLASS, error && "border-destructive")}
          >
            {children}
          </select>
        )}
      />
      <FieldError id={errorId} message={error} />
    </Field>
  );
}

export const FormSelectField = memo(FormSelectFieldInner) as typeof FormSelectFieldInner;
