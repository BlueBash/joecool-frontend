import { FormProvider, type FieldValues, type UseFormReturn } from "react-hook-form";

interface FormRootProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

/** Wraps children with `FormProvider` and a native `<form>`. */
export function FormRoot<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  id,
  "aria-label": ariaLabel,
}: FormRootProps<T>) {
  return (
    <FormProvider {...form}>
      <form id={id} className={className} onSubmit={onSubmit} noValidate aria-label={ariaLabel}>
        {children}
      </form>
    </FormProvider>
  );
}
