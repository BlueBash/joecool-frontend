import { useState, useMemo, ReactNode } from "react";
import { ChevronRight, Search, ChevronDown } from "lucide-react";
import { useUi } from "@/store";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export type Column<T> = {
  key: string;
  header: ReactNode;
  width?: string;
  align?: "left" | "right" | "center";
  cell: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
  sticky?: boolean;
};

export interface DataTableProps<T extends { id: string }> {
  rows: T[];
  columns: Column<T>[];
  expandedRow?: (row: T) => ReactNode;
  selected?: Set<string>;
  onSelectChange?: (s: Set<string>) => void;
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
  quickAddRow?: ReactNode;
  rowKey?: (row: T) => string;
  className?: string;
  expandedIds?: Set<string>;
  expandOnRowClick?: boolean;
}

export function DataTable<T extends { id: string }>({
  rows, columns, expandedRow, selected, onSelectChange,
  emptyState, quickAddRow, onRowClick, expandedIds, expandOnRowClick = true,
}: DataTableProps<T>) {
  const density = useUi((s) => s.density);
  const [internalExpanded, setExpanded] = useState<Set<string>>(new Set());
  const expanded = expandedIds ?? internalExpanded;
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find(c => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const sorted = [...rows].sort((a, b) => {
      const av = col.sortValue!(a); const bv = col.sortValue!(b);
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [rows, sort, columns]);

  const allChecked = selected && rows.length > 0 && rows.every(r => selected.has(r.id));
  const toggleAll = () => {
    if (!onSelectChange) return;
    if (allChecked) onSelectChange(new Set());
    else onSelectChange(new Set(rows.map(r => r.id)));
  };
  const toggleOne = (id: string) => {
    if (!onSelectChange || !selected) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    onSelectChange(next);
  };
  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const dens = density === "compact" ? "table-compact" : "table-cozy";
  const align = (a?: "left" | "right" | "center") =>
    a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";

  return (
    <div className="overflow-auto scrollbar-thin border border-border rounded-md bg-card">
      <table className={cn("w-full text-[13px] border-separate border-spacing-0", dens)}>
        <thead className="bg-muted/50 text-muted-foreground sticky top-0 z-10">
          <tr>
            {expandedRow && <th className="w-7 border-b border-border" />}
            {onSelectChange && (
              <th className="w-9 border-b border-border">
                <div className="flex justify-center">
                  <Checkbox checked={!!allChecked} onCheckedChange={toggleAll} />
                </div>
              </th>
            )}
            {columns.map((c) => (
              <th
                key={c.key}
                style={{ width: c.width }}
                className={cn(
                  "border-b border-border font-medium text-[11.5px] uppercase tracking-wide",
                  align(c.align),
                  c.sortValue && "cursor-pointer select-none hover:text-foreground",
                  c.className,
                )}
                onClick={() => {
                  if (!c.sortValue) return;
                  setSort(s => s?.key === c.key
                    ? { key: c.key, dir: s.dir === "asc" ? "desc" : "asc" }
                    : { key: c.key, dir: "asc" });
                }}
              >
                <span className="inline-flex items-center gap-1">
                  {c.header}
                  {sort?.key === c.key && (sort.dir === "asc" ? "↑" : "↓")}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {quickAddRow && (
            <tr className="bg-accent/30">
              {expandedRow && <td className="border-b border-border" />}
              {onSelectChange && <td className="border-b border-border" />}
              <td colSpan={columns.length} className="border-b border-border">
                {quickAddRow}
              </td>
            </tr>
          )}
          {sortedRows.length === 0 && (
            <tr>
              <td colSpan={columns.length + (expandedRow ? 1 : 0) + (onSelectChange ? 1 : 0)} className="text-center py-12 text-muted-foreground">
                {emptyState ?? "No records"}
              </td>
            </tr>
          )}
          {sortedRows.map((row) => {
            const isExpanded = expanded.has(row.id);
            const isSelected = selected?.has(row.id);
            return (
              <FragmentRow key={row.id}>
                <tr
                  className={cn(
                    "group border-b border-border hover:bg-accent/40 transition-colors",
                    isSelected && "bg-primary/5",
                    onRowClick && "cursor-pointer",
                  )}
                  onClick={() => {
                    if (expandedRow && expandOnRowClick && !expandedIds) toggleExpand(row.id);
                    onRowClick?.(row);
                  }}
                >
                  {expandedRow && (
                    <td className="border-b border-border align-middle">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleExpand(row.id); }}
                        className="h-6 w-6 grid place-items-center text-muted-foreground hover:text-foreground"
                        aria-label="Expand"
                      >
                        {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                      </button>
                    </td>
                  )}
                  {onSelectChange && (
                    <td className="border-b border-border align-middle">
                      <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={!!isSelected} onCheckedChange={() => toggleOne(row.id)} />
                      </div>
                    </td>
                  )}
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        "border-b border-border align-middle",
                        align(c.align),
                        c.className,
                      )}
                    >
                      {c.cell(row)}
                    </td>
                  ))}
                </tr>
                {isExpanded && expandedRow && (
                  <tr className="bg-muted/30">
                    <td colSpan={columns.length + 1 + (onSelectChange ? 1 : 0)} className="p-0">
                      <div className="border-l-2 border-primary/40 mx-2 my-1 bg-card rounded-md border border-border shadow-sm">
                        {expandedRow(row)}
                      </div>
                    </td>
                  </tr>
                )}
              </FragmentRow>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface FragmentRowProps {
  children: React.ReactNode;
}

function FragmentRow({ children }: FragmentRowProps) {
  return <>{children}</>;
}

type TableSearchOnChange = (value: string) => void;

interface TableSearchProps {
  value: string;
  onChange: TableSearchOnChange;
  placeholder?: string;
}

export function TableSearch({
  value, onChange, placeholder = "Search…",
}: TableSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8 h-8 w-64 text-[13px]"
      />
    </div>
  );
}

interface ToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export function Toolbar({ children, className }: ToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 px-5 py-2.5 border-b border-border bg-background sticky top-12 z-[5]", className)}>
      {children}
    </div>
  );
}

interface BulkBarProps {
  count: number;
  onClear: () => void;
  children: React.ReactNode;
}

export function BulkBar({
  count, onClear, children,
}: BulkBarProps) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-3 px-5 py-2 border-b border-border bg-primary/5">
      <span className="text-[13px] font-medium">{count} selected</span>
      <div className="flex items-center gap-1.5">{children}</div>
      <button onClick={onClear} className="ml-auto text-[12px] text-muted-foreground hover:text-foreground">
        Clear
      </button>
    </div>
  );
}
