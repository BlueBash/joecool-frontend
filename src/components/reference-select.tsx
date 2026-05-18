import { useEffect, useId, useMemo, useState } from "react";
import { ChevronDown, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReferenceOptions } from "@/hooks/use-reference-options";
import { referenceLabel, type ReferenceOption } from "@/lib/reference";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";

export interface ReferenceSelectProps {
  klass: string;
  value: string | number | null | undefined;
  /** Shown when `value` is set but the option is not in the current result list. */
  displayLabel?: string;
  onChange: (id: string | number | null, option?: ReferenceOption) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  allowClear?: boolean;
}

export function ReferenceSelect({
  klass,
  value,
  displayLabel,
  onChange,
  placeholder = "Search…",
  disabled,
  className,
  inputClassName,
  allowClear = true,
}: ReferenceSelectProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { options, isLoading, isError } = useReferenceOptions({
    klass,
    search,
    enabled: open && !disabled,
  });

  const selectedFromList = useMemo(
    () => options.find((o) => String(o.id) === String(value ?? "")),
    [options, value],
  );

  const inputValue = open
    ? search
    : (selectedFromList ? referenceLabel(selectedFromList) : displayLabel ?? "");

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const pick = (opt: ReferenceOption) => {
    onChange(opt.id, opt);
    setOpen(false);
    setSearch("");
  };

  const clear = () => {
    onChange(null);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className={cn("relative", className)}>
          <Input
            value={inputValue}
            onChange={(e) => {
              setSearch(e.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn("h-8 text-[13px] pr-14", inputClassName)}
            aria-expanded={open}
            aria-controls={listId}
            autoComplete="off"
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
            {allowClear && value != null && value !== "" && !disabled && (
              <button
                type="button"
                className="p-1 rounded hover:bg-accent text-muted-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  clear();
                }}
                aria-label="Clear"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              className="p-1 rounded hover:bg-accent text-muted-foreground"
              onClick={() => setOpen((v) => !v)}
              disabled={disabled}
              aria-label="Toggle options"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </PopoverAnchor>
      <PopoverContent
        id={listId}
        className="w-[var(--radix-popover-trigger-width)] p-1 max-h-56 overflow-y-auto"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {isError && (
          <p className="px-2 py-1.5 text-[12px] text-destructive">Could not load options</p>
        )}
        {!isError && options.length === 0 && !isLoading && (
          <p className="px-2 py-1.5 text-[12px] text-muted-foreground">No matches</p>
        )}
        {options.map((opt) => (
          <button
            key={String(opt.id)}
            type="button"
            className={cn(
              "w-full text-left px-2 py-1.5 rounded text-[13px] hover:bg-accent",
              String(opt.id) === String(value ?? "") && "bg-accent font-medium",
            )}
            onClick={() => pick(opt)}
          >
            {referenceLabel(opt)}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
