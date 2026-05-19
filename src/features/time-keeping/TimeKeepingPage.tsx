import { useMemo, useState, type ReactNode } from "react";
import { Plus, Save, X, Pencil } from "lucide-react";
import { useTime, useOperators } from "@/store";
import { PageHeader } from "@/components/app-shell";
import { DataTable, Toolbar, TableSearch, type Column } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PaginationBar } from "@/components/pagination-bar";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { RowActions, DeleteButton } from "@/components/row-actions";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { usePaginated } from "@/hooks/use-paginated";
import { toast } from "sonner";
import type { TimeEntry } from "@/lib/types";

/** Serializable edits merged into an existing time row or used when adding an entry. */
type TimeEntryPatch = Partial<TimeEntry>;

function hoursBetween(a?: string, b?: string) {
  if (!a || !b) return 0;
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  if ([ah, am, bh, bm].some(n => Number.isNaN(n))) return 0;
  return Math.max(0, (bh * 60 + bm - (ah * 60 + am)) / 60);
}

function calcTotal(t: TimeEntryPatch) {
  const m = hoursBetween(t.morningBegin, t.morningEnd);
  const a = hoursBetween(t.afternoonBegin, t.afternoonEnd);
  const e = hoursBetween(t.extraBegin, t.extraEnd);
  const breaks = (t.breaksTime ?? 0) / 60;
  return Math.max(0, m + a + e - breaks);
}

const emptyEntry = (): TimeEntry => ({
  id: `te_${Date.now()}`,
  operatorCode: "",
  operatorName: "",
  date: new Date().toISOString().slice(0, 10),
  inAt: "",
  outAt: "",
  morningBegin: "",
  morningEnd: "",
  afternoonBegin: "",
  afternoonEnd: "",
  extraBegin: "",
  extraEnd: "",
  breaksNo: 0,
  breaksTime: 0,
});

export function TimeKeepingPage() {
  const { items, add, update, remove } = useTime();
  const operators = useOperators(s => s.items);
  const [q, setQ] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const filtered = useMemo(() => items
    .filter(t => !q || [t.operatorCode, t.operatorName, t.date].some(v => v.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => b.date.localeCompare(a.date))
  , [items, q]);
  const { page, setPage, pageSize, setPageSize, paged, total } = usePaginated(filtered, 10);

  const deleteConfirm = useDeleteConfirm<{ id: string }>({
    onConfirm: async ({ id }) => {
      remove(id);
      toast.success("Removed");
    },
  });

  const flagSummary = (r: TimeEntry) => {
    const f: string[] = [];
    if (r.holidayFull) f.push("Hol"); else if (r.holidayHalf) f.push("½Hol");
    if (r.sickFull) f.push("Sick"); else if (r.sickHalf) f.push("½Sick");
    if (r.absentFull) f.push("Abs"); else if (r.absentHalf) f.push("½Abs");
    if (r.discretionFull) f.push("Disc"); else if (r.discretionHalf) f.push("½Disc");
    return f.join(", ") || "—";
  };

  const columns = [
    { key: "code", header: "Code", width: "100px", cell: r => <span className="font-mono font-semibold text-[12px]">{r.operatorCode}</span> },
    { key: "name", header: "Name", width: "180px", cell: r => <span>{r.operatorName}</span> },
    { key: "date", header: "Work Date", width: "120px", sortValue: r => r.date, cell: r => <span className="tabular-nums">{r.date}</span> },
    { key: "mb", header: "M-Begin", width: "80px", align: "right", cell: r => <span className="tabular-nums">{r.morningBegin || "—"}</span> },
    { key: "me", header: "M-End", width: "80px", align: "right", cell: r => <span className="tabular-nums">{r.morningEnd || "—"}</span> },
    { key: "ab", header: "A-Begin", width: "80px", align: "right", cell: r => <span className="tabular-nums text-muted-foreground">{r.afternoonBegin || "—"}</span> },
    { key: "ae", header: "A-End", width: "80px", align: "right", cell: r => <span className="tabular-nums text-muted-foreground">{r.afternoonEnd || "—"}</span> },
    { key: "bn", header: "Breaks", width: "70px", align: "right", cell: r => <span className="tabular-nums">{r.breaksNo ?? 0}</span> },
    { key: "bt", header: "Brk(min)", width: "80px", align: "right", cell: r => <span className="tabular-nums text-muted-foreground">{r.breaksTime ?? 0}</span> },
    { key: "total", header: "Total (hrs)", width: "100px", align: "right", cell: r => <span className="tabular-nums font-medium">{calcTotal(r).toFixed(2)}</span> },
    { key: "flags", header: "Flags", cell: r => <span className="text-[11px] text-muted-foreground">{flagSummary(r)}</span> },
    { key: "actions", header: "Actions", width: "90px", align: "right", cell: r => (
      <RowActions>
        <button
          onClick={(e) => { e.stopPropagation(); setAdding(false); setEditingId(editingId === r.id ? null : r.id); }}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
          title="Edit time entry"
          aria-label="Edit time entry"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <DeleteButton
          onClick={() =>
            deleteConfirm.requestDelete({
              title: "Delete time entry",
              entityName: `${r.operatorName} · ${r.date}`,
              entityType: "time entry",
              meta: { id: r.id },
            })
          }
        />
      </RowActions>
    ) },
  ] satisfies Column<TimeEntry>[];

  return (
    <div>
      <DeleteConfirmDialog state={deleteConfirm} />
      <PageHeader title="Time Keeping" description="Track operator hours" />

      <Toolbar>
        <TableSearch value={q} onChange={setQ} placeholder="Search operator, date…" />
        <div className="ml-auto" />
        <Button size="sm" className="h-8 gap-1.5" onClick={() => { setEditingId(null); setAdding(true); }}>
          <Plus className="h-3.5 w-3.5" /> Add Time Entry
        </Button>
      </Toolbar>

      <div className="px-5 py-3">
        <DataTable
          rows={paged}
          columns={columns}
          expandedIds={editingId ? new Set([editingId]) : new Set()}
          expandOnRowClick={false}
          expandedRow={(row) => (
            <InlineTimeForm
              initial={row}
              operators={operators.map(o => ({ code: o.code, name: o.name }))}
              title="Edit Time Entry"
              onSave={(patch) => { update(row.id, patch); setEditingId(null); toast.success("Saved"); }}
              onCancel={() => setEditingId(null)}
            />
          )}
          quickAddRow={
            adding ? (
              <div className="p-0">
                <InlineTimeForm
                  initial={emptyEntry()}
                  operators={operators.map(o => ({ code: o.code, name: o.name }))}
                  title="Add Time Entry"
                  onSave={(patch) => {
                    const entry = { ...emptyEntry(), ...patch, id: `te_${Date.now()}` } as TimeEntry;
                    if (!entry.operatorCode) { toast.error("Select an operator"); return; }
                    add(entry); setAdding(false); toast.success("Time entry added");
                  }}
                  onCancel={() => setAdding(false)}
                />
              </div>
            ) : undefined
          }
        />
        <PaginationBar
          page={page} pageSize={pageSize} total={total}
          onPageChange={setPage} onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}

interface OperatorOption {
  code: string;
  name: string;
}

interface InlineTimeFormProps {
  initial: TimeEntry;
  operators: OperatorOption[];
  title: string;
  onSave: (patch: TimeEntryPatch) => void;
  onCancel: () => void;
}

function InlineTimeForm({
  initial, operators, title, onSave, onCancel,
}: InlineTimeFormProps) {
  const [f, setF] = useState<TimeEntry>({ ...initial });
  const set = <K extends keyof TimeEntry>(k: K, v: TimeEntry[K]) => setF(s => ({ ...s, [k]: v }));
  const total = calcTotal(f);

  const onOperator = (code: string) => {
    const op = operators.find(o => o.code === code);
    setF(s => ({ ...s, operatorCode: code, operatorName: op?.name ?? s.operatorName }));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-[11px] text-muted-foreground">{f.operatorCode || "—"} {f.operatorName ? `— ${f.operatorName}` : ""}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" className="h-7 gap-1" onClick={onCancel}><X className="h-3 w-3" /> Cancel</Button>
          <Button size="sm" className="h-7 gap-1" onClick={() => onSave(f)}><Save className="h-3 w-3" /> Save</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Field label="Operator">
          <select
            value={f.operatorCode}
            onChange={e => onOperator(e.target.value)}
            className="h-8 w-full px-2 rounded-md border border-input bg-background text-[13px]"
          >
            <option value="">Select…</option>
            {operators.map(o => <option key={o.code} value={o.code}>{o.code} — {o.name}</option>)}
          </select>
        </Field>
        <Field label="Name"><Input value={f.operatorName} onChange={e => set("operatorName", e.target.value)} className="h-8 text-[13px]" /></Field>
        <Field label="Date"><Input type="date" value={f.date} onChange={e => set("date", e.target.value)} className="h-8 text-[13px]" /></Field>
        <Field label="Total (hrs)"><Input value={total.toFixed(2)} readOnly className="h-8 text-[13px] bg-muted" /></Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Section title="Morning">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Begin"><Input type="time" value={f.morningBegin ?? ""} onChange={e => set("morningBegin", e.target.value)} className="h-8 text-[13px]" /></Field>
            <Field label="End"><Input type="time" value={f.morningEnd ?? ""} onChange={e => set("morningEnd", e.target.value)} className="h-8 text-[13px]" /></Field>
          </div>
        </Section>
        <Section title="Afternoon">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Begin"><Input type="time" value={f.afternoonBegin ?? ""} onChange={e => set("afternoonBegin", e.target.value)} className="h-8 text-[13px]" /></Field>
            <Field label="End"><Input type="time" value={f.afternoonEnd ?? ""} onChange={e => set("afternoonEnd", e.target.value)} className="h-8 text-[13px]" /></Field>
          </div>
        </Section>
        <Section title="Extra Time">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Begin"><Input type="time" value={f.extraBegin ?? ""} onChange={e => set("extraBegin", e.target.value)} className="h-8 text-[13px]" /></Field>
            <Field label="End"><Input type="time" value={f.extraEnd ?? ""} onChange={e => set("extraEnd", e.target.value)} className="h-8 text-[13px]" /></Field>
          </div>
        </Section>
        <Section title="Breaks">
          <div className="grid grid-cols-2 gap-2">
            <Field label="No."><Input type="number" min={0} value={f.breaksNo ?? 0} onChange={e => set("breaksNo", Number(e.target.value))} className="h-8 text-[13px]" /></Field>
            <Field label="Time (min)"><Input type="number" min={0} value={f.breaksTime ?? 0} onChange={e => set("breaksTime", Number(e.target.value))} className="h-8 text-[13px]" /></Field>
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <FlagBox title="Holiday" half={!!f.holidayHalf} full={!!f.holidayFull} onHalf={v => set("holidayHalf", v)} onFull={v => set("holidayFull", v)} />
        <FlagBox title="Sick" half={!!f.sickHalf} full={!!f.sickFull} onHalf={v => set("sickHalf", v)} onFull={v => set("sickFull", v)} />
        <FlagBox title="Discretion" half={!!f.discretionHalf} full={!!f.discretionFull} onHalf={v => set("discretionHalf", v)} onFull={v => set("discretionFull", v)} />
        <FlagBox title="Absent" half={!!f.absentHalf} full={!!f.absentFull} onHalf={v => set("absentHalf", v)} onFull={v => set("absentFull", v)} />
      </div>
    </div>
  );
}

interface TimeFieldProps {
  label: string;
  children: ReactNode;
}

function Field({ label, children }: TimeFieldProps) {
  return (
    <div className="space-y-1">
      <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

interface TimeSectionProps {
  title: string;
  children: ReactNode;
}

function Section({ title, children }: TimeSectionProps) {
  return (
    <div className="rounded-md border border-border p-2.5 space-y-2 bg-background">
      <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

type BooleanFlagHandler = (value: boolean) => void;

interface TimeFlagBoxProps {
  title: string;
  half: boolean;
  full: boolean;
  onHalf: BooleanFlagHandler;
  onFull: BooleanFlagHandler;
}

function FlagBox({ title, half, full, onHalf, onFull }: TimeFlagBoxProps) {
  return (
    <div className="rounded-md border border-border p-2.5 bg-background">
      <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground mb-2">{title}</div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1.5 text-[13px] cursor-pointer">
          <Checkbox checked={half} onCheckedChange={(v) => onHalf(!!v)} /> Half
        </label>
        <label className="flex items-center gap-1.5 text-[13px] cursor-pointer">
          <Checkbox checked={full} onCheckedChange={(v) => onFull(!!v)} /> Full
        </label>
      </div>
    </div>
  );
}
