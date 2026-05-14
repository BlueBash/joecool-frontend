import { useEffect, useMemo, useState } from "react";

export function usePaginated<T>(rows: T[], initialSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialSize);

  // Reset to page 1 when filtering shrinks total below current window
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    if (page > totalPages) setPage(1);
  }, [rows.length, pageSize, page]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  return { page, setPage, pageSize, setPageSize, paged, total: rows.length };
}
