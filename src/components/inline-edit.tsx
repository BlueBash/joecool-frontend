import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface CommonInlineProps {
  className?: string;
  cellClassName?: string;
}

type SaveStringHandler = (value: string) => void;

interface InlineTextProps extends CommonInlineProps {
  value: string;
  onSave: SaveStringHandler;
  placeholder?: string;
}

export function InlineText({
  value, onSave, placeholder, className, cellClassName,
}: InlineTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) ref.current?.select(); }, [editing]);
  useEffect(() => { setDraft(value); }, [value]);

  if (!editing) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); setEditing(true); }}
        className={cn(
          "text-left w-full truncate hover:bg-accent/60 rounded px-1.5 py-0.5 -mx-1.5 -my-0.5 cursor-text",
          !value && "text-muted-foreground italic",
          cellClassName,
        )}
      >
        {value || placeholder || "—"}
      </button>
    );
  }
  return (
    <input
      ref={ref}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      onBlur={() => { onSave(draft); setEditing(false); }}
      onKeyDown={(e) => {
        if (e.key === "Enter") { onSave(draft); setEditing(false); }
        if (e.key === "Escape") { setDraft(value); setEditing(false); }
      }}
      className={cn(
        "w-full h-7 px-1.5 rounded border border-ring bg-background text-[13px] outline-none",
        className,
      )}
    />
  );
}

type SaveNumberHandler = (value: number) => void;

interface InlineNumberProps extends CommonInlineProps {
  value: number;
  onSave: SaveNumberHandler;
  suffix?: string;
}

export function InlineNumber({
  value, onSave, className, cellClassName, suffix,
}: InlineNumberProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing) ref.current?.select(); }, [editing]);
  useEffect(() => { setDraft(String(value)); }, [value]);

  if (!editing) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); setEditing(true); }}
        className={cn(
          "text-right tabular-nums w-full hover:bg-accent/60 rounded px-1.5 py-0.5 -mx-1.5 -my-0.5 cursor-text",
          cellClassName,
        )}
      >
        {value}{suffix ?? ""}
      </button>
    );
  }
  return (
    <input
      ref={ref}
      type="number"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      onBlur={() => { onSave(Number(draft) || 0); setEditing(false); }}
      onKeyDown={(e) => {
        if (e.key === "Enter") { onSave(Number(draft) || 0); setEditing(false); }
        if (e.key === "Escape") { setDraft(String(value)); setEditing(false); }
      }}
      className={cn(
        "w-full h-7 px-1.5 rounded border border-ring bg-background text-[13px] text-right tabular-nums outline-none",
        className,
      )}
    />
  );
}

interface InlineSelectProps<T extends string> extends CommonInlineProps {
  value: T;
  options: readonly T[];
  onSave: (value: T) => void;
}

export function InlineSelect<T extends string>({
  value, options, onSave, className, cellClassName,
}: InlineSelectProps<T>) {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLSelectElement>(null);
  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  if (!editing) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); setEditing(true); }}
        className={cn(
          "text-left w-full truncate hover:bg-accent/60 rounded px-1.5 py-0.5 -mx-1.5 -my-0.5 cursor-pointer",
          cellClassName,
        )}
      >
        {value}
      </button>
    );
  }
  return (
    <select
      ref={ref}
      value={value}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => { onSave(e.target.value as T); setEditing(false); }}
      onBlur={() => setEditing(false)}
      className={cn("w-full h-7 px-1 rounded border border-ring bg-background text-[13px] outline-none", className)}
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

interface SaveBadgeProps {
  saved: boolean | null;
}

export function SaveBadge({ saved }: SaveBadgeProps) {
  if (saved === null) return null;
  return saved
    ? <span className="inline-flex items-center gap-1 text-[11px] text-success"><Check className="h-3 w-3" /> Saved</span>
    : <span className="inline-flex items-center gap-1 text-[11px] text-destructive"><X className="h-3 w-3" /> Failed</span>;
}
