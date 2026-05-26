import { memo, useMemo } from "react";
import { Controller, useFormContext, type FieldPath, type FieldValues } from "react-hook-form";
import { ReferenceSelect, type ReferenceSelectProps } from "@/components/reference-select";
import { Field } from "@/components/form-primitives";
import { useReferenceOptions } from "@/hooks/use-reference-options";
import type { ReferenceDisplayConfig } from "@/lib/reference-display";
import {
  referenceLabel,
  referenceOptionMatchesLabel,
} from "@/lib/reference-display";
import type { ReferenceOption } from "@/lib/reference";
import { FieldError } from "./field-error";

export interface FormReferenceTextFieldProps<T extends FieldValues>
  extends Omit<ReferenceSelectProps, "value" | "onChange" | "displayLabel"> {
  name: FieldPath<T>;
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  displayConfig?: ReferenceDisplayConfig;
}

function FormReferenceTextFieldInner<T extends FieldValues>({
  name,
  label,
  required,
  hint,
  className,
  disabled,
  displayConfig,
  ...selectProps
}: FormReferenceTextFieldProps<T>) {
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
          <ReferenceTextSelect
            {...selectProps}
            displayConfig={displayConfig}
            value={String(field.value ?? "")}
            disabled={disabled ?? isSubmitting}
            onChange={(next) => field.onChange(next)}
          />
        )}
      />
      <FieldError id={errorId} message={error} />
    </Field>
  );
}

type ReferenceTextSelectProps = Omit<ReferenceSelectProps, "value" | "onChange" | "displayLabel"> & {
  value: string;
  displayConfig?: ReferenceDisplayConfig;
  onChange: (text: string) => void;
};

function ReferenceTextSelect({
  klass,
  value,
  displayConfig,
  onChange,
  ...selectProps
}: ReferenceTextSelectProps) {
  const trimmed = value.trim();
  const { options } = useReferenceOptions({
    klass,
    search: "",
    enabled: trimmed.length > 0,
    displayConfig,
  });

  const matchedId = useMemo(() => {
    const opt = options.find((o) => referenceOptionMatchesLabel(o, trimmed, displayConfig));
    return opt?.id ?? null;
  }, [options, trimmed, displayConfig]);

  return (
    <ReferenceSelect
      {...selectProps}
      klass={klass}
      displayConfig={displayConfig}
      value={matchedId}
      displayLabel={trimmed.length > 0 ? trimmed : undefined}
      onChange={(id, opt?: ReferenceOption) => {
        if (id == null || id === "" || !opt) {
          onChange("");
          return;
        }
        onChange(referenceLabel(opt, displayConfig));
      }}
    />
  );
}

export const FormReferenceTextField = memo(
  FormReferenceTextFieldInner,
) as typeof FormReferenceTextFieldInner;
