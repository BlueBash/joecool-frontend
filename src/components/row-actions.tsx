import { Pencil, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface RowActionsProps {
  children: React.ReactNode;
}

export function RowActions({ children }: RowActionsProps) {
  return (
    <div className="inline-flex items-center gap-0.5 justify-end" onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  );
}

interface EditLinkProps {
  to: string;
  params?: Record<string, string>;
  title?: string;
  className?: string;
}

export function EditLink({
  to, params, title = "Edit", className,
}: EditLinkProps) {
  return (
    <Link
      to={to as never}
      params={params as never}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors",
        className,
      )}
      title={title}
      aria-label={title}
      onClick={(e) => e.stopPropagation()}
    >
      <Pencil className="h-3.5 w-3.5" />
    </Link>
  );
}

interface DeleteButtonProps {
  onClick: () => void;
  title?: string;
}

export function DeleteButton({
  onClick, title = "Delete",
}: DeleteButtonProps) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
      title={title}
      aria-label={title}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
