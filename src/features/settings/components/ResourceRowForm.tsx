import { useEffect, useId, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/api/_client";
import {
  applyApiFieldErrors,
  buildSettingsFormSchema,
  firstFormErrorMessage,
  type SettingsFormValues,
} from "@/lib/form";
import type { FormMode, SettingsResourceEntry } from "../types";
import { toFormPayload, toFormValues } from "../utils";
import { FieldControl } from "./FieldControl";

interface ResourceRowFormProps {
  entry: SettingsResourceEntry;
  mode: FormMode;
  onDone: () => void;
}

export function ResourceRowForm({ entry, mode, onDone }: ResourceRowFormProps) {
  const { resource, fields, singular } = entry;
  const isEdit = mode.kind === "edit";
  const formId = useId();

  const detail = resource.hooks.useDetail(isEdit ? mode.id : null);
  const create = resource.hooks.useCreate();
  const update = resource.hooks.useUpdate();

  const schema = useMemo(() => buildSettingsFormSchema(fields), [fields]);

  const initialValues = useMemo(
    () => toFormValues(fields, isEdit ? detail.data : undefined),
    [fields, isEdit, detail.data],
  );

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
    mode: "onTouched",
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const busy = create.isPending || update.isPending || (isEdit && detail.isLoading) || isSubmitting;

  const onSubmit = handleSubmit(
    (values) => {
      const payload = toFormPayload(fields, values);
      const wire = entry.mapWritePayload ? entry.mapWritePayload(payload) : payload;

      const onSuccess = () => {
        toast.success(isEdit ? `${singular} updated` : `${singular} created`);
        onDone();
      };

      const onError = (err: ApiError) => {
        if (applyApiFieldErrors(setError, err)) return;
        if (!err.fieldErrors) return;
      };

      if (isEdit) {
        update.mutate({ id: mode.id, data: wire }, { onSuccess, onError });
      } else {
        create.mutate(wire, { onSuccess, onError });
      }
    },
    (errors) => {
      toast.error(firstFormErrorMessage(errors) ?? "Please fix the highlighted fields");
    },
  );

  return (
    <form
      id={formId}
      onSubmit={onSubmit}
      className="px-4 py-3"
      noValidate
      aria-label={isEdit ? `Edit ${singular}` : `Add ${singular}`}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_2fr_auto] md:items-start">
        {fields.map((f) => (
          <Controller
            key={f.name}
            control={control}
            name={f.name}
            render={({ field, fieldState }) => (
              <FieldControl
                field={f}
                value={field.value ?? ""}
                error={fieldState.error?.message}
                disabled={busy}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        ))}

        <div className="flex items-center justify-end gap-2 md:pt-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            onClick={onDone}
            disabled={busy}
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className="h-8 gap-1.5"
            disabled={busy}
            aria-busy={busy}
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <Check className="h-3.5 w-3.5" aria-hidden />
            )}
            {isEdit ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </form>
  );
}
