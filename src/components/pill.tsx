import { cn } from "@/lib/utils";

const variants = {
  neutral:  "bg-muted text-muted-foreground border-border",
  success:  "bg-success/10 text-success border-success/20",
  warning:  "bg-warning/15 text-warning-foreground border-warning/30",
  danger:   "bg-destructive/10 text-destructive border-destructive/20",
  info:     "bg-info/10 text-info border-info/20",
  primary:  "bg-primary/10 text-primary border-primary/20",
} as const;

type PillVariant = keyof typeof variants;

interface PillProps {
  children: React.ReactNode;
  variant?: PillVariant;
  className?: string;
}

export function Pill({
  children, variant = "neutral", className,
}: PillProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-1.5 h-5 rounded text-[11px] font-medium border tabular-nums",
      variants[variant],
      className,
    )}>
      {children}
    </span>
  );
}
