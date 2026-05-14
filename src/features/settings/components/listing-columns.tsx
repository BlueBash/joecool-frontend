import { Pencil } from "lucide-react";
import type { Column } from "@/components/data-table";
import { DeleteButton, RowActions } from "@/components/row-actions";
import type { EditingState, SettingItemLike } from "../types";

interface BuildColumnsOptions {
  editing: EditingState;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/** Pure factory for the inline listing columns. */
export function buildListingColumns({
  editing,
  onEdit,
  onDelete,
}: BuildColumnsOptions): Column<SettingItemLike>[] {
  return [
    {
      key: "name",
      header: "Name",
      sortValue: (r) => r.name,
      cell: (r) => <span className="font-medium">{r.name}</span>,
    },
    {
      key: "description",
      header: "Description",
      cell: (r) => (
        <span className="text-muted-foreground">{r.description ?? "—"}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "90px",
      align: "right",
      cell: (r) => {
        const isEditing = editing.kind === "edit" && editing.id === r.id;
        return (
          <RowActions>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(r.id);
              }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              title="Edit"
              aria-label={`Edit ${r.name}`}
              aria-expanded={isEditing}
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden />
            </button>
            <DeleteButton onClick={() => onDelete(r.id)} />
          </RowActions>
        );
      },
    },
  ];
}
