import { Pencil } from "lucide-react";
import type { Column } from "@/components/data-table";
import { DeleteButton, RowActions } from "@/components/row-actions";
import { readFieldValue } from "../utils";
import type { BuildListingColumnsContext, FieldDef, SettingItemLike } from "../types";

export interface ListingDetailSpec {
  header: string;
  keys: string[];
  truncate?: number;
}

function formatDetailCellValue(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "string") return value.trim() ? value : null;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function resolveDetailText(row: SettingItemLike, spec: ListingDetailSpec): string | null {
  for (const key of spec.keys) {
    const text = formatDetailCellValue(readFieldValue(row, key));
    if (text) {
      if (spec.truncate != null && text.length > spec.truncate) {
        return `${text.slice(0, spec.truncate)}…`;
      }
      return text;
    }
  }
  return null;
}

export function resolveListingDetailColumn(fields: FieldDef[]): ListingDetailSpec | null {
  const names = new Set(fields.map((f) => f.name));
  const label = (name: string) => fields.find((f) => f.name === name)?.label ?? name;

  if (names.has("code")) {
    return { header: label("code"), keys: ["code", "blurb", "description"] };
  }
  if (names.has("blurb")) {
    return { header: label("blurb"), keys: ["blurb"] };
  }
  if (names.has("message")) {
    return { header: label("message"), keys: ["message"], truncate: 80 };
  }
  if (names.has("description")) {
    return { header: label("description"), keys: ["description"], truncate: 80 };
  }
  return null;
}

function buildDetailColumn(spec: ListingDetailSpec): Column<SettingItemLike> {
  return {
    key: "detail",
    header: spec.header,
    cell: (r) => {
      const text = resolveDetailText(r, spec);
      return <span className="font-medium">{text ?? "—"}</span>;
    },
  };
}

function buildNameColumn(): Column<SettingItemLike> {
  return {
    key: "name",
    header: "Name",
    sortValue: (r) => r.name,
    cell: (r) => <span className="text-muted-foreground">{r.name}</span>,
  };
}

export function buildListingPrefixColumns(
  ctx: BuildListingColumnsContext,
): Column<SettingItemLike>[] {
  const detail = resolveListingDetailColumn(ctx.entry.fields);
  const cols: Column<SettingItemLike>[] = [];
  if (detail) cols.push(buildDetailColumn(detail));
  cols.push(buildNameColumn());
  return cols;
}

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
          <DeleteButton onClick={() => onDelete(r)} />
        </RowActions>
      );
    },
  };
}

export function buildListingColumns(ctx: BuildListingColumnsContext): Column<SettingItemLike>[] {
  return [...buildListingPrefixColumns(ctx), buildRowActionsColumn(ctx)];
}
