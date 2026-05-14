import { useMemo, useState } from "react";
import { Download, Printer, Mail, MoreHorizontal } from "lucide-react";
import { useStocks, useOrders, useTxns, useAddresses, useTime } from "@/store";
import { PageHeader, CopyableCode } from "@/components/app-shell";
import { DataTable, Toolbar, type Column } from "@/components/data-table";
import { ColumnPicker, type ColumnDef } from "@/components/column-picker";
import { PaginationBar } from "@/components/pagination-bar";
import { Pill } from "@/components/pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type ReportType = "transactions" | "orders" | "addresses" | "stocks" | "time";

const REPORT_OPTIONS = [
  { value: "transactions", label: "Transactions" },
  { value: "orders",       label: "Orders" },
  { value: "addresses",    label: "Addresses" },
  { value: "stocks",       label: "Stocks" },
  { value: "time",         label: "Time Keeping" },
] satisfies readonly { value: ReportType; label: string }[];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

const isoDaysAgo = (d: number) => {
  const t = new Date();
  t.setDate(t.getDate() - d);
  return t.toISOString().slice(0, 10);
};
const today = () => new Date().toISOString().slice(0, 10);

function inRange(date: string, from: string, to: string) {
  if (!date) return true;
  const d = date.slice(0, 10);
  if (from && d < from) return false;
  if (to && d > to) return false;
  return true;
}

export function ReportsPage() {
  const [report, setReport] = useState<ReportType>("transactions");
  const [from, setFrom] = useState(isoDaysAgo(7));
  const [to, setTo] = useState(today());
  const [search, setSearch] = useState("");
  const [extra, setExtra] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const stocks    = useStocks(s => s.items);
  const orders    = useOrders(s => s.items);
  const txns      = useTxns(s => s.items);
  const addresses = useAddresses(s => s.items);
  const time      = useTime(s => s.items);

  type Built = {
    columns: ColumnDef[];
    tableCols: Column<any>[];
    rows: any[];
    extraOptions?: { value: string; label: string }[];
    extraLabel?: string;
    totalLabel?: string;
    totalValue?: number;
  };

  const built: Built = useMemo(() => {
    if (report === "transactions") {
      const rows = txns
        .filter(t => inRange(t.date, from, to))
        .filter(t => extra === "all" ? true : t.kind === extra)
        .filter(t => !search ||
          t.refMain.toLowerCase().includes(search.toLowerCase()) ||
          t.addrName.toLowerCase().includes(search.toLowerCase()));
      return {
        columns: [
          { key: "date",   label: "Date",     locked: true },
          { key: "ref",    label: "Reference" },
          { key: "kind",   label: "Kind" },
          { key: "addr",   label: "Account" },
          { key: "status", label: "Status" },
          { key: "value",  label: "Value" },
        ],
        tableCols: [
          { key: "date",   header: "Date",      width: "110px", cell: r => <span className="tabular-nums">{r.date}</span>, sortValue: r => r.date },
          { key: "ref",    header: "Reference", width: "130px", cell: r => <CopyableCode value={r.refMain} /> },
          { key: "kind",   header: "Kind",      width: "110px", cell: r => <span className="text-muted-foreground">{r.kind}</span> },
          { key: "addr",   header: "Account",   cell: r => <span className="truncate">{r.addrName}</span> },
          { key: "status", header: "Status",    width: "100px", cell: r => <Pill variant={r.status === "Paid" ? "success" : r.status === "Open" ? "warning" : r.status === "Void" ? "danger" : "info"}>{r.status}</Pill> },
          { key: "value",  header: "Value",     width: "130px", align: "right", cell: r => <span className="tabular-nums font-medium">{fmt(r.value)}</span>, sortValue: r => r.value },
        ],
        rows,
        extraLabel: "Kind",
        extraOptions: [
          { value: "all", label: "All kinds" },
          { value: "Invoice", label: "Invoice" },
          { value: "Credit", label: "Credit" },
          { value: "Payment", label: "Payment" },
        ],
        totalLabel: "Total value",
        totalValue: rows.reduce((s, r) => s + r.value, 0),
      };
    }
    if (report === "orders") {
      const rows = orders
        .filter(o => inRange(o.written, from, to))
        .filter(o => extra === "all" ? true : o.status === extra)
        .filter(o => !search ||
          o.code.toLowerCase().includes(search.toLowerCase()) ||
          o.addrName.toLowerCase().includes(search.toLowerCase()));
      return {
        columns: [
          { key: "written", label: "Written", locked: true },
          { key: "code",    label: "Order #" },
          { key: "addr",    label: "Customer" },
          { key: "kind",    label: "Kind" },
          { key: "status",  label: "Status" },
          { key: "lines",   label: "Lines" },
          { key: "value",   label: "Value" },
        ],
        tableCols: [
          { key: "written", header: "Written",  width: "110px", cell: r => <span className="tabular-nums">{r.written}</span>, sortValue: r => r.written },
          { key: "code",    header: "Order #",  width: "130px", cell: r => <CopyableCode value={r.code} /> },
          { key: "addr",    header: "Customer", cell: r => <span className="truncate">{r.addrName}</span> },
          { key: "kind",    header: "Kind",     width: "100px", cell: r => <span className="text-muted-foreground">{r.kind}</span> },
          { key: "status",  header: "Status",   width: "100px", cell: r => <Pill variant={r.status === "Shipped" ? "success" : r.status === "Cancelled" ? "danger" : r.status === "Confirmed" ? "info" : "warning"}>{r.status}</Pill> },
          { key: "lines",   header: "Lines",    width: "70px",  align: "right", cell: r => <span className="tabular-nums">{r.lines.length}</span> },
          { key: "value",   header: "Value",    width: "130px", align: "right", cell: r => <span className="tabular-nums font-medium">{fmt(r.lines.reduce((s: number, l: any) => s + l.qty * l.price, 0))}</span> },
        ],
        rows,
        extraLabel: "Status",
        extraOptions: [
          { value: "all", label: "All statuses" },
          { value: "Draft", label: "Draft" },
          { value: "Confirmed", label: "Confirmed" },
          { value: "Shipped", label: "Shipped" },
          { value: "Cancelled", label: "Cancelled" },
        ],
        totalLabel: "Total value",
        totalValue: rows.reduce((s, o) => s + o.lines.reduce((x: number, l: any) => x + l.qty * l.price, 0), 0),
      };
    }
    if (report === "addresses") {
      const rows = addresses
        .filter(a => extra === "all" ? true : a.type === extra)
        .filter(a => !search ||
          a.code.toLowerCase().includes(search.toLowerCase()) ||
          a.name.toLowerCase().includes(search.toLowerCase()));
      return {
        columns: [
          { key: "code",    label: "Code", locked: true },
          { key: "name",    label: "Name" },
          { key: "type",    label: "Type" },
          { key: "town",    label: "Town" },
          { key: "country", label: "Country" },
          { key: "email",   label: "Email" },
          { key: "phone",   label: "Phone" },
        ],
        tableCols: [
          { key: "code",    header: "Code",    width: "120px", cell: r => <CopyableCode value={r.code} /> },
          { key: "name",    header: "Name",    cell: r => <span className="truncate">{r.name}</span> },
          { key: "type",    header: "Type",    width: "110px", cell: r => <Pill variant="info">{r.type}</Pill> },
          { key: "town",    header: "Town",    width: "140px", cell: r => <span className="text-muted-foreground">{r.town}</span> },
          { key: "country", header: "Country", width: "120px", cell: r => <span className="text-muted-foreground">{r.country}</span> },
          { key: "email",   header: "Email",   cell: r => <span className="text-muted-foreground truncate">{r.email ?? "—"}</span> },
          { key: "phone",   header: "Phone",   width: "140px", cell: r => <span className="tabular-nums text-muted-foreground">{r.phone ?? "—"}</span> },
        ],
        rows,
        extraLabel: "Type",
        extraOptions: [
          { value: "all", label: "All types" },
          { value: "Customer", label: "Customer" },
          { value: "Supplier", label: "Supplier" },
        ],
      };
    }
    if (report === "stocks") {
      const rows = stocks
        .filter(s => extra === "all" ? true : s.status === extra)
        .filter(s => !search ||
          s.code.toLowerCase().includes(search.toLowerCase()) ||
          s.title.toLowerCase().includes(search.toLowerCase()));
      return {
        columns: [
          { key: "code",     label: "Code", locked: true },
          { key: "title",    label: "Title" },
          { key: "category", label: "Category" },
          { key: "onHand",   label: "On Hand" },
          { key: "reorder",  label: "Reorder" },
          { key: "cost",     label: "Cost" },
          { key: "price",    label: "Selling" },
          { key: "status",   label: "Status" },
        ],
        tableCols: [
          { key: "code",     header: "Code",     width: "110px", cell: r => <CopyableCode value={r.code} /> },
          { key: "title",    header: "Title",    cell: r => <span className="truncate">{r.title}</span> },
          { key: "category", header: "Category", width: "130px", cell: r => <span className="text-muted-foreground">{r.category}</span> },
          { key: "onHand",   header: "On Hand",  width: "100px", align: "right", cell: r => <span className="tabular-nums">{r.onHand}</span>, sortValue: r => r.onHand },
          { key: "reorder",  header: "Reorder",  width: "100px", align: "right", cell: r => <span className="tabular-nums text-muted-foreground">{r.reorderLevel}</span> },
          { key: "cost",     header: "Cost",     width: "110px", align: "right", cell: r => <span className="tabular-nums">{fmt(r.costPrice)}</span> },
          { key: "price",    header: "Selling",  width: "110px", align: "right", cell: r => <span className="tabular-nums font-medium">{fmt(r.sellingPrice)}</span> },
          { key: "status",   header: "Status",   width: "100px", cell: r => <Pill variant={r.status === "active" ? "success" : r.status === "out" ? "danger" : r.status === "low" ? "warning" : "info"}>{r.status}</Pill> },
        ],
        rows,
        extraLabel: "Status",
        extraOptions: [
          { value: "all", label: "All statuses" },
          { value: "active", label: "Active" },
          { value: "low", label: "Low" },
          { value: "out", label: "Out" },
          { value: "archived", label: "Archived" },
        ],
        totalLabel: "Stock value",
        totalValue: rows.reduce((s, r) => s + r.onHand * r.costPrice, 0),
      };
    }
    // time
    const rows = time
      .filter(e => inRange(e.date, from, to))
      .filter(e => extra === "all" ? true : e.operatorCode === extra)
      .filter(e => !search ||
        e.operatorName.toLowerCase().includes(search.toLowerCase()));
    const operatorOptions = [
      { value: "all", label: "All operators" },
      ...Array.from(new Map(time.map(t => [t.operatorCode, t.operatorName])).entries())
        .map(([code, name]) => ({ value: code, label: `${code} — ${name}` })),
    ];
    return {
      columns: [
        { key: "date",     label: "Date", locked: true },
        { key: "operator", label: "Operator" },
        { key: "in",       label: "In" },
        { key: "out",      label: "Out" },
        { key: "breaks",   label: "Breaks (min)" },
        { key: "total",    label: "Total (hrs)" },
      ],
      tableCols: [
        { key: "date",     header: "Date",     width: "110px", cell: r => <span className="tabular-nums">{r.date}</span>, sortValue: r => r.date },
        { key: "operator", header: "Operator", cell: r => <span className="truncate"><span className="text-muted-foreground mr-2">{r.operatorCode}</span>{r.operatorName}</span> },
        { key: "in",       header: "In",       width: "90px",  cell: r => <span className="tabular-nums">{r.inAt}</span> },
        { key: "out",      header: "Out",      width: "90px",  cell: r => <span className="tabular-nums">{r.outAt}</span> },
        { key: "breaks",   header: "Breaks",   width: "100px", align: "right", cell: r => <span className="tabular-nums text-muted-foreground">{r.breaksTime ?? 0}</span> },
        { key: "total",    header: "Total",    width: "100px", align: "right", cell: r => <span className="tabular-nums font-medium">{(r.totalWorked ?? 0).toFixed(2)}</span> },
      ],
      rows,
      extraLabel: "Operator",
      extraOptions: operatorOptions,
      totalLabel: "Total hours",
      totalValue: rows.reduce((s, r) => s + (r.totalWorked ?? 0), 0),
    };
  }, [report, from, to, search, extra, txns, orders, addresses, stocks, time]);

  const [visible, setVisible] = useState<Set<string>>(() => new Set(built.columns.map(c => c.key)));

  // Reset visible cols + filters when switching report type
  const switchReport = (r: ReportType) => {
    setReport(r);
    setExtra("all");
    setPage(1);
    setSearch("");
  };
  // Re-init visible columns whenever report changes
  useMemo(() => {
    setVisible(new Set(built.columns.map(c => c.key)));
    setPage(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report]);

  const visibleCols = built.tableCols.filter(c => visible.has(c.key));
  const totalRows = built.rows.length;
  const pageRows = built.rows.slice((page - 1) * pageSize, page * pageSize);

  const exportCSV = () => {
    const cols = visibleCols;
    const head = cols.map(c => (typeof c.header === "string" ? c.header : c.key)).join(",");
    const body = built.rows.map(r =>
      cols.map(c => {
        const sv = c.sortValue?.(r);
        const v = sv ?? (typeof r[c.key] !== "undefined" ? r[c.key] : "");
        const s = String(v ?? "").replace(/"/g, '""');
        return /[",\n]/.test(s) ? `"${s}"` : s;
      }).join(","),
    ).join("\n");
    const blob = new Blob([head + "\n" + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${report}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded");
  };

  return (
    <div>
      <PageHeader title="Reports" description="Filter, view and export operational reports" />

      <Toolbar>
        <Select value={report} onValueChange={(v) => switchReport(v as ReportType)}>
          <SelectTrigger className="h-8 w-[180px] text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REPORT_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {report !== "addresses" && report !== "stocks" && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] text-muted-foreground">From</span>
              <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className="h-8 w-36 text-[13px]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] text-muted-foreground">To</span>
              <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} className="h-8 w-36 text-[13px]" />
            </div>
          </>
        )}

        {built.extraOptions && (
          <Select value={extra} onValueChange={(v) => { setExtra(v); setPage(1); }}>
            <SelectTrigger className="h-8 w-[180px] text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {built.extraOptions.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search…"
          className="h-8 w-56 text-[13px]"
        />

        <div className="ml-auto flex items-center gap-1.5">
          <ColumnPicker columns={built.columns} visible={visible} onChange={setVisible} />
          <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={exportCSV}>
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" /> Print
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => toast.success("Report emailed")}>
                <Mail className="h-3.5 w-3.5 mr-2" /> Email report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportCSV}>
                <Download className="h-3.5 w-3.5 mr-2" /> Download as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.print()}>
                <Printer className="h-3.5 w-3.5 mr-2" /> Print preview
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Toolbar>

      <div className="px-5 py-3 space-y-2">
        <div className="flex items-center justify-between text-[12.5px] text-muted-foreground">
          <span>
            {REPORT_OPTIONS.find(o => o.value === report)?.label} •{" "}
            <span className="text-foreground font-medium tabular-nums">{totalRows}</span> records
          </span>
          {built.totalLabel && (
            <span>
              {built.totalLabel}:{" "}
              <span className="text-foreground font-semibold tabular-nums">
                {report === "time" ? `${(built.totalValue ?? 0).toFixed(2)} hrs` : fmt(built.totalValue ?? 0)}
              </span>
            </span>
          )}
        </div>

        <DataTable
          rows={pageRows}
          columns={visibleCols}
          emptyState={
            <div className="py-8">
              <div className="text-foreground font-medium">No records match these filters</div>
              <div className="text-[12.5px] text-muted-foreground mt-1">
                Adjust the date range or filters above to see results.
              </div>
            </div>
          }
        />

        <PaginationBar
          page={page}
          pageSize={pageSize}
          total={totalRows}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        />
      </div>
    </div>
  );
}
