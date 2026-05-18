import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Download } from "lucide-react";
import { useOrders } from "@/store";
import { PageHeader, CopyableCode } from "@/components/app-shell";
import { DataTable, Toolbar, TableSearch, type Column } from "@/components/data-table";
import { Pill } from "@/components/pill";
import { Button } from "@/components/ui/button";
import { PaginationBar } from "@/components/pagination-bar";
import { RowActions, EditLink, DeleteButton } from "@/components/row-actions";
import { usePaginated } from "@/hooks/use-paginated";
import { toast } from "sonner";
import type { Order } from "@/lib/types";

const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
const totalQty = (o: Order) => o.lines.reduce((s, l) => s + l.qty, 0);
const totalVal = (o: Order) => o.lines.reduce((s, l) => s + l.qty * l.price, 0);

export function OrdersPage() {
  return <OrdersListing />;
}

function OrdersListing() {
  const { items, add, remove } = useOrders();
  const nav = useNavigate();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => items.filter(o =>
    !q || [o.code, o.addrName, o.addrCode, o.ourRef ?? "", o.logRef].some(v => v.toLowerCase().includes(q.toLowerCase()))
  ), [items, q]);
  const { page, setPage, pageSize, setPageSize, paged, total } = usePaginated(filtered, 10);

  const columns = [
    { key: "code", header: "Code", width: "100px", sortValue: r => r.code, cell: r => <CopyableCode value={r.code} /> },
    { key: "addrCode", header: "Addr", width: "80px", cell: r => <CopyableCode value={r.addrCode} /> },
    { key: "addrName", header: "Customer / Supplier", sortValue: r => r.addrName,
      cell: r => (
        <div className="flex items-center gap-1.5">
          <Pill variant={r.addrType === "Supplier" ? "info" : "primary"}>{r.addrType[0]}</Pill>
          <span className="truncate">{r.addrName}</span>
        </div>
      ) },
    { key: "kind", header: "Kind", width: "100px", cell: r => <span className="text-muted-foreground">{r.kind}</span> },
    { key: "written", header: "Written", width: "110px", align: "right", sortValue: r => r.written, cell: r => <span className="tabular-nums text-muted-foreground">{r.written}</span> },
    { key: "ship", header: "Ship", width: "110px", align: "right", cell: r => <span className="tabular-nums text-muted-foreground">{r.ship}</span> },
    { key: "lines", header: "Lines", width: "70px", align: "right", cell: r => <span className="tabular-nums">{r.lines.length}</span> },
    { key: "qty", header: "Qty", width: "70px", align: "right", cell: r => <span className="tabular-nums">{totalQty(r)}</span> },
    { key: "val", header: "Value", width: "110px", align: "right", cell: r => <span className="tabular-nums font-medium">{fmt(totalVal(r))}</span> },
    { key: "status", header: "Status", width: "110px",
      cell: r => <Pill variant={r.status === "Shipped" ? "success" : r.status === "Cancelled" ? "danger" : r.status === "Confirmed" ? "info" : "neutral"}>{r.status}</Pill> },
    { key: "actions", header: "Actions", width: "90px", align: "right",
      cell: r => (
        <RowActions>
          <EditLink to="/order/$id" params={{ id: r.id }} title="Edit order" />
          <DeleteButton onClick={() => { remove(r.id); toast.success("Removed"); }} />
        </RowActions>
      ) },
  ] satisfies Column<Order>[];

  const newOrder = () => {
    const id = `o_${Date.now()}`;
    add({
      id, code: `C${String(Date.now()).slice(-5)}`, addrType: "Customer",
      addrCode: "", addrName: "New Customer", logRef: "", ourRef: "",
      kind: "REGULAR", status: "Draft",
      written: new Date().toISOString().slice(0, 10),
      ship: new Date().toISOString().slice(0, 10),
      cancel: new Date().toISOString().slice(0, 10),
      lines: [],
    });
    toast.success("Order created");
    nav({ to: "/order/$id", params: { id } });
  };

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Customer & supplier orders"
        actions={
          <>
            <Button variant="outline" size="sm" className="h-8 gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
            <Button size="sm" className="h-8 gap-1.5" onClick={newOrder}><Plus className="h-3.5 w-3.5" /> New Order</Button>
          </>
        }
      />
      <Toolbar>
        <TableSearch value={q} onChange={setQ} placeholder="Search code, customer, ref…" />
      </Toolbar>
      <div className="px-5 py-3">
        <DataTable
          rows={paged}
          columns={columns}
          onRowClick={(r) => nav({ to: "/order/$id", params: { id: r.id } })}
          emptyState={q ? "No orders match your search." : "No orders yet."}
        />
        <PaginationBar
          page={page} pageSize={pageSize} total={total}
          onPageChange={setPage} onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}
