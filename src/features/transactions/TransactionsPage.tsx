import { useNavigate, Outlet, useChildMatches, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Plus, FileText, Wallet, ChevronDown } from "lucide-react";
import { useTxns } from "@/store";
import { PageHeader } from "@/components/app-shell";
import { DataTable, Toolbar, TableSearch, type Column } from "@/components/data-table";
import { Pill } from "@/components/pill";
import { Button } from "@/components/ui/button";
import { PaginationBar } from "@/components/pagination-bar";
import { RowActions, EditLink, DeleteButton } from "@/components/row-actions";
import { usePaginated } from "@/hooks/use-paginated";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { Transaction } from "@/lib/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

const fmtDate = (s: string) => {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export function TransactionsPage() {
  const hasChild = useChildMatches().length > 0;
  if (hasChild) return <Outlet />;
  return <TxnListing />;
}

function TxnListing() {
  const { items, remove } = useTxns();
  const nav = useNavigate();
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      items.filter(
        (t) =>
          !q ||
          [t.refMain, t.addrCode, t.addrName, t.kind].some((v) =>
            v.toLowerCase().includes(q.toLowerCase()),
          ),
      ),
    [items, q],
  );
  const { page, setPage, pageSize, setPageSize, paged, total } = usePaginated(filtered, 10);

  const columns = [
    {
      key: "code", header: "Code", width: "150px", sortValue: (r) => r.refMain,
      cell: (r) => <span className="font-mono font-semibold text-foreground">{r.refMain}</span>,
    },
    {
      key: "type", header: "Type", width: "120px", sortValue: (r) => r.kind,
      cell: (r) => (
        <Pill variant={r.kind === "Invoice" ? "primary" : r.kind === "Payment" ? "success" : "warning"}>
          {r.kind}
        </Pill>
      ),
    },
    {
      key: "amount", header: "Amount", width: "140px", align: "right", sortValue: (r) => r.value,
      cell: (r) => (
        <span className={`tabular-nums font-medium ${r.value < 0 ? "text-success" : "text-foreground"}`}>
          {r.value < 0 ? "−" : ""}{fmt(Math.abs(r.value))}
        </span>
      ),
    },
    {
      key: "entity", header: "Related Entity", sortValue: (r) => r.addrName,
      cell: (r) => (
        <div className="min-w-0">
          <div className="truncate text-foreground">{r.addrName}</div>
          <div className="text-[11.5px] text-muted-foreground font-mono">{r.addrCode}</div>
        </div>
      ),
    },
    {
      key: "date", header: "Date", width: "130px", align: "right", sortValue: (r) => r.date,
      cell: (r) => <span className="tabular-nums text-muted-foreground">{fmtDate(r.date)}</span>,
    },
    {
      key: "actions", header: "Actions", width: "90px", align: "right",
      cell: (r) => (
        <RowActions>
          <EditLink to="/transactions/$id" params={{ id: r.id }} title="Edit transaction" />
          <DeleteButton onClick={() => { remove(r.id); toast.success("Deleted"); }} />
        </RowActions>
      ),
    },
  ] satisfies Column<Transaction>[];

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Invoices, payments and credits"
        actions={
          <>
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="h-8 gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Add Transaction
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>New transaction</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/transaction/invoice" className="gap-2 cursor-pointer">
                    <FileText className="h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium">Invoice Transaction</span>
                      <span className="text-[11.5px] text-muted-foreground">From customer orders</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/transaction/payment" className="gap-2 cursor-pointer">
                    <Wallet className="h-4 w-4 text-success" />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium">Payment Transaction</span>
                      <span className="text-[11.5px] text-muted-foreground">Receive & allocate</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />
      <Toolbar>
        <TableSearch value={q} onChange={setQ} placeholder="Search code, customer…" />
      </Toolbar>
      <div className="px-5 py-3">
        <DataTable
          rows={paged}
          columns={columns}
          onRowClick={(r) => nav({ to: "/transactions/$id", params: { id: r.id } })}
          emptyState={q ? "No transactions match your search." : "No transactions yet."}
        />
        <PaginationBar
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}
