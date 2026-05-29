import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { useForgotPasswordMutation } from "@/api/auth";
import type { ApiError } from "@/api/_client";
import { permissions } from "@/api/permissions";
import { roles } from "@/api/roles";
import { EditScreen, EditCard } from "@/components/edit-screen";
import { FormCheckboxField, FormRoot, FormSelectField, FormTextField } from "@/components/form";
import { FormGrid } from "@/components/form-primitives";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/pill";
import { CopyableCode } from "@/components/app-shell";
import { applyApiFieldErrors, firstFormErrorMessage, useEntityForm } from "@/lib/form";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { toast } from "sonner";
import { createOperatorFormSchema, type OperatorFormValues } from "./operator-form-schema";
import {
  useOperatorCreate,
  useOperatorDelete,
  useOperatorDetail,
  useOperatorUpdate,
} from "./hooks";
import { mapRowToOperator, operatorToPayload } from "./map-operator";

const routeApi = getRouteApi("/operator/$id");

const UI_ROLES = ["Admin", "Manager", "Staff", "Viewer"] as const;

function blankOperatorForm(): OperatorFormValues {
  return {
    id: "",
    code: "",
    name: "",
    email: "",
    role: "Staff",
    active: true,
    lastSeen: "—",
    password: "",
    permissions: [],
  };
}

export function OperatorEditPage() {
  const { id } = routeApi.useParams();
  const nav = useNavigate();
  const isNew = id === "new";
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set());

  const detailQuery = useOperatorDetail(id, !isNew);
  const rolesQuery = roles.hooks.useList({ pageSize: 200 });
  const permissionsQuery = permissions.hooks.useList({ pageSize: 500 });

  const resetValues = useMemo(() => {
    if (isNew) return blankOperatorForm();
    if (!detailQuery.data) return null;
    const mapped = mapRowToOperator(detailQuery.data);
    const apiPerms = Array.isArray(detailQuery.data.permissions)
      ? detailQuery.data.permissions.map(String)
      : [];
    return {
      ...mapped,
      password: "",
      permissions: apiPerms,
    } satisfies OperatorFormValues;
  }, [isNew, detailQuery.data]);

  const form = useEntityForm({
    schema: createOperatorFormSchema(isNew),
    defaultValues: blankOperatorForm(),
    resetValues,
    resetKey: id,
  });

  const { handleSubmit, setError, watch, setValue, isDirty, isSubmitting } = form;

  const draft = watch();

  useEffect(() => {
    setSelectedPerms(new Set(draft.permissions ?? []));
  }, [draft.permissions]);

  const createOperator = useOperatorCreate();
  const updateOperator = useOperatorUpdate();
  const deleteOperator = useOperatorDelete();
  const forgotPassword = useForgotPasswordMutation();

  const deleteConfirm = useDeleteConfirm<{ id: string }>({
    onConfirm: async ({ id }) => {
      try {
        await deleteOperator.mutateAsync({ id });
        toast.success("Removed");
        nav({ to: "/operators" });
      } catch (err) {
        toast.error((err as ApiError)?.message ?? "Failed to delete operator");
        throw err;
      }
    },
  });

  const roleOptions = useMemo(() => {
    const fromApi = (rolesQuery.data?.items ?? []).map((r) => String(r.name ?? r.id));
    return fromApi.length > 0 ? fromApi : [...UI_ROLES];
  }, [rolesQuery.data?.items]);

  const permissionOptions = useMemo(
    () => (permissionsQuery.data?.items ?? []).map((p) => String(p.name ?? p.id)),
    [permissionsQuery.data?.items],
  );

  const isSaving = isSubmitting || createOperator.isPending || updateOperator.isPending;

  const togglePerm = (p: string) => {
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      setValue("permissions", [...next], { shouldDirty: true });
      return next;
    });
  };

  const onSubmit = handleSubmit(
    (values) => {
      const payload = operatorToPayload(
        {
          id: values.id,
          code: values.code.toUpperCase(),
          name: values.name,
          email: values.email ?? "",
          role: values.role,
          active: values.active,
          lastSeen: values.lastSeen,
        },
        {
          password: isNew ? values.password : undefined,
          roles: [values.role],
          permissions: [...selectedPerms],
        },
      );

      if (isNew) {
        createOperator.mutate(payload, {
          onSuccess: (row) => {
            toast.success("Operator created");
            nav({ to: "/operator/$id", params: { id: String(row.id) } });
          },
          onError: (err: ApiError) => {
            if (!applyApiFieldErrors(setError, err)) toast.error(err.message);
          },
        });
      } else {
        updateOperator.mutate(
          { id, data: payload },
          {
            onSuccess: () => {
              toast.success("Operator saved");
              nav({ to: "/operators" });
            },
            onError: (err: ApiError) => {
              if (!applyApiFieldErrors(setError, err)) toast.error(err.message);
            },
          },
        );
      }
    },
    (errors) => {
      toast.error(firstFormErrorMessage(errors) ?? "Please fix the highlighted fields");
    },
  );

  const onDelete = () => {
    if (isNew) {
      nav({ to: "/operators" });
      return;
    }
    deleteConfirm.requestDelete({
      title: "Delete operator",
      entityName: draft.name || draft.code,
      entityType: "operator",
      meta: { id },
    });
  };

  const sendReset = () => {
    const target = draft.email || draft.code;
    if (!target) {
      toast.error("Enter an email or code first");
      return;
    }
    forgotPassword.mutate(
      { code_or_email: target },
      {
        onSuccess: (res) => toast.success(res.message ?? "Reset link sent"),
        onError: (err: ApiError) => toast.error(err.message),
      },
    );
  };

  if (!isNew && detailQuery.isPending) {
    return (
      <EditScreen backTo="/operators" title="Loading operator…">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      </EditScreen>
    );
  }

  if (!isNew && detailQuery.isError) {
    return (
      <EditScreen backTo="/operators" title="Operator not found">
        <p className="text-muted-foreground text-[13px]">
          {(detailQuery.error as ApiError)?.message ?? "This operator may have been deleted."}
        </p>
      </EditScreen>
    );
  }

  return (
    <FormProvider {...form}>
      <DeleteConfirmDialog state={deleteConfirm} />
      <EditScreen
        backTo="/operators"
        backLabel="Back to Operators"
        title={isNew ? "New Operator" : draft.name || draft.code}
        subtitle={!isNew && <CopyableCode value={draft.code} />}
        badges={
          !isNew && (
            <Pill variant={draft.active ? "success" : "neutral"}>
              {draft.active ? "Active" : "Disabled"}
            </Pill>
          )
        }
        actions={
          <>
            {!isNew && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-destructive hover:text-destructive"
                onClick={onDelete}
                disabled={deleteOperator.isPending || deleteConfirm.isPending || isSaving}
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            )}
            <Button
              size="sm"
              className="h-8 gap-1.5"
              onClick={onSubmit}
              disabled={isSaving || (!isNew && !isDirty)}
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {isNew ? "Create" : "Save"}
            </Button>
          </>
        }
      >
        <FormRoot form={form} onSubmit={onSubmit}>
          <EditCard title="Account">
            <FormGrid cols={3}>
              <FormTextField<OperatorFormValues>
                name="code"
                label="Code"
                required
                mono
                onBlurTransform={(v) => v.toUpperCase()}
              />
              <FormTextField<OperatorFormValues> name="name" label="Name" required />
              <FormTextField<OperatorFormValues> name="email" label="Email" type="email" />
              <FormSelectField<OperatorFormValues> name="role" label="Role">
                {roleOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </FormSelectField>
              {isNew && (
                <FormTextField<OperatorFormValues>
                  name="password"
                  label="Password"
                  type="password"
                  required
                />
              )}
              <FormCheckboxField<OperatorFormValues>
                name="active"
                label="Active"
                variant="switch"
                description={draft.active ? "Enabled" : "Disabled"}
              />
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-medium text-foreground/80">Last Seen</span>
                <Input value={draft.lastSeen} disabled className="h-8 tabular-nums" />
              </div>
            </FormGrid>
          </EditCard>
        </FormRoot>

        <EditCard title="Permissions" description="Modules this operator can access.">
          {permissionsQuery.isPending ? (
            <p className="text-sm text-muted-foreground">Loading permissions…</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {permissionOptions.map((p) => (
                <label
                  key={p}
                  className="flex items-center gap-2 px-2 py-1.5 rounded border border-border hover:bg-accent cursor-pointer text-[13px]"
                >
                  <Checkbox
                    size="sm"
                    checked={selectedPerms.has(p)}
                    onCheckedChange={() => togglePerm(p)}
                    disabled={isSaving}
                  />
                  {p}
                </label>
              ))}
            </div>
          )}
        </EditCard>

        <EditCard title="Security">
          <div className="flex items-center justify-between">
            <div className="text-[13px] text-muted-foreground">
              Send a password reset link to {draft.email || "the user"}.
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={sendReset}
              disabled={forgotPassword.isPending || isNew}
            >
              Reset password
            </Button>
          </div>
        </EditCard>
      </EditScreen>
    </FormProvider>
  );
}
