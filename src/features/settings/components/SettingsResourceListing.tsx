import { toast } from "sonner";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QueryState } from "@/components/states/QueryState";
import type { ApiError } from "@/api/_client";
import { getSettingsResource } from "../registry";
import { useResourceListingState } from "../hooks/useResourceListingState";
import type { SettingsResourceEntry, BuildListingColumnsContext } from "../types";
import { buildListingColumns } from "./listing-columns";
import { ResourceRowForm } from "./ResourceRowForm";
import { PaginationBar } from "@/components/pagination-bar";

interface SettingsResourceListingProps {
  slug: string;
  title: string;
}

export function SettingsResourceListing({ slug, title }: SettingsResourceListingProps) {
  const entry = getSettingsResource(slug);

  if (!entry) {
    return (
      <div className="m-4 rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
        This section is not yet wired to the API.
      </div>
    );
  }

  return <ResourceTable entry={entry} title={title} />;
}

interface ResourceTableProps {
  entry: SettingsResourceEntry;
  title: string;
}

function ResourceTable({ entry }: ResourceTableProps) {
  const { resource, singular, plural } = entry;
  const state = useResourceListingState();
  const { page, pageSize, search, editing } = state;

  const list = resource.hooks.useList(
    { page, pageSize, search: search || undefined },
    { keepPreviousData: true },
  );

  const remove = resource.hooks.useDelete({
    onSuccess: () => toast.success(`${singular} removed`),
    onError: (err: ApiError) => {
      if (!err.isValidation) toast.error(err.message);
    },
  });

  const expandedIds = editing.kind === "edit" ? new Set<string>([editing.id]) : new Set<string>();

  const listingCtx: BuildListingColumnsContext = {
    entry,
    editing,
    onEdit: state.toggleEdit,
    onDelete: (id: string) => {
      if (editing.kind === "edit" && editing.id === id) state.closeEditor();
      remove.mutate({ id });
    },
  };

  // const columns = entry.buildListingColumns
  //   ? entry.buildListingColumns(listingCtx)
  //   : buildListingColumns(listingCtx);

  const columns = buildListingColumns(listingCtx, entry.bodyKey);

  return (
    <div>
      <div className="flex items-center justify-between gap-2 p-3">
        <Input
          aria-label={`Search ${plural}`}
          placeholder={`Search ${plural.toLowerCase()}…`}
          value={search}
          onChange={(e) => state.setSearch(e.target.value)}
          className="h-8 max-w-xs text-[13px]"
        />
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
