interface FieldErrorProps {
  id?: string;
  message?: string;
}

/** Inline validation message for form fields. */
export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-[11px] text-destructive">
      {message}
    </p>
  );
}
