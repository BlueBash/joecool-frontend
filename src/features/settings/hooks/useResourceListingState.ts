import { useCallback, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "../constants";
import type { EditingState } from "../types";

interface UseResourceListingStateOptions {
  initialPageSize?: number;
}

export interface ResourceListingState {
  page: number;
  pageSize: number;
  search: string;
  editing: EditingState;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (value: string) => void;
  setEditing: (next: EditingState) => void;
  toggleCreate: () => void;
  toggleEdit: (id: string) => void;
  closeEditor: () => void;
  resetPage: () => void;
}

/** State for the inline settings listing: pagination + search + editor target. */
export function useResourceListingState(
  opts: UseResourceListingStateOptions = {},
): ResourceListingState {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(opts.initialPageSize ?? DEFAULT_PAGE_SIZE);
  const [search, setSearchState] = useState("");
  const [editing, setEditing] = useState<EditingState>({ kind: "none" });

  const setSearch = useCallback((value: string) => {
    setSearchState(value);
    setPage(1);
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPage(1);
  }, []);

  const toggleCreate = useCallback(() => {
    setEditing((cur) => (cur.kind === "create" ? { kind: "none" } : { kind: "create" }));
  }, []);

  const toggleEdit = useCallback((id: string) => {
    setEditing((cur) =>
      cur.kind === "edit" && cur.id === id ? { kind: "none" } : { kind: "edit", id },
    );
  }, []);

  const closeEditor = useCallback(() => setEditing({ kind: "none" }), []);
  const resetPage = useCallback(() => setPage(1), []);

  return {
    page,
    pageSize,
    search,
    editing,
    setPage,
    setPageSize,
    setSearch,
    setEditing,
    toggleCreate,
    toggleEdit,
    closeEditor,
    resetPage,
  };
}
