import { useId, type ChangeEvent } from "react";
import { ReferenceSelect } from "@/components/reference-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldDef } from "../types";

interface FieldControlProps {
  field: FieldDef;
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export function FieldControl({ field, value, error, disabled, onChange, onBlur }: FieldControlProps) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange(e.target.value);

  const ariaProps = {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": errorId,
    "aria-required": field.required || undefined,
  } as const;

  return (
    <div className="flex flex-col gap-1">
      <Label
        htmlFor={id}
        className="text-[11px] uppercase tracking-wide text-muted-foreground"
      >
        {field.label}
        {field.required && <span className="text-destructive ml-0.5">*</span>}
      </Label>

      {field.kind === "reference" && field.referenceKlass ? (
        <ReferenceSelect
          klass={field.referenceKlass}
          value={value || null}
          placeholder={field.placeholder ?? "Search…"}
          disabled={disabled}
          inputClassName="h-8 text-[13px]"
          onChange={(id) => onChange(id == null ? "" : String(id))}
        />
      ) : field.kind === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={field.placeholder}
          disabled={disabled}
          maxLength={field.maxLength}
          rows={2}
          className="min-h-[36px] rounded-md border border-input bg-background px-3 py-1.5 text-[13px] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          {...ariaProps}
        />
      ) : (
        <Input
          id={id}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={field.placeholder}
          disabled={disabled}
          maxLength={field.maxLength}
          className="h-8 text-[13px]"
          {...ariaProps}
        />
      )}

      {error && (
        <p id={errorId} role="alert" className="text-[12px] text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
