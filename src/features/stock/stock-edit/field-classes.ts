export const STOCK_FIELD_CLASS = {
  TXT: "h-8 text-[13px]",
  NUM: "h-8 tabular-nums text-[13px]",
  MONO: "h-8 font-mono text-[13px]",
  /** Read-only value row (matches `DateField` readOnly styling). */
  READONLY:
    "flex h-8 w-full items-center rounded-md border border-input bg-muted/40 px-3 text-[13px]",
} as const;
