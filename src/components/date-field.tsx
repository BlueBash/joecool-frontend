import { memo, useCallback, useEffect, useId, useRef, useState } from "react";
import { Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DATE_DISPLAY_PLACEHOLDER,
  formatApiDateForDisplay,
  parseApiDate,
  parseDisplayDate,
  partsToApiDate,
  type DateParts,
} from "@/lib/dates";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function startWeekday(year: number, month: number): number {
  const d = new Date(year, month - 1, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

type DateCalendarProps = {
  view: DateParts;
  selected: DateParts | null;
  onSelect: (parts: DateParts) => void;
  onViewChange: (view: DateParts) => void;
};

function DateCalendar({ view, selected, onSelect, onViewChange }: DateCalendarProps) {
  const total = daysInMonth(view.year, view.month);
  const start = startWeekday(view.year, view.month);
  const cells: (number | null)[] = [
    ...Array.from({ length: start }, () => null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = new Date(view.year, view.month - 1, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const shiftMonth = (delta: number) => {
    let m = view.month + delta;
    let y = view.year;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    onViewChange({ year: y, month: m, day: Math.min(view.day, daysInMonth(y, m)) });
  };

  const isSelected = (day: number) =>
    selected != null &&
    selected.year === view.year &&
    selected.month === view.month &&
    selected.day === day;

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === view.year &&
    today.getMonth() + 1 === view.month &&
    today.getDate() === day;

  return (
    <div className="w-[260px] select-none">
      <div className="flex items-center justify-between mb-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          aria-label="Previous month"
          onClick={() => shiftMonth(-1)}
        >
          ‹
        </Button>
        <span className="text-[13px] font-medium">{monthLabel}</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          aria-label="Next month"
          onClick={() => shiftMonth(1)}
        >
          ›
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[11px] text-muted-foreground mb-1">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1 font-medium">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) =>
          day == null ? (
            <span key={`e-${i}`} />
          ) : (
            <button
              key={day}
              type="button"
              onClick={() => onSelect({ year: view.year, month: view.month, day })}
              className={cn(
                "h-8 w-8 mx-auto rounded-md text-[13px] transition-colors",
                "hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                isSelected(day) && "bg-primary text-primary-foreground hover:bg-primary/90",
                !isSelected(day) && isToday(day) && "border border-primary/40 font-medium",
              )}
            >
              {day}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

export interface DateFieldProps {
  /** Form/API value: YYYY-MM-DD or empty. */
  value?: string | null;
  onChange?: (value: string | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  id?: string;
  name?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

function DateFieldInner({
  value,
  onChange,
  onBlur,
  disabled,
  readOnly,
  placeholder = DATE_DISPLAY_PLACEHOLDER,
  className,
  inputClassName,
  id: idProp,
  name,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: DateFieldProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(() => formatApiDateForDisplay(value));
  const inputRef = useRef<HTMLInputElement>(null);

  const apiValue = value?.trim() ? value.trim() : null;
  const selected = parseApiDate(apiValue);

  const [view, setView] = useState<DateParts>(() => {
    if (selected) return { ...selected };
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  });

  useEffect(() => {
    setText(formatApiDateForDisplay(value));
  }, [value]);

  useEffect(() => {
    if (selected) setView({ ...selected });
  }, [apiValue]);

  const commitText = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      onChange?.(null);
      return;
    }
    const parts = parseDisplayDate(trimmed);
    if (parts) {
      onChange?.(partsToApiDate(parts));
      setText(formatApiDateForDisplay(partsToApiDate(parts)));
    } else {
      setText(formatApiDateForDisplay(value));
    }
  }, [onChange, text, value]);

  const selectDate = (parts: DateParts) => {
    const api = partsToApiDate(parts);
    onChange?.(api);
    setText(formatApiDateForDisplay(api));
    setOpen(false);
    onBlur?.();
  };

  const clear = () => {
    onChange?.(null);
    setText("");
    onBlur?.();
  };

  if (readOnly) {
    return (
      <div
        className={cn(
          "flex h-8 w-full items-center rounded-md border border-input bg-muted/40 px-3 text-[13px] tabular-nums",
          className,
        )}
      >
        {formatApiDateForDisplay(value) || "—"}
      </div>
    );
  }

  return (
    <div className={cn("relative flex items-center gap-1", className)}>
      <Input
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        value={text}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        className={cn("h-8 pr-16 text-[13px] tabular-nums", inputClassName)}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          commitText();
          onBlur?.();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commitText();
            inputRef.current?.blur();
          }
        }}
      />
      <div className="absolute right-1 flex items-center gap-0.5">
        {text && !disabled && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            aria-label="Clear date"
            tabIndex={-1}
            onClick={clear}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              disabled={disabled}
              aria-label="Open calendar"
            >
              <Calendar className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="end">
            <DateCalendar
              view={view}
              selected={selected}
              onSelect={selectDate}
              onViewChange={setView}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export const DateField = memo(DateFieldInner);

export interface DateRangeFieldProps {
  from?: string | null;
  to?: string | null;
  onFromChange?: (value: string | null) => void;
  onToChange?: (value: string | null) => void;
  disabled?: boolean;
  className?: string;
  fromLabel?: string;
  toLabel?: string;
}

/** Standalone date range (filters, reports). */
export function DateRangeField({
  from,
  to,
  onFromChange,
  onToChange,
  disabled,
  className,
  fromLabel = "From",
  toLabel = "To",
}: DateRangeFieldProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-[12px] text-muted-foreground">{fromLabel}</span>
      <DateField
        value={from}
        onChange={onFromChange}
        disabled={disabled}
        className="w-36"
      />
      <span className="text-[12px] text-muted-foreground">{toLabel}</span>
      <DateField value={to} onChange={onToChange} disabled={disabled} className="w-36" />
    </div>
  );
}
