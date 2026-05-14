import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Download, Zap } from "lucide-react";
import { useAddresses } from "@/store";
import { PageHeader, CopyableCode } from "@/components/app-shell";
import { DataTable, Toolbar, TableSearch, type Column } from "@/components/data-table";
import { Pill } from "@/components/pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationBar } from "@/components/pagination-bar";
import { RowActions, EditLink, DeleteButton } from "@/components/row-actions";
import { usePaginated } from "@/hooks/use-paginated";
import { toast } from "sonner";
import type { Address, AddressType } from "@/lib/types";

type AddAddressHandler = (address: Address) => void;

interface QuickAddAddressProps {
  onAdd: AddAddressHandler;
  onCancel: () => void;
}

export function AddressesPage() {
  return <AddressesListing />;
}

function AddressesListing() {
  const { items, add, remove } = useAddresses();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);

  const filtered = useMemo(() => items.filter(a =>
    !q || [a.code, a.name, a.town, a.country].some(v => v?.toLowerCase().includes(q.toLowerCase()))
  ), [items, q]);
  const { page, setPage, pageSize, setPageSize, paged, total } = usePaginated(filtered, 10);

  const columns = [
    { key: "code", header: "Code", width: "100px", sortValue: r => r.code, cell: r => <CopyableCode value={r.code} /> },
    { key: "name", header: "Name", sortValue: r => r.name, cell: r => <span className="truncate block max-w-[320px]">{r.name}</span> },
    { key: "type", header: "Type", width: "110px",
      cell: r => <Pill variant={r.type === "Supplier" ? "info" : "primary"}>{r.type}</Pill> },
    { key: "town", header: "Town", width: "140px", cell: r => <span>{r.town}</span> },
    { key: "country", header: "Country", width: "120px", cell: r => <span>{r.country}</span> },
    { key: "last", header: "Last Order", width: "120px", align: "right",
      cell: r => <span className="text-muted-foreground tabular-nums">{r.lastOrder ?? "—"}</span> },
    { key: "actions", header: "Actions", width: "90px", align: "right",
      cell: r => (
        <RowActions>
          <EditLink to="/address/$id" params={{ id: r.id }} title="Edit address" />
          <DeleteButton onClick={() => { remove(r.id); toast.success("Removed"); }} />
        </RowActions>
      ) },
  ] satisfies Column<Address>[];

  return (
    <div>
      <PageHeader
        title="Addresses"
        description="Customers and suppliers"
        actions={
          <>
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setAdding(v => !v)}>
              <Zap className="h-3.5 w-3.5" /> Quick Add
            </Button>
            <Button size="sm" className="h-8 gap-1.5" onClick={() => nav({ to: "/address/$id", params: { id: "new" } })}>
              <Plus className="h-3.5 w-3.5" /> Add Address
            </Button>
          </>
        }
      />
      <Toolbar>
        <TableSearch value={q} onChange={setQ} placeholder="Search code, name, town…" />
        <div className="ml-auto">
          <Button variant="outline" size="sm" className="h-8 gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
        </div>
      </Toolbar>
      <div className="px-5 py-3">
        <DataTable
          rows={paged}
          columns={columns}
          quickAddRow={adding ? <QuickAddAddress onAdd={(a) => { add(a); setAdding(false); }} onCancel={() => setAdding(false)} /> : undefined}
          onRowClick={(r) => nav({ to: "/address/$id", params: { id: r.id } })}
          emptyState={q ? "No addresses match your search." : "No addresses yet."}
        />
        <PaginationBar
          page={page} pageSize={pageSize} total={total}
          onPageChange={setPage} onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}

function QuickAddAddress({ onAdd, onCancel }: QuickAddAddressProps) {
  const [draft, setDraft] = useState({ code: "", name: "", type: "Customer" as AddressType, town: "", country: "" });
  const submit = () => {
    if (!draft.code || !draft.name) { toast.error("Code and Name are required"); return; }
    onAdd({
      id: `a_${Date.now()}`, code: draft.code, name: draft.name, type: draft.type,
      address1: "", town: draft.town, country: draft.country || "—",
    });
    toast.success("Address added");
  };
  return (
    <div className="flex items-center gap-2 px-3 py-1.5">
      <Plus className="h-3.5 w-3.5 text-muted-foreground" />
      <Input autoFocus placeholder="Code" value={draft.code} onChange={e => setDraft(d => ({ ...d, code: e.target.value }))} className="h-7 w-24 text-[13px] font-mono" onKeyDown={e => e.key === "Enter" && submit()} />
      <Input placeholder="Name" value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} className="h-7 flex-1 text-[13px]" onKeyDown={e => e.key === "Enter" && submit()} />
      <select value={draft.type} onChange={e => setDraft(d => ({ ...d, type: e.target.value as AddressType }))} className="h-7 px-2 rounded border border-border bg-background text-[13px]">
        <option value="Customer">Customer</option>
        <option value="Supplier">Supplier</option>
      </select>
      <Input placeholder="Town" value={draft.town} onChange={e => setDraft(d => ({ ...d, town: e.target.value }))} className="h-7 w-32 text-[13px]" onKeyDown={e => e.key === "Enter" && submit()} />
      <Input placeholder="Country" value={draft.country} onChange={e => setDraft(d => ({ ...d, country: e.target.value }))} className="h-7 w-28 text-[13px]" onKeyDown={e => e.key === "Enter" && submit()} />
      <Button size="sm" className="h-7" onClick={submit}>Add</Button>
      <Button size="sm" variant="ghost" className="h-7" onClick={onCancel}>Cancel</Button>
    </div>
  );
}
