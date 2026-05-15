import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/api/_client";
import type { FormErrors, FormMode, FormValues, SettingsResourceEntry } from "../types";
import { hasErrors, toFormPayload, toFormValues, validateFormValues } from "../utils";
import { FieldControl } from "./FieldControl";

interface ResourceRowFormProps {
  entry: SettingsResourceEntry;
  mode: FormMode;
  onDone: () => void;
}

export function ResourceRowForm({ entry, mode, onDone }: ResourceRowFormProps) {
  const { resource, fields, singular } = entry;
  const isEdit = mode.kind === "edit";

  const detail = resource.hooks.useDetail(isEdit ? mode.id : null);
  const create = resource.hooks.useCreate();
  const update = resource.hooks.useUpdate();

  const initialValues = useMemo(
    () => toFormValues(fields, isEdit ? detail.data : undefined),
    [fields, isEdit, detail.data],
  );

  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);
  const formId = useId();

  useEffect(() => {
    if (!touched) setValues(initialValues);
  }, [initialValues, touched]);

  const busy = create.isPending || update.isPending || (isEdit && detail.isLoading);

  const setField = (name: string, value: string) => {
    setTouched(true);
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = validateFormValues(fields, values);
    setErrors(next);
    if (hasErrors(next)) return;

    const payload = toFormPayload(fields, values);
    const wire = entry.mapWritePayload ? entry.mapWritePayload(payload) : payload;

    const onSuccess = () => {
      toast.success(isEdit ? `${singular} updated` : `${singular} created`);
      onDone();
    };

    const onError = (err: ApiError) => {
      if (!err.fieldErrors) return; // global handler already toasted
      const fieldErrors: FormErrors = {};
      for (const [k, msgs] of Object.entries(err.fieldErrors)) {
        if (msgs?.[0]) fieldErrors[k] = msgs[0];
      }
      setErrors(fieldErrors);
    };

    if (isEdit) {
      update.mutate({ id: mode.id, data: wire }, { onSuccess, onError });
    } else {
      create.mutate(wire, { onSuccess, onError });
    }
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className="px-4 py-3"
      noValidate
      aria-label={isEdit ? `Edit ${singular}` : `Add ${singular}`}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_2fr_auto] md:items-start">
        {fields.map((f) => (
          <FieldControl
            key={f.name}
            field={f}
            value={values[f.name] ?? ""}
            error={errors[f.name]}
            disabled={busy}
            onChange={(v) => setField(f.name, v)}
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
