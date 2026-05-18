import { Field } from "@/components/form-primitives";
import { ReferenceSelect, type ReferenceSelectProps } from "@/components/reference-select";
import type { ReferenceOption } from "@/lib/reference";

export interface ReferenceFieldProps extends Omit<ReferenceSelectProps, "onChange"> {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  onChange: (id: string | number | null, option?: ReferenceOption) => void;
}

/** `Field` + `ReferenceSelect` for entity edit forms. */
export function ReferenceField({
  label,
  required,
  hint,
  className,
  onChange,
  ...selectProps
}: ReferenceFieldProps) {
  return (
    <Field label={label} required={required} hint={hint} className={className}>
      <ReferenceSelect {...selectProps} onChange={onChange} />
    </Field>
  );
}
