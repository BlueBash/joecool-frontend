import { useCallback, useId, useRef, useState } from "react";

export const DELETE_CONFIRM_WORD = "delete" as const;

export type DeleteConfirmRequest<TMeta = void> = {
  title: string;
  /** Human-readable name of the record being deleted (shown in the modal). */
  entityName: string;
  /** Optional noun, e.g. "stock item", "operator". */
  entityType?: string;
  description?: string;
  meta: TMeta;
};

export type UseDeleteConfirmOptions<TMeta> = {
  onConfirm: (meta: TMeta) => void | Promise<void>;
  confirmWord?: string;
};

export function useDeleteConfirm<TMeta = void>({
  onConfirm,
  confirmWord = DELETE_CONFIRM_WORD,
}: UseDeleteConfirmOptions<TMeta>) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState<DeleteConfirmRequest<TMeta> | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [showMismatch, setShowMismatch] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const isMatch = confirmText === confirmWord;
  const canConfirm = isMatch && !isPending;

  const reset = useCallback(() => {
    setConfirmText("");
    setShowMismatch(false);
  }, []);

  const close = useCallback(() => {
    if (isPending) return;
    setOpen(false);
    reset();
    setRequest(null);
  }, [isPending, reset]);

  const requestDelete = useCallback((next: DeleteConfirmRequest<TMeta>) => {
    setRequest(next);
    reset();
    setOpen(true);
  }, [reset]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) close();
      else setOpen(true);
    },
    [close],
  );

  const handleConfirmTextChange = useCallback(
    (value: string) => {
      setConfirmText(value);
      if (showMismatch && value === confirmWord) setShowMismatch(false);
    },
    [confirmWord, showMismatch],
  );

  const handleConfirm = useCallback(async () => {
    if (!request || isPending) return;
    if (!isMatch) {
      setShowMismatch(true);
      inputRef.current?.focus();
      return;
    }

    setIsPending(true);
    try {
      await onConfirm(request.meta);
      setOpen(false);
      reset();
      setRequest(null);
    } finally {
      setIsPending(false);
    }
  }, [confirmWord, isMatch, isPending, onConfirm, request, reset]);

  const focusInput = useCallback(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  return {
    open,
    request,
    confirmText,
    confirmWord,
    showMismatch,
    isPending,
    canConfirm,
    inputId,
    inputRef,
    requestDelete,
    close,
    handleOpenChange,
    handleConfirmTextChange,
    handleConfirm,
    focusInput,
  };
}
