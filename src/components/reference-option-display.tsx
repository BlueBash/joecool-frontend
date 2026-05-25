import { cn } from "@/lib/utils";
import type { ReferenceOption } from "@/lib/reference";
import {
  referenceBadgeText,
  referenceDisplayText,
  type ReferenceDisplayConfig,
} from "@/lib/reference-display";
import { Pill } from "@/components/pill";

export interface ReferenceOptionDisplayProps {
  option?: ReferenceOption;
  /** Shown when the option is not loaded yet (e.g. edit form hydrate). */
  fallbackLabel?: string;
  displayConfig?: ReferenceDisplayConfig;
  placeholder?: string;
  className?: string;
  /** Compact layout for chips / multi-select tags. */
  compact?: boolean;
}

/** Renders primary label with optional leading badge for reference pickers. */
export function ReferenceOptionDisplay({
  option,
  fallbackLabel,
  displayConfig,
  placeholder,
  className,
  compact,
}: ReferenceOptionDisplayProps) {
  const label = option ? referenceDisplayText(option, displayConfig) : fallbackLabel;
  const badge = option ? referenceBadgeText(option, displayConfig) : undefined;

  if (!label) {
    return (
      <span className={cn("text-muted-foreground truncate", className)}>
        {placeholder ?? ""}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex min-w-0 items-center gap-1.5",
        compact ? "gap-1" : "gap-1.5",
        className,
      )}
    >
      {badge ? (
        <Pill
          variant="neutral"
          className={cn("shrink-0 max-w-[40%] truncate", compact && "h-4 text-[10px] px-1")}
        >
          {badge}
        </Pill>
      ) : null}
      <span className="truncate text-[13px]">{label}</span>
    </span>
  );
}
