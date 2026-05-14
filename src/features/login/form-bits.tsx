interface FieldErrorProps {
  id?: string;
  message?: string;
}

/** Tiny presentational helper for inline form validation messages. */
export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs text-destructive">
      {message}
    </p>
  );
}
