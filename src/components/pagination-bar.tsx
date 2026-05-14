import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PageChangeHandler = (page: number) => void;
type PageSizeChangeHandler = (pageSize: number) => void;

interface PaginationBarProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: PageChangeHandler;
  onPageSizeChange?: PageSizeChangeHandler;
  pageSizeOptions?: number[];
}

export function PaginationBar({
  page, pageSize, total, onPageChange, onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}: PaginationBarProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const go = (p: number) => onPageChange(Math.min(totalPages, Math.max(1, p)));

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-t border-border bg-background text-[12.5px]">
      <div className="text-muted-foreground tabular-nums">
        {total === 0 ? "No records" : <>Showing <span className="text-foreground font-medium">{from}–{to}</span> of <span className="text-foreground font-medium">{total.toLocaleString()}</span></>}
      </div>
      <div className="flex items-center gap-3">
        {onPageSizeChange && (
          <label className="flex items-center gap-1.5 text-muted-foreground">
            Rows
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-7 px-1.5 rounded border border-border bg-background text-[12.5px]"
            >
              {pageSizeOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        )}
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page <= 1} onClick={() => go(1)} aria-label="First"><ChevronsLeft className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page <= 1} onClick={() => go(page - 1)} aria-label="Previous"><ChevronLeft className="h-3.5 w-3.5" /></Button>
          <span className="px-2 tabular-nums text-muted-foreground">Page <span className="text-foreground font-medium">{page}</span> of {totalPages}</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => go(page + 1)} aria-label="Next"><ChevronRight className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => go(totalPages)} aria-label="Last"><ChevronsRight className="h-3.5 w-3.5" /></Button>
        </div>
      </div>
    </div>
  );
}

export function usePagination<T>(rows: T[], initial = 10) {
  return { rows, initial };
}
