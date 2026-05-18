import { memo } from "react";
import { useFormContext, type FieldPath, type FieldValues } from "react-hook-form";
import { Field } from "@/components/form-primitives";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldError } from "./field-error";

export interface FormTextFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  inputClassName?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  mono?: boolean;
  onBlurTransform?: (value: string) => string;
}

function FormTextFieldInner<T extends FieldValues>({
  name,
  label,
  required,
  hint,
  className,
  inputClassName,
  type = "text",
  placeholder,
  disabled,
  readOnly,
  mono,
  onBlurTransform,
}: FormTextFieldProps<T>) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;
  const errorId = error ? `${String(name)}-error` : undefined;

  return (
    <Field label={label} required={required} hint={hint} className={className}>
      <Input
        type={type}
        placeholder={placeholder}
        disabled={disabled ?? isSubmitting}
        readOnly={readOnly}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={cn("h-8 text-[13px]", mono && "font-mono", inputClassName)}
        {...register(name, {
          setValueAs: onBlurTransform ? (v) => onBlurTransform(String(v ?? "")) : undefined,
        })}
      />
      <FieldError id={errorId} message={error} />
    </Field>
  );
}

export const FormTextField = memo(FormTextFieldInner) as typeof FormTextFieldInner;
