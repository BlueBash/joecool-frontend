import { memo, type ReactNode } from "react";
import { Controller, useFormContext, type FieldPath, type FieldValues } from "react-hook-form";
import { Field } from "@/components/form-primitives";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { FieldError } from "./field-error";

export interface FormCheckboxFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  description?: ReactNode;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  variant?: "checkbox" | "switch";
}

function FormCheckboxFieldInner<T extends FieldValues>({
  name,
  label,
  description,
  required,
  className,
  disabled,
  variant = "checkbox",
}: FormCheckboxFieldProps<T>) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;
  const errorId = error ? `${String(name)}-error` : undefined;

  return (
    <Field label={label} required={required} className={className}>
      <Controller
        control={control}
        name={name}
        render={({ field }) =>
          variant === "switch" ? (
            <div className="h-8 inline-flex items-center gap-2">
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
                disabled={disabled ?? isSubmitting}
              />
              {description && (
                <span className="text-[13px] text-muted-foreground">{description}</span>
              )}
            </div>
          ) : (
            <label className="inline-flex items-center gap-2 text-[13px] cursor-pointer">
              <Checkbox
                checked={!!field.value}
                onCheckedChange={(v) => field.onChange(Boolean(v))}
                onBlur={field.onBlur}
                ref={field.ref}
                disabled={disabled ?? isSubmitting}
                aria-invalid={!!error}
                aria-describedby={errorId}
              />
              {description ?? null}
            </label>
          )
        }
      />
      <FieldError id={errorId} message={error} />
    </Field>
  );
}

export const FormCheckboxField = memo(FormCheckboxFieldInner) as typeof FormCheckboxFieldInner;
