import { cn } from "@/lib/utils";

interface FormGridProps {
  cols?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}

export function FormGrid({ cols = 3, children, className }: FormGridProps) {
  const map = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  } as const;
  return (
    <div className={cn("grid grid-cols-1 gap-x-4 gap-y-3", map[cols], className)}>{children}</div>
  );
}

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <section className={cn("py-3", className)}>
      {title && (
        <header className="mb-2.5 flex items-baseline justify-between">
          <h3 className="text-[13px] font-semibold tracking-tight">{title}</h3>
          {description && <p className="text-[12px] text-muted-foreground">{description}</p>}
        </header>
      )}
      {children}
    </section>
  );
}

interface FieldProps {
  label: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
  fieldLabelAction?: React.ReactNode;
  fieldLabelActionClasses?: string;
  className?: string;
  required?: boolean;
}

export function Field({
  label,
  fieldLabelAction,
  fieldLabelActionClasses,
  hint,
  children,
  className,
  required,
}: FieldProps) {
  return (
    <label className={cn("flex flex-col gap-1", className)}>
      <span className="text-[12px] font-medium text-foreground/80">
        {fieldLabelAction ? (
          <span className={`${fieldLabelActionClasses}`}>
            <span>
              {label}
              {required && <span className="text-destructive ml-0.5">*</span>}
            </span>
            {fieldLabelAction}
          </span>
        ) : (
          <span>
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </span>
        )}
      </span>
      {children}
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}
