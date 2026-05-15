import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";
import { useForgotPasswordMutation } from "@/api/auth";
import type { ApiError } from "@/api/_client";
import { permissions } from "@/api/permissions";
import { roles } from "@/api/roles";
import { EditScreen, EditCard, StickyFormFooter } from "@/components/edit-screen";
import { Field, FormGrid } from "@/components/form-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/pill";
import { Switch } from "@/components/ui/switch";
import { CopyableCode } from "@/components/app-shell";
import { toast } from "sonner";
import type { Operator } from "@/lib/types";
import {
  useOperatorCreate,
  useOperatorDelete,
  useOperatorDetail,
  useOperatorUpdate,
} from "./hooks";
import { mapRowToOperator, operatorToPayload } from "./map-operator";

const routeApi = getRouteApi("/operator/$id");

const UI_ROLES = ["Admin", "Manager", "Staff", "Viewer"] as const;

function blankOperator(): Operator {
  return {
    id: "",
    code: "",
    name: "",
    email: "",
    role: "Staff",
    active: true,
    lastSeen: "—",
  };
}

export function OperatorEditPage() {
  const { id } = routeApi.useParams();
  const nav = useNavigate();
  const isNew = id === "new";
  const [draft, setDraft] = useState<Operator>(() => blankOperator());
  const [password, setPassword] = useState("");
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set());

  const detailQuery = useOperatorDetail(id, !isNew);
  const rolesQuery = roles.hooks.useList({ pageSize: 200 });
  const permissionsQuery = permissions.hooks.useList({ pageSize: 500 });

  const createOperator = useOperatorCreate();
  const updateOperator = useOperatorUpdate();
  const deleteOperator = useOperatorDelete();
  const forgotPassword = useForgotPasswordMutation();

  useEffect(() => {
    if (isNew) {
      setDraft(blankOperator());
      setSelectedPerms(new Set());
      return;
    }
    if (detailQuery.data) {
      const mapped = mapRowToOperator(detailQuery.data);
      setDraft(mapped);
      const apiPerms = Array.isArray(detailQuery.data.permissions)
        ? detailQuery.data.permissions.map(String)
        : [];
      setSelectedPerms(new Set(apiPerms));
    }
  }, [isNew, detailQuery.data]);

  const roleOptions = useMemo(() => {
    const fromApi = (rolesQuery.data?.items ?? []).map((r) => String(r.name ?? r.id));
    return fromApi.length > 0 ? fromApi : [...UI_ROLES];
  }, [rolesQuery.data?.items]);

  const permissionOptions = useMemo(
    () => (permissionsQuery.data?.items ?? []).map((p) => String(p.name ?? p.id)),
    [permissionsQuery.data?.items],
  );

  const isSaving = createOperator.isPending || updateOperator.isPending;

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

  const set = <K extends keyof Operator>(k: K, v: Operator[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const togglePerm = (p: string) => {
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  };

  const save = () => {
    if (!draft.code || !draft.name) {
      toast.error("Code and Name are required");
      return;
    }
    if (isNew && password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const payload = operatorToPayload(
      { ...draft, code: draft.code.toUpperCase() },
      {
        password: isNew ? password : undefined,
        roles: [draft.role],
        permissions: [...selectedPerms],
      },
    );

    if (isNew) {
      createOperator.mutate(payload, {
        onSuccess: (row) => {
          toast.success("Operator created");
          nav({ to: "/operator/$id", params: { id: String(row.id) } });
        },
        onError: (err: ApiError) => toast.error(err.message),
      });
    } else {
      updateOperator.mutate(
        { id, data: payload },
        {
          onSuccess: () => {
            toast.success("Operator saved");
            nav({ to: "/operators" });
          },
          onError: (err: ApiError) => toast.error(err.message),
        },
      );
    }
  };

  const onDelete = () => {
    if (isNew) {
      nav({ to: "/operators" });
      return;
    }
    deleteOperator.mutate({ id }, {
      onSuccess: () => {
        toast.success("Removed");
        nav({ to: "/operators" });
      },
      onError: (err: ApiError) => toast.error(err.message),
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

  return (
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
              disabled={deleteOperator.isPending}
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          )}
          <Button size="sm" className="h-8 gap-1.5" onClick={save} disabled={isSaving}>
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
      <EditCard title="Account">
        <FormGrid cols={3}>
          <Field label="Code" required>
            <Input
              value={draft.code}
              onChange={(e) => set("code", e.target.value.toUpperCase())}
              className="h-8 font-mono"
            />
          </Field>
          <Field label="Name" required>
            <Input value={draft.name} onChange={(e) => set("name", e.target.value)} className="h-8" />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={draft.email}
              onChange={(e) => set("email", e.target.value)}
              className="h-8"
            />
          </Field>
          <Field label="Role">
            <select
              value={draft.role}
              onChange={(e) => set("role", e.target.value as Operator["role"])}
              className="h-8 px-2 rounded border border-border bg-background text-[13px] w-full"
            >
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>
          {isNew && (
            <Field label="Password" required>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-8"
              />
            </Field>
          )}
          <Field label="Active">
            <div className="h-8 inline-flex items-center gap-2">
              <Switch checked={draft.active} onCheckedChange={(v) => set("active", v)} />
              <span className="text-[13px] text-muted-foreground">
                {draft.active ? "Enabled" : "Disabled"}
              </span>
            </div>
          </Field>
          <Field label="Last Seen">
            <Input value={draft.lastSeen} disabled className="h-8 tabular-nums" />
          </Field>
        </FormGrid>
      </EditCard>

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
                <input
                  type="checkbox"
                  checked={selectedPerms.has(p)}
                  onChange={() => togglePerm(p)}
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

      <StickyFormFooter>
        <Button variant="outline" size="sm" onClick={() => nav({ to: "/operators" })}>
          Cancel
        </Button>
        <Button size="sm" className="gap-1.5" onClick={save} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save Operator
        </Button>
      </StickyFormFooter>
    </EditScreen>
  );
}
