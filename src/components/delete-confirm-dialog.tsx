import { AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DELETE_CONFIRM_WORD, type useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { cn } from "@/lib/utils";

type DeleteConfirmState<TMeta = unknown> = ReturnType<typeof useDeleteConfirm<TMeta>>;

interface DeleteConfirmDialogProps<TMeta = unknown> {
  state: DeleteConfirmState<TMeta>;
}

export function DeleteConfirmDialog<TMeta = unknown>({ state }: DeleteConfirmDialogProps<TMeta>) {
  const {
    open,
    request,
    confirmText,
    confirmWord,
    showMismatch,
    isPending,
    canConfirm,
    inputId,
    inputRef,
    close,
    handleOpenChange,
    handleConfirmTextChange,
    handleConfirm,
    focusInput,
  } = state;

  const mismatch =
    showMismatch || (confirmText.length > 0 && confirmText !== confirmWord);

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent
        className="max-w-md gap-0 p-0"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          focusInput();
        }}
      >
        <AlertDialogHeader className="space-y-0 border-b border-border px-5 py-4 text-left">
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"
              aria-hidden
            >
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="min-w-0 space-y-1">
              <AlertDialogTitle>{request?.title ?? "Confirm deletion"}</AlertDialogTitle>
              <AlertDialogDescription className="text-[13px] leading-relaxed">
                {request?.description ??
                  "This action is permanent and cannot be undone. Please review the item below before continuing."}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {request && (
          <div className="space-y-4 px-5 py-4">
            <div className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-[13px]">
              <p className="text-muted-foreground">
                You are about to delete{" "}
                {request.entityType ? (
                  <>
                    the {request.entityType}{" "}
                    <span className="font-medium text-foreground">{request.entityName}</span>
                  </>
                ) : (
                  <span className="font-medium text-foreground">{request.entityName}</span>
                )}
                .
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor={inputId} className="text-[13px]">
                Type <span className="font-mono font-semibold">{confirmWord}</span> to confirm
              </Label>
              <Input
                ref={inputRef}
                id={inputId}
                value={confirmText}
                onChange={(e) => handleConfirmTextChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canConfirm) {
                    e.preventDefault();
                    void handleConfirm();
                  }
                }}
                placeholder={confirmWord}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                disabled={isPending}
                aria-invalid={mismatch}
                aria-describedby={mismatch ? `${inputId}-error` : undefined}
                className={cn(
                  "h-9 text-[13px] font-mono",
                  mismatch && "border-destructive focus-visible:ring-destructive",
                )}
              />
              {mismatch && (
                <p id={`${inputId}-error`} className="text-[12px] text-destructive" role="alert">
                  Type <span className="font-mono font-medium">{confirmWord}</span> exactly to enable
                  delete.
                </p>
              )}
            </div>
          </div>
        )}

        <AlertDialogFooter className="border-t border-border px-5 py-3 sm:justify-end">
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={close} disabled={isPending}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="h-8 min-w-[88px]"
            disabled={!canConfirm}
            aria-busy={isPending}
            onClick={() => void handleConfirm()}
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { DELETE_CONFIRM_WORD };
