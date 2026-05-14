import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Save } from "lucide-react";
import { useOperators } from "@/store";
import { EditScreen, EditCard, StickyFormFooter } from "@/components/edit-screen";
import { Field, FormGrid } from "@/components/form-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/pill";
import { Switch } from "@/components/ui/switch";
import { CopyableCode } from "@/components/app-shell";
import { toast } from "sonner";
import type { Operator } from "@/lib/types";

const routeApi = getRouteApi("/operator/$id");

const ROLES = ["Admin", "Manager", "Staff", "Viewer"] as const;
const PERMS = ["Stock", "Orders", "Transactions", "Reports", "Settings", "Operators"] as const satisfies readonly string[];

function blankOperator(): Operator {
  return { id: `op_${Date.now()}`, code: "", name: "", email: "", role: "Staff", active: true, lastSeen: "—" };
}

export function OperatorEditPage() {
  const { id } = routeApi.useParams();
  const nav = useNavigate();
  const { items, add, update, remove } = useOperators();
  const isNew = id === "new";
  const item = isNew ? undefined : items.find(i => i.id === id);
  const [draft, setDraft] = useState<Operator | undefined>(isNew ? blankOperator() : item);
  const [perms, setPerms] = useState<Set<string>>(new Set(PERMS));

  if (!isNew && (!item || !draft)) {
    return (
      <EditScreen backTo="/operators" title="Operator not found">
        <p className="text-muted-foreground text-[13px]">This operator may have been deleted.</p>
      </EditScreen>
    );
  }
  if (!draft) return null;

  const set = <K extends keyof Operator>(k: K, v: Operator[K]) => setDraft(d => ({ ...(d as Operator), [k]: v }));

  const togglePerm = (p: string) => {
    const n = new Set(perms);
    if (n.has(p)) n.delete(p); else n.add(p);
    setPerms(n);
  };

  const save = () => {
    if (!draft.code || !draft.name) { toast.error("Code and Name are required"); return; }
    if (isNew) { add({ ...draft, code: draft.code.toUpperCase() }); toast.success("Operator created"); }
    else { update(draft.id, draft); toast.success("Operator saved"); }
    nav({ to: "/operators" });
  };
  const onDelete = () => { if (isNew) { nav({ to: "/operators" }); return; } remove(draft.id); toast.success("Removed"); nav({ to: "/operators" }); };

  return (
    <EditScreen
      backTo="/operators"
      backLabel="Back to Operators"
      title={isNew ? "New Operator" : (draft.name || draft.code)}
      subtitle={!isNew && <CopyableCode value={draft.code} />}
      badges={!isNew && <Pill variant={draft.active ? "success" : "neutral"}>{draft.active ? "Active" : "Disabled"}</Pill>}
      actions={
        <>
          {!isNew && (
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-destructive hover:text-destructive" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          )}
          <Button size="sm" className="h-8 gap-1.5" onClick={save}><Save className="h-3.5 w-3.5" /> {isNew ? "Create" : "Save"}</Button>
        </>
      }
    >
      <EditCard title="Account">
        <FormGrid cols={3}>
          <Field label="Code" required><Input value={draft.code} onChange={e => set("code", e.target.value.toUpperCase())} className="h-8 font-mono" /></Field>
          <Field label="Name" required><Input value={draft.name} onChange={e => set("name", e.target.value)} className="h-8" /></Field>
          <Field label="Email"><Input type="email" value={draft.email} onChange={e => set("email", e.target.value)} className="h-8" /></Field>
          <Field label="Role">
            <select value={draft.role} onChange={e => set("role", e.target.value as Operator["role"])} className="h-8 px-2 rounded border border-border bg-background text-[13px]">
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Active">
            <div className="h-8 inline-flex items-center gap-2">
              <Switch checked={draft.active} onCheckedChange={v => set("active", v)} />
              <span className="text-[13px] text-muted-foreground">{draft.active ? "Enabled" : "Disabled"}</span>
            </div>
          </Field>
          <Field label="Last Seen"><Input value={draft.lastSeen} disabled className="h-8 tabular-nums" /></Field>
        </FormGrid>
      </EditCard>

      <EditCard title="Permissions" description="Modules this operator can access.">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {PERMS.map(p => (
            <label key={p} className="flex items-center gap-2 px-2 py-1.5 rounded border border-border hover:bg-accent cursor-pointer text-[13px]">
              <input type="checkbox" checked={perms.has(p)} onChange={() => togglePerm(p)} />
              {p}
            </label>
          ))}
        </div>
      </EditCard>

      <EditCard title="Security">
        <div className="flex items-center justify-between">
          <div className="text-[13px] text-muted-foreground">Send a password reset link to {draft.email || "the user"}.</div>
          <Button variant="outline" size="sm" className="h-8" onClick={() => toast.success("Reset link sent")}>Reset password</Button>
        </div>
      </EditCard>

      <StickyFormFooter>
        <Button variant="outline" size="sm" onClick={() => nav({ to: "/operators" })}>Cancel</Button>
        <Button size="sm" className="gap-1.5" onClick={save}><Save className="h-3.5 w-3.5" /> Save Operator</Button>
      </StickyFormFooter>
    </EditScreen>
  );
}
