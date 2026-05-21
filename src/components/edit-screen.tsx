import { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CopyableCode } from "./app-shell";

interface EditScreenProps {
  backTo: string;
  backLabel?: string;
  title: string;
  subtitle?: ReactNode;
  badges?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  itemCode?: string;
}

export function EditScreen({
  backTo,
  backLabel = "Back",
  title,
  subtitle,
  itemCode,
  badges,
  actions,
  children,
}: EditScreenProps) {
  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-3 pb-3 border-b border-border bg-background sticky top-0 z-10">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1 text-[12.5px] text-muted-foreground hover:text-foreground mb-1.5"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> {backLabel}
        </Link>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-semibold tracking-tight truncate">{title}</h1>
              {badges}
              {itemCode && (
                <div className="text-[13px] text-muted-foreground mt-0.5 cursor-pointer">
                  <CopyableCode value={itemCode} />
                </div>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
      <div className="flex-1 px-5 py-4 w-full">{children}</div>
    </div>
  );
}

interface EditCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function EditCard({ title, description, children, footer }: EditCardProps) {
  return (
    <section className="rounded-lg border border-border bg-card mb-4">
      <header className="px-4 pt-3 pb-2 border-b border-border">
        <h2 className="text-[13px] font-semibold tracking-tight">{title}</h2>
        {description && <p className="text-[12px] text-muted-foreground mt-0.5">{description}</p>}
      </header>
      <div className="p-4">{children}</div>
      {footer && (
        <div className="px-4 py-2.5 border-t border-border bg-muted/30 rounded-b-lg">{footer}</div>
      )}
    </section>
  );
}
