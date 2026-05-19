import { useEffect, useId, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/api/_client";
import { QueryState } from "@/components/states/QueryState";
import {
  applyApiFieldErrors,
  buildSettingsFormSchema,
  firstFormErrorMessage,
  type SettingsFormValues,
} from "@/lib/form";
import type { SettingsFormEntry } from "../types";
import { toFormPayload, toFormValues } from "../utils";
import { FieldControl } from "./FieldControl";

interface SettingsResourceFormProps {
  entry: SettingsFormEntry;
  title: string;
}

export function SettingsResourceForm({ entry, title }: SettingsResourceFormProps) {
  const { resource, fields, singular, recordId } = entry;
  const formId = useId();

  const list = resource.hooks.useList(
    recordId ? undefined : { page: 1, pageSize: 1 },
    { enabled: !recordId },
  );

  const resolvedId = recordId ?? list.data?.items[0]?.id ?? null;
  const isEdit = resolvedId != null;

  const detail = resource.hooks.useDetail(isEdit ? resolvedId : null);
  const create = resource.hooks.useCreate();
  const update = resource.hooks.useUpdate();

  const schema = useMemo(() => buildSettingsFormSchema(fields), [fields]);

  const initialValues = useMemo(
    () =>
      toFormValues(fields, isEdit ? detail.data : undefined, {
        mapFromRow: entry.mapFromRow,
      }),
    [fields, isEdit, detail.data, entry.mapFromRow],
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

  const busy =
    create.isPending || update.isPending || (isEdit && detail.isLoading) || isSubmitting;

  const onSubmit = handleSubmit(
    (values) => {
      const payload = toFormPayload(fields, values);
      const wire = entry.mapWritePayload ? entry.mapWritePayload(payload) : payload;

      const onSuccess = () => {
        toast.success(isEdit ? `${singular} updated` : `${singular} created`);
      };

      const onError = (err: ApiError) => {
        if (applyApiFieldErrors(setError, err)) return;
        if (!err.fieldErrors) toast.error(err.message);
      };

      if (isEdit && resolvedId) {
        update.mutate({ id: resolvedId, data: wire }, { onSuccess, onError });
      } else {
        create.mutate(wire, { onSuccess, onError });
      }
    },
    (errors) => {
      toast.error(firstFormErrorMessage(errors) ?? "Please fix the highlighted fields");
    },
  );

  const formBody = (
    <form
      id={formId}
      onSubmit={onSubmit}
      className="max-w-2xl space-y-4 p-5"
      noValidate
      aria-label={title}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="sm" className="h-8 gap-1.5" disabled={busy} aria-busy={busy}>
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : (
            <Check className="h-3.5 w-3.5" aria-hidden />
          )}
          {isEdit ? "Save" : "Create"}
        </Button>
      </div>
    </form>
  );

  if (recordId) {
    return (
      <QueryState query={detail}>
        {() => formBody}
      </QueryState>
    );
  }

  return (
    <QueryState query={list} isEmpty={() => false}>
      {() =>
        isEdit ? (
          <QueryState query={detail}>
            {() => formBody}
          </QueryState>
        ) : (
          formBody
        )
      }
    </QueryState>
  );
}
