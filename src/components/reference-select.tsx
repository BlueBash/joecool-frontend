import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReferenceOptions } from "@/hooks/use-reference-options";
import { referenceLabel, type ReferenceDisplayConfig, type ReferenceOption } from "@/lib/reference";
import { DEFAULT_REFERENCE_DISPLAY } from "@/lib/reference-display";
import { ReferenceOptionDisplay } from "@/components/reference-option-display";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";

export interface ReferenceSelectProps {
  klass: string;
  value: string | number | null | undefined;
  /** Shown when `value` is set but the option is not in the loaded list yet. */
  displayLabel?: string;
  /** Maps API fields to label + optional badge (defaults: name + code). */
  displayConfig?: ReferenceDisplayConfig;
  onChange: (id: string | number | null, option?: ReferenceOption) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  allowClear?: boolean;
}

function hasReferenceValue(value: string | number | null | undefined): boolean {
  return value != null && value !== "";
}

export function ReferenceSelect({
  klass,
  value,
  displayLabel,
  displayConfig = DEFAULT_REFERENCE_DISPLAY,
  onChange,
  placeholder = "Search…",
  disabled,
  className,
  inputClassName,
  allowClear = true,
}: ReferenceSelectProps) {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typedSinceOpen, setTypedSinceOpen] = useState(false);
  const [lastSelected, setLastSelected] = useState<ReferenceOption | undefined>();

  const valueSet = hasReferenceValue(value);
  const shouldLoadOptions = !disabled && (open || valueSet);
  const listSearch = open ? search : "";

  const { options, isLoading, isFetching, isError } = useReferenceOptions({
    klass,
    search: listSearch,
    enabled: shouldLoadOptions,
    displayConfig,
  });

  const selectedOption = useMemo(() => {
    const fromList = options.find((o) => String(o.id) === String(value ?? ""));
    if (fromList) return fromList;
    if (lastSelected && String(lastSelected.id) === String(value ?? "")) return lastSelected;
    return undefined;
  }, [options, value, lastSelected]);

  useEffect(() => {
    if (!valueSet) setLastSelected(undefined);
    else if (lastSelected && String(lastSelected.id) !== String(value ?? "")) {
      setLastSelected(undefined);
    }
  }, [value, valueSet, lastSelected]);

  const effectiveDisplayLabel = valueSet ? displayLabel : undefined;

  const closedDisplayText = useMemo(() => {
    if (!valueSet) return "";
    if (selectedOption) return referenceLabel(selectedOption, displayConfig);
    return effectiveDisplayLabel ?? "";
  }, [selectedOption, effectiveDisplayLabel, displayConfig, valueSet]);

  const inputValue =
    open && typedSinceOpen ? search : closedDisplayText;

  const resetSearchState = useCallback(() => {
    setSearch("");
    setTypedSinceOpen(false);
  }, []);

  useEffect(() => {
    if (!open) resetSearchState();
  }, [open, resetSearchState]);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) resetSearchState();
  }, [resetSearchState]);

  useEffect(() => {
    if (!open) return;
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    el.select();
  }, [open]);

  const pick = (opt: ReferenceOption) => {
    setLastSelected(opt);
    onChange(opt.id, opt);
    handleOpenChange(false);
  };

  const clear = () => {
    setLastSelected(undefined);
    onChange(null);
    resetSearchState();
  };

  const showListLoading = open && (isLoading || isFetching) && options.length === 0;
  const showNoMatches =
    open &&
    !isError &&
    !showListLoading &&
    options.length === 0 &&
    typedSinceOpen &&
    search.trim().length > 0;

  const closedTriggerClass = cn(
    "flex h-8 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 pr-14 text-left text-[13px] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
    inputClassName,
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverAnchor asChild>
        <div className={cn("relative", className)}>
          {open ? (
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => {
                const next = e.target.value;
                if (!typedSinceOpen && next === closedDisplayText) return;
                setTypedSinceOpen(true);
                setSearch(next);
              }}
              onKeyDown={(e) => {
                if (typedSinceOpen) return;
                if (
                  e.key === "Backspace" ||
                  e.key === "Delete" ||
                  (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey)
                ) {
                  setTypedSinceOpen(true);
                }
              }}
              placeholder={placeholder}
              disabled={disabled}
              className={cn("h-8 pr-14 text-[13px]", inputClassName)}
              aria-expanded={open}
              aria-controls={listId}
              autoComplete="off"
            />
          ) : (
            <button
              type="button"
              disabled={disabled}
              className={closedTriggerClass}
              onClick={() => !disabled && handleOpenChange(true)}
              aria-expanded={open}
              aria-controls={listId}
            >
              <ReferenceOptionDisplay
                option={selectedOption}
                fallbackLabel={effectiveDisplayLabel}
                displayConfig={displayConfig}
                placeholder={placeholder}
                className="min-w-0 flex-1"
              />
            </button>
          )}
          <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
            {open && isFetching && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground pointer-events-none" />
            )}
            {allowClear && valueSet && !disabled && (
              <button
                type="button"
                className="rounded p-1 text-muted-foreground hover:bg-accent"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  clear();
                }}
                aria-label="Clear"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              className="rounded p-1 text-muted-foreground hover:bg-accent"
              onClick={() => handleOpenChange(!open)}
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
        className="max-h-56 w-[var(--radix-popover-trigger-width)] overflow-y-auto p-1"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {isError && (
          <p className="px-2 py-1.5 text-[12px] text-destructive">Could not load options</p>
        )}
        {showListLoading && (
          <p className="flex items-center gap-1.5 px-2 py-1.5 text-[12px] text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Loading…
          </p>
        )}
        {showNoMatches && (
          <p className="px-2 py-1.5 text-[12px] text-muted-foreground">No matches</p>
        )}
        {options.map((opt) => (
          <button
            key={String(opt.id)}
            type="button"
            className={cn(
              "w-full rounded px-2 py-1.5 text-left hover:bg-accent",
              String(opt.id) === String(value ?? "") && "bg-accent font-medium",
            )}
            onClick={() => pick(opt)}
          >
            <ReferenceOptionDisplay option={opt} displayConfig={displayConfig} />
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
