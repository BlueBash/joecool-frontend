import { useCallback, useState } from "react";
import { toast } from "sonner";
import { stocks } from "@/api/stocks";
import type { ApiError } from "@/api/_client";
import type { StockFormValues } from "../stock-form-schema";
import {
  buildDimensionMessagePayload,
  buildFittingMessagePayload,
  type StockSettingsMessageKind,
  validateDimensionMessageForm,
  validateFittingMessageForm,
} from "./stock-settings-message";

export interface StockSettingsMessageModalState {
  open: boolean;
  kind: StockSettingsMessageKind | null;
  loading: boolean;
  retail: string;
  wholesale: string;
}

const CLOSED: StockSettingsMessageModalState = {
  open: false,
  kind: null,
  loading: false,
  retail: "",
  wholesale: "",
};

function apiErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as ApiError).message);
  }
  return "Failed to load message";
}

export function useStockSettingsMessages(getValues: () => StockFormValues) {
  const [modal, setModal] = useState<StockSettingsMessageModalState>(CLOSED);

  const closeModal = useCallback(() => setModal(CLOSED), []);

  const loadMessages = useCallback(
    async (kind: StockSettingsMessageKind) => {
      const values = getValues();
      const validation =
        kind === "fitting" ? validateFittingMessageForm(values) : validateDimensionMessageForm(values);
      if (validation) {
        toast.error(validation);
        return;
      }

      setModal({ open: true, kind, loading: true, retail: "", wholesale: "" });

      try {
        const build =
          kind === "fitting" ? buildFittingMessagePayload : buildDimensionMessagePayload;
        const fetch =
          kind === "fitting" ? stocks.api.fittingMessage : stocks.api.dimensionsMessage;

        const [retail, wholesale] = await Promise.all([
          fetch(build(values, "retail")),
          fetch(build(values, "wholesale")),
        ]);

        setModal({ open: true, kind, loading: false, retail, wholesale });
      } catch (err) {
        toast.error(apiErrorMessage(err));
        setModal(CLOSED);
      }
    },
    [getValues],
  );

  const openFittingMessages = useCallback(() => void loadMessages("fitting"), [loadMessages]);
  const openDimensionMessages = useCallback(
    () => void loadMessages("dimension"),
    [loadMessages],
  );

  return {
    modal,
    closeModal,
    openFittingMessages,
    openDimensionMessages,
  };
}
