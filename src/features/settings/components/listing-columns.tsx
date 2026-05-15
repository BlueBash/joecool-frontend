import { Pencil } from "lucide-react";
import type { Column } from "@/components/data-table";
import { DeleteButton, RowActions } from "@/components/row-actions";
import type { BuildListingColumnsContext, SettingItemLike } from "../types";
export function buildRowActionsColumn(
  ctx: Pick<BuildListingColumnsContext, "editing" | "onEdit" | "onDelete">,
): Column<SettingItemLike> {
  const { editing, onEdit, onDelete } = ctx;
  return {
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
  };
}

export function buildListingColumns(
  ctx: BuildListingColumnsContext,
  bodyKey: string,
): Column<SettingItemLike>[] {
  return [
    {
      key: "name",
      header: "Name",
      sortValue: (r) => r.name,
      cell: (r) => <span className="font-medium">{r.name}</span>,
    },
    {
      key: "detail",
      header: "Code",
      cell: (r) => {
        const code = typeof r.code === "string" ? r.code : null;
        const blurbRaw = (r as unknown as { blurb?: unknown }).blurb;
        const blurb = typeof blurbRaw === "string" ? blurbRaw : null;
        const desc = typeof r.description === "string" ? r.description : null;
        const text = code ?? blurb ?? desc;
        return <span className="text-muted-foreground">{text?.trim() ? text : "—"}</span>;
      },
    },
    buildRowActionsColumn(ctx),
  ];
}
