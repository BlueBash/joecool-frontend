import { useEffect, useRef } from "react";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

export interface UseEntityFormOptions<T extends FieldValues> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodType<T, FieldValues, any>;
  defaultValues: DefaultValues<T>;
  /** When set, resets the form (e.g. API detail loaded). */
  resetValues?: T | null;
  /** Extra dependency for reset — pass detail id so create→edit transitions reset. */
  resetKey?: string | number | boolean;
  formOptions?: Omit<UseFormProps<T>, "defaultValues" | "resolver">;
}

export interface UseEntityFormResult<T extends FieldValues> extends UseFormReturn<T> {
  isDirty: boolean;
  isSubmitting: boolean;
}

/**
 * Entity edit/create forms: Zod validation, reset when async data arrives,
 * `onTouched` mode to limit re-renders.
 */
export function useEntityForm<T extends FieldValues>({
  schema,
  defaultValues,
  resetValues,
  resetKey,
  formOptions,
}: UseEntityFormOptions<T>): UseEntityFormResult<T> {
  const form = useForm<T>({
    resolver: zodResolver(schema) as UseFormProps<T>["resolver"],
    defaultValues,
    mode: "onTouched",
    ...formOptions,
  });

  const { reset, formState } = form;
  const seededRef = useRef(false);

  useEffect(() => {
    if (resetValues == null) return;
    reset(resetValues, { keepDefaultValues: false });
    seededRef.current = true;
  }, [reset, resetValues, resetKey]);

  useEffect(() => {
    if (resetValues != null || seededRef.current) return;
    reset(defaultValues, { keepDefaultValues: true });
  }, [defaultValues, reset, resetValues]);

  return {
    ...form,
    isDirty: formState.isDirty,
    isSubmitting: formState.isSubmitting,
  };
}
