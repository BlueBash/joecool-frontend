import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type KpiIcon = ComponentType<{ className?: string }>;

type KpiDelta = { value: string; positive: boolean };

type KpiAccent = "primary" | "info" | "success" | "warning";

interface KpiTileProps {
  label: string;
  value: string;
  delta?: KpiDelta;
  icon?: KpiIcon;
  accent?: KpiAccent;
}

export function KpiTile({
  label, value, delta, icon: Icon, accent,
}: KpiTileProps) {
  const accentMap = {
    primary: "text-primary",
    info: "text-info",
    success: "text-success",
    warning: "text-warning-foreground",
  } as const;
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
      {Icon && (
        <div className={cn("h-8 w-8 rounded-md bg-muted grid place-items-center", accent && accentMap[accent])}>
          <Icon className="h-4 w-4" />
        </div>
      )}
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="flex items-baseline gap-2">
          <div className="text-base font-semibold tabular-nums truncate">{value}</div>
          {delta && (
            <span className={cn(
              "inline-flex items-center text-[11px] font-medium tabular-nums",
              delta.positive ? "text-success" : "text-destructive",
            )}>
              {delta.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {delta.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
