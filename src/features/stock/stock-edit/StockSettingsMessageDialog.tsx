import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { StockSettingsMessageKind } from "./stock-settings-message";

export interface StockSettingsMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: StockSettingsMessageKind | null;
  loading: boolean;
  retail: string;
  wholesale: string;
}

const TITLES: Record<StockSettingsMessageKind, string> = {
  fitting: "Fitting message",
  dimension: "Dimension message",
};

function MessageBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-[13px] leading-relaxed whitespace-pre-wrap rounded-md border border-border bg-muted/30 px-3 py-2">
        {text || "—"}
      </p>
    </div>
  );
}

export function StockSettingsMessageDialog({
  open,
  onOpenChange,
  kind,
  loading,
  retail,
  wholesale,
}: StockSettingsMessageDialogProps) {
  const title = kind ? TITLES[kind] : "Message";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg gap-0 p-0">
        <AlertDialogHeader className="border-b border-border px-5 py-4 text-left">
          <AlertDialogTitle className="text-base">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-[13px]">
            Generated from current form values for retail and wholesale audiences.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="max-h-[min(60vh,24rem)] overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-[13px] text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading messages…
            </div>
          ) : (
            <div className="space-y-4">
              <MessageBlock label="Retail" text={retail} />
              <MessageBlock label="Wholesale" text={wholesale} />
            </div>
          )}
        </div>

        <AlertDialogFooter className="border-t border-border px-5 py-3">
          <AlertDialogAction type="button">Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
