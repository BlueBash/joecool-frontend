import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Download, Zap, Loader2 } from "lucide-react";
import { stocks } from "@/api/stocks";
import type { ApiError } from "@/api/_client";
import { PageHeader, CopyableCode } from "@/components/app-shell";
import { DataTable, Toolbar, TableSearch, type Column } from "@/components/data-table";
import { Pill } from "@/components/pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColumnPicker, type ColumnDef } from "@/components/column-picker";
import { PaginationBar } from "@/components/pagination-bar";
import { RowActions, EditLink, DeleteButton } from "@/components/row-actions";
import { toast } from "sonner";
import type { StockItem } from "@/lib/types";
import { useStockDirectory } from "./hooks";
import { stockItemToPayload } from "./map-stock";

type AddStockHandler = (item: StockItem) => void;

interface QuickAddStockProps {
  onAdd: AddStockHandler;
  onCancel: () => void;
  isSaving: boolean;
}

const ALL_COLS = [
  { key: "code", label: "Code", locked: true },
  { key: "img", label: "Image" },
  { key: "title", label: "Wholesale Title" },
  { key: "category", label: "Category" },
  { key: "onHand", label: "Stock On Hand" },
  { key: "color", label: "Color" },
  { key: "intro", label: "Intro Date" },
  { key: "status", label: "Status" },
] satisfies ColumnDef[];

export function StockPage() {
  return <StockListing />;
}

function StockListing() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [visible, setVisible] = useState<Set<string>>(new Set(ALL_COLS.map((c) => c.key)));
  const [adding, setAdding] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const directory = useStockDirectory({ page, pageSize, search: q });

  const createStock = stocks.hooks.useCreate({
    onSuccess: (row) => {
      toast.success("Stock created");
      setAdding(false);
      nav({ to: "/stock/$id", params: { id: String(row.id) } });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const deleteStock = stocks.hooks.useDelete({
    onSuccess: () => toast.success("Stock removed"),
    onError: (err: ApiError) => toast.error(err.message),
  });

  const attentionCount = directory.items.filter((i) => i.status !== "active").length;

  const allColumns = [
    {
      key: "code",
      header: "Code",
      width: "120px",
      sortValue: (r: StockItem) => r.code,
      cell: (r: StockItem) => (
        <span className="font-medium">
          <CopyableCode value={r.code} />
        </span>
      ),
    },
    {
      key: "img",
      header: "",
      width: "44px",
      cell: (r: StockItem) => (
        <div
          className="h-7 w-7 rounded border border-border"
          style={{ background: `oklch(0.85 0.08 ${r.imageHue})` }}
        />
      ),
    },
    {
      key: "title",
      header: "Wholesale Title",
      sortValue: (r: StockItem) => r.title,
      cell: (r: StockItem) => <span className="truncate block max-w-[320px]">{r.title}</span>,
    },
    {
      key: "category",
      header: "Category",
      width: "120px",
      sortValue: (r: StockItem) => r.category,
      cell: (r: StockItem) => <span className="text-muted-foreground">{r.category}</span>,
    },
    {
      key: "onHand",
      header: "On Hand",
      width: "100px",
      align: "right" as const,
      sortValue: (r: StockItem) => r.onHand,
      cell: (r: StockItem) => (
        <span
          className={`tabular-nums font-semibold ${r.onHand === 0 ? "text-destructive" : r.onHand < r.reorderLevel ? "text-warning" : "text-foreground"}`}
        >
          {r.onHand}
        </span>
      ),
    },
    {
      key: "color",
      header: "Color",
      width: "100px",
      cell: (r: StockItem) => <span className="text-muted-foreground">{r.color}</span>,
    },
    {
      key: "intro",
      header: "Intro Date",
      width: "120px",
      align: "right" as const,
      sortValue: (r: StockItem) => r.introDate,
      cell: (r: StockItem) => (
        <span className="text-muted-foreground tabular-nums">{r.introDate}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "90px",
      cell: (r: StockItem) => (
        <Pill
          variant={
            r.status === "active"
              ? "success"
              : r.status === "low"
                ? "warning"
                : r.status === "out"
                  ? "danger"
                  : "neutral"
          }
        >
          {r.status}
        </Pill>
      ),
    },
  ] satisfies Column<StockItem>[];

  const columns = [
    ...allColumns.filter((c) => visible.has(c.key)),
    {
      key: "actions",
      header: "Actions",
      width: "90px",
      align: "right" as const,
      cell: (r: StockItem) => (
        <RowActions>
          <EditLink to="/stock/$id" params={{ id: r.id }} title="Edit stock" />
          <DeleteButton onClick={() => deleteStock.mutate({ id: r.id })} />
        </RowActions>
      ),
    },
  ] satisfies Column<StockItem>[];

  const isSaving = createStock.isPending;

  return (
    <div>
      <PageHeader
        title="Stock"
        description={`${attentionCount} need attention`}
        actions={
          <>
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={() => setAdding((v) => !v)}
            >
              <Zap className="h-3.5 w-3.5" /> Quick Add
            </Button>
            <Button
              size="sm"
              className="h-8 gap-1.5"
              onClick={() => nav({ to: "/stock/$id", params: { id: "new" } })}
            >
              <Plus className="h-3.5 w-3.5" /> Add Stock
            </Button>
          </>
        }
      />
      <Toolbar>
        <TableSearch
          value={q}
          onChange={(v) => {
            setQ(v);
            setPage(1);
          }}
          placeholder="Search by code, title, color…"
        />
        <div className="ml-auto">
          <ColumnPicker columns={ALL_COLS} visible={visible} onChange={setVisible} />
        </div>
      </Toolbar>

      {directory.isPending ? (
        <div className="flex items-center gap-2 px-5 py-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading stock…
        </div>
      ) : directory.isError ? (
        <div className="m-5 rounded-md border border-destructive/40 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">
            {(directory.error as ApiError)?.message ?? "Failed to load stock"}
          </p>
          <Button variant="outline" size="sm" className="mt-3 h-8" onClick={() => directory.refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <div className="px-5 py-3">
          <DataTable
            rows={directory.items}
            columns={columns}
            quickAddRow={
              adding ? (
                <QuickAddStock
                  onAdd={(item) => createStock.mutate(stockItemToPayload(item))}
                  onCancel={() => setAdding(false)}
                  isSaving={isSaving}
                />
              ) : undefined
            }
            onRowClick={(r) => nav({ to: "/stock/$id", params: { id: r.id } })}
            emptyState={q ? "No stock matches your search." : "No stock items yet."}
          />
          <PaginationBar
            page={directory.meta.page}
            pageSize={directory.meta.pageSize}
            total={directory.meta.total}
            onPageChange={setPage}
            onPageSizeChange={(n) => {
              setPageSize(n);
              setPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
}

function QuickAddStock({ onAdd, onCancel, isSaving }: QuickAddStockProps) {
  const [draft, setDraft] = useState({ code: "", title: "", category: "", onHand: "" });
  const submit = () => {
    if (!draft.code || !draft.title) {
      toast.error("Code and Title are required");
      return;
    }
    const onHand = Number(draft.onHand) || 0;
    onAdd({
      id: "",
      code: draft.code.toUpperCase(),
      title: draft.title,
      category: draft.category || "—",
      onHand,
      reorderLevel: 5,
      color: "—",
      introDate: new Date().toISOString().slice(0, 10),
      costPrice: 0,
      sellingPrice: 0,
      status: onHand === 0 ? "out" : "active",
      imageHue: Math.floor(Math.random() * 360),
      flags: [],
    });
  };
  return (
    <div className="flex items-center gap-2 px-3 py-1.5">
      <Plus className="h-3.5 w-3.5 text-muted-foreground" />
      <Input
        autoFocus
        placeholder="Code"
        value={draft.code}
        onChange={(e) => setDraft((d) => ({ ...d, code: e.target.value }))}
        className="h-7 w-28 text-[13px] font-mono"
        onKeyDown={(e) => e.key === "Enter" && submit()}
        disabled={isSaving}
      />
      <Input
        placeholder="Title"
        value={draft.title}
        onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
        className="h-7 flex-1 text-[13px]"
        onKeyDown={(e) => e.key === "Enter" && submit()}
        disabled={isSaving}
      />
      <Input
        placeholder="Category"
        value={draft.category}
        onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
        className="h-7 w-32 text-[13px]"
        onKeyDown={(e) => e.key === "Enter" && submit()}
        disabled={isSaving}
      />
      <Input
        placeholder="On Hand"
        type="number"
        value={draft.onHand}
        onChange={(e) => setDraft((d) => ({ ...d, onHand: e.target.value }))}
        className="h-7 w-24 text-[13px] text-right tabular-nums"
        onKeyDown={(e) => e.key === "Enter" && submit()}
        disabled={isSaving}
      />
      <Button size="sm" className="h-7" onClick={submit} disabled={isSaving}>
        {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Add"}
      </Button>
      <Button size="sm" variant="ghost" className="h-7" onClick={onCancel} disabled={isSaving}>
        Cancel
      </Button>
    </div>
  );
}
