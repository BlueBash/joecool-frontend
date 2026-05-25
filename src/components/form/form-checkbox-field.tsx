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
  /** Label beside the control (e.g. flag grids) instead of above. */
  inline?: boolean;
}

function FormCheckboxFieldInner<T extends FieldValues>({
  name,
  label,
  description,
  required,
  className,
  disabled,
  variant = "checkbox",
  inline,
}: FormCheckboxFieldProps<T>) {
  const {
    control: formControl,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;
  const errorId = error ? `${String(name)}-error` : undefined;

  const fieldControl = (
    <Controller
      control={formControl}
      name={name}
      render={({ field }) =>
        variant === "switch" ? (
          <div className="h-8 inline-flex items-center gap-2">
            <Switch
              checked={!!field.value}
              onCheckedChange={field.onChange}
              disabled={disabled ?? isSubmitting}
            />
            {(description || (inline && label)) && (
              <span className="text-[13px] text-muted-foreground">{description ?? label}</span>
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
            {inline ? label : (description ?? null)}
          </label>
        )
      }
    />
  );

  if (inline) {
    return (
      <div className={className}>
        {fieldControl}
        <FieldError id={errorId} message={error} />
      </div>
    );
  }

  return (
    <Field label={label} required={required} className={className}>
      {fieldControl}
      <FieldError id={errorId} message={error} />
    </Field>
  );
}

export const FormCheckboxField = memo(FormCheckboxFieldInner) as typeof FormCheckboxFieldInner;
