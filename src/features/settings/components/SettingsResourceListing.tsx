import { toast } from "sonner";
import { Plus } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { DataTable } from "@/components/data-table";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QueryState } from "@/components/states/QueryState";
import type { ApiError } from "@/api/_client";
import { getSettingsListFilters } from "../filters";
import { useResourceListingState } from "../hooks/useResourceListingState";
import { useSettingsListFilters } from "../hooks/useSettingsListFilters";
import type { SettingsResourceEntry, BuildListingColumnsContext } from "../types";
import { buildListingColumns } from "./listing-columns";
import { ResourceRowForm } from "./ResourceRowForm";
import { SettingsFiltersBar } from "./SettingsFiltersBar";
import { PaginationBar } from "@/components/pagination-bar";

interface SettingsResourceListingProps {
  slug: string;
  entry: SettingsResourceEntry;
  title: string;
}

export function SettingsResourceListing({ slug, entry }: SettingsResourceListingProps) {
  return <ResourceTable slug={slug} entry={entry} />;
}

interface ResourceTableProps {
  slug: string;
  entry: SettingsResourceEntry;
}

function ResourceTable({ slug, entry }: ResourceTableProps) {
  const { resource, singular, plural } = entry;
  const state = useResourceListingState();
  const { page, pageSize, search, editing } = state;
  const filterConfig = getSettingsListFilters(slug, entry);
  const filters = useSettingsListFilters(filterConfig, { onFiltersChange: state.resetPage });

  const list = resource.hooks.useList(
    {
      page,
      pageSize,
      search: search || undefined,
      filters: filters.hasActiveFilters ? filters.apiFilters : undefined,
    },
    { keepPreviousData: true },
  );

  const remove = resource.hooks.useDelete({
    onSuccess: () => toast.success(`${singular} removed`),
    onError: (err: ApiError) => {
      if (!err.isValidation) toast.error(err.message);
    },
  });

  const deleteConfirm = useDeleteConfirm<{ id: string }>({
    onConfirm: async ({ id }) => {
      if (editing.kind === "edit" && editing.id === id) state.closeEditor();
      await remove.mutateAsync({ id });
    },
  });

  const expandedIds = editing.kind === "edit" ? new Set<string>([editing.id]) : new Set<string>();

  const listingCtx: BuildListingColumnsContext = {
    entry,
    editing,
    onEdit: state.toggleEdit,
    onDelete: (row) => {
      const code = typeof row.code === "string" ? row.code : null;
      deleteConfirm.requestDelete({
        title: `Delete ${singular}`,
        entityName: row.name?.trim() || code?.trim() || row.id,
        entityType: singular.toLowerCase(),
        meta: { id: row.id },
      });
    },
  };

  const columns = entry.buildListingColumns
    ? entry.buildListingColumns(listingCtx)
    : buildListingColumns(listingCtx, entry.bodyKey);

  return (
    <div>
      <DeleteConfirmDialog state={deleteConfirm} />
      <div className="flex flex-wrap items-center justify-between gap-2 p-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          <SettingsFiltersBar config={filterConfig} filters={filters} />
          {/* <Input
            aria-label={`Search ${plural}`}
            placeholder={`Search ${plural.toLowerCase()}…`}
            value={search}
            onChange={(e) => state.setSearch(e.target.value)}
            className="h-8 max-w-xs shrink-0 text-[13px]"
          /> */}
        </div>
        <Button
          size="sm"
          className="h-8 gap-1.5"
          onClick={state.toggleCreate}
          aria-expanded={editing.kind === "create"}
          aria-label={`Add ${singular}`}
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Add {singular}
        </Button>
      </div>

      <QueryState
        query={list}
        isEmpty={(data) => data.items.length === 0 && editing.kind !== "create"}
        empty={
          <div className="m-4 rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No {plural.toLowerCase()} yet.
          </div>
        }
      >
        {(paged) => (
          <>
            <div className="px-5 py-3">
              <DataTable
                rows={paged.items}
                columns={columns}
                expandedIds={expandedIds}
                expandOnRowClick={false}
                expandedRow={(row) =>
                  editing.kind === "edit" && editing.id === row.id ? (
                    <ResourceRowForm
                      entry={entry}
                      mode={{ kind: "edit", id: row.id }}
                      onDone={state.closeEditor}
                    />
                  ) : null
                }
                quickAddRow={
                  editing.kind === "create" ? (
                    <ResourceRowForm
                      entry={entry}
                      mode={{ kind: "create" }}
                      onDone={state.closeEditor}
                    />
                  ) : undefined
                }
              />
            </div>
            <PaginationBar
              page={paged.meta.page}
              pageSize={paged.meta.pageSize}
              total={paged.meta.total}
              onPageChange={state.setPage}
              onPageSizeChange={state.setPageSize}
            />
          </>
        )}
      </QueryState>
    </div>
  );
}
