import type { ReactNode } from "react";
import { useFormContext, type FieldPath } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { StockFormValues } from "../../stock-form-schema";
import { costCalcFormula } from "./cost-calc-formulas";

function formatCalcDisplay(value: unknown, decimals: number): string {
  if (value === "" || value === null || value === undefined) return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return n.toFixed(decimals);
}

/** Three-column cost flow row (inputs + calculated values). */
export function CostFlowRow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md border border-border/70 bg-muted/15 px-3 py-2.5",
        className,
      )}
    >
      <div className="grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-3 sm:items-end">
        {children}
      </div>
    </div>
  );
}

/** Calculated value cell for use inside `CostFlowRow`. */
export function CostCalcResultField({
  name,
  label,
  decimals = 4,
  formula,
  className,
}: {
  name: FieldPath<StockFormValues>;
  label: string;
  decimals?: number;
  formula?: string;
  className?: string;
}) {
  const { watch } = useFormContext<StockFormValues>();
  const display = formatCalcDisplay(watch(name), decimals);
  const formulaText = costCalcFormula(name, formula);

  return (
    <div
      className={cn(
        "flex min-h-8 flex-col justify-center rounded-md border border-border bg-background",
        "px-2.5 py-1.5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[12px] font-medium leading-tight text-foreground/90">{label}</span>
        <span
          className="shrink-0 text-[14px] font-semibold tabular-nums leading-none text-foreground"
          aria-live="polite"
        >
          {display || "—"}
        </span>
      </div>
      {formulaText ? (
        <p
          className="mt-0.5 text-right text-[10px] leading-snug text-muted-foreground"
          title={`${label} = ${formulaText}`}
        >
          ({formulaText})
        </p>
      ) : null}
    </div>
  );
}
