import { readFieldValue } from "../../../utils";
import { buildListingColumns, buildRowActionsColumn } from "../../../components/listing-columns";
import type { BuildListingColumnsFn, SettingItemLike } from "../../../types";
import { ReactNode } from "react";

export interface SettingDataListProps {
  r: SettingItemLike;
  fieldData: {
    key: string;
    type?: "boolean" | "number";
  };
}

export interface ListingColumn {
  key: string;
  header: string;
  cell: (r: SettingItemLike) => ReactNode;
}

function formatListingCellValue(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "string") return value.trim() ? value : null;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return null;
}

export function settingDataList({ r, fieldData }: SettingDataListProps) {
  const value = readFieldValue(r, fieldData.key);
  if (fieldData.type === "boolean") {
    return <span className="text-muted-foreground">{value ? "Yes" : "No"}</span>;
  }
  const text = formatListingCellValue(value);
  return <span className="text-muted-foreground">{text ?? "—"}</span>;
}

export function col(
  key: string,
  header: string,
  opts?: { type?: "boolean" | "number" },
): ListingColumn {
  return {
    key,
    header,
    cell: (r) => settingDataList({ r, fieldData: { key, type: opts?.type } }),
  };
}

export function createBuildSettingListingColumns(
  listingData: Record<string, ListingColumn[]>,
): BuildListingColumnsFn {
  return (ctx) => {
    const key = ctx.entry.listingKey ?? ctx.entry.bodyKey;
    return [
      ...buildListingColumns(ctx, ctx.entry.bodyKey).slice(0, -1),
      ...(listingData[key] ?? []),
      buildRowActionsColumn(ctx),
    ];
  };
}
