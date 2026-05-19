import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import type { ApiError } from "@/api/_client";
import { PageHeader, CopyableCode } from "@/components/app-shell";
import { DataTable, Toolbar, TableSearch, type Column } from "@/components/data-table";
import { Pill } from "@/components/pill";
import { Button } from "@/components/ui/button";
import { PaginationBar } from "@/components/pagination-bar";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { RowActions, EditLink, DeleteButton } from "@/components/row-actions";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { toast } from "sonner";
import type { Operator } from "@/lib/types";
import { useOperatorDelete, useOperatorDirectory } from "./hooks";

export function OperatorsPage() {
  return <OperatorsListing />;
}

function OperatorsListing() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const directory = useOperatorDirectory({ page, pageSize, search: q });
  const removeOperator = useOperatorDelete();

  const deleteConfirm = useDeleteConfirm<{ id: string }>({
    onConfirm: async ({ id }) => {
      try {
        await removeOperator.mutateAsync({ id });
        toast.success("Operator removed");
      } catch (err) {
        toast.error((err as ApiError)?.message ?? "Failed to delete operator");
        throw err;
      }
    },
  });

  const onDelete = (row: Operator) => {
    deleteConfirm.requestDelete({
      title: "Delete operator",
      entityName: row.name || row.code,
      entityType: "operator",
      meta: { id: row.id },
    });
  };

  const columns = [
    {
      key: "code",
      header: "Code",
      width: "100px",
      sortValue: (r) => r.code,
      cell: (r) => <CopyableCode value={r.code} />,
    },
    { key: "name", header: "Name", sortValue: (r) => r.name, cell: (r) => <span>{r.name}</span> },
    {
      key: "email",
      header: "Email",
      cell: (r) => <span className="text-muted-foreground">{r.email}</span>,
    },
    { key: "role", header: "Role", width: "110px", cell: (r) => <span>{r.role}</span> },
    {
      key: "last",
      header: "Last Seen",
      width: "150px",
      align: "right",
      cell: (r) => (
        <span className="tabular-nums text-muted-foreground">{r.lastSeen}</span>
      ),
    },
    {
      key: "active",
      header: "Status",
      width: "100px",
      cell: (r) => (
        <Pill variant={r.active ? "success" : "neutral"}>
          {r.active ? "Active" : "Disabled"}
        </Pill>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "90px",
      align: "right",
      cell: (r) => (
        <RowActions>
          <EditLink to="/operator/$id" params={{ id: r.id }} title="Edit operator" />
          <DeleteButton onClick={() => onDelete(r)} />
        </RowActions>
      ),
    },
  ] satisfies Column<Operator>[];

  return (
    <div>
      <DeleteConfirmDialog state={deleteConfirm} />
      <PageHeader
        title="Operators"
        description="User accounts and permissions"
        actions={
          <Button
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => nav({ to: "/operator/$id", params: { id: "new" } })}
          >
            <Plus className="h-3.5 w-3.5" /> Add Operator
          </Button>
        }
      />
      <Toolbar>
        <TableSearch
          value={q}
          onChange={(v) => {
            setQ(v);
            setPage(1);
          }}
          placeholder="Search operators…"
        />
      </Toolbar>
      <div className="px-5 py-3">
        {directory.isPending ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading operators…
          </div>
        ) : directory.isError ? (
          <div className="py-8">
            <p className="text-sm text-destructive">
              {(directory.error as ApiError)?.message ?? "Failed to load operators."}
            </p>
            <Button variant="outline" size="sm" className="mt-2 h-8" onClick={() => directory.refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            <DataTable
              rows={directory.items}
              columns={columns}
              onRowClick={(r) => nav({ to: "/operator/$id", params: { id: r.id } })}
              emptyState="No operators match your search."
            />
            <PaginationBar
              page={page}
              pageSize={pageSize}
              total={directory.meta.total}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
