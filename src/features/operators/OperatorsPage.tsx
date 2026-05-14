import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useOperators } from "@/store";
import { PageHeader, CopyableCode } from "@/components/app-shell";
import { DataTable, Toolbar, TableSearch, type Column } from "@/components/data-table";
import { Pill } from "@/components/pill";
import { Button } from "@/components/ui/button";

import { PaginationBar } from "@/components/pagination-bar";
import { RowActions, EditLink, DeleteButton } from "@/components/row-actions";
import { usePaginated } from "@/hooks/use-paginated";
import { toast } from "sonner";
import type { Operator } from "@/lib/types";

export function OperatorsPage() {
  return <OperatorsListing />;
}

function OperatorsListing() {
  const { items, remove } = useOperators();
  const nav = useNavigate();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => items.filter(o =>
    !q || [o.code, o.name, o.email].some(v => v.toLowerCase().includes(q.toLowerCase()))
  ), [items, q]);
  const { page, setPage, pageSize, setPageSize, paged, total } = usePaginated(filtered, 10);

  const columns = [
    { key: "code", header: "Code", width: "100px", sortValue: r => r.code, cell: r => <CopyableCode value={r.code} /> },
    { key: "name", header: "Name", sortValue: r => r.name, cell: r => <span>{r.name}</span> },
    { key: "email", header: "Email", cell: r => <span className="text-muted-foreground">{r.email}</span> },
    { key: "role", header: "Role", width: "110px", cell: r => <span>{r.role}</span> },
    { key: "last", header: "Last Seen", width: "150px", align: "right",
      cell: r => <span className="tabular-nums text-muted-foreground">{r.lastSeen}</span> },
    { key: "active", header: "Status", width: "100px",
      cell: r => <Pill variant={r.active ? "success" : "neutral"}>{r.active ? "Active" : "Disabled"}</Pill> },
    { key: "actions", header: "Actions", width: "90px", align: "right",
      cell: r => (
        <RowActions>
          <EditLink to="/operator/$id" params={{ id: r.id }} title="Edit operator" />
          <DeleteButton onClick={() => { remove(r.id); toast.success("Removed"); }} />
        </RowActions>
      ) },
  ] satisfies Column<Operator>[];

  return (
    <div>
      <PageHeader
        title="Operators"
        description="User accounts and permissions"
        actions={
          <Button size="sm" className="h-8 gap-1.5" onClick={() => nav({ to: "/operator/$id", params: { id: "new" } })}>
            <Plus className="h-3.5 w-3.5" /> Add Operator
          </Button>
        }
      />
      <Toolbar>
        <TableSearch value={q} onChange={setQ} placeholder="Search operators…" />
      </Toolbar>
      <div className="px-5 py-3">
        <DataTable
          rows={paged}
          columns={columns}
          onRowClick={(r) => nav({ to: "/operator/$id", params: { id: r.id } })}
          emptyState="No operators match your search."
        />
        <PaginationBar
          page={page} pageSize={pageSize} total={total}
          onPageChange={setPage} onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}

