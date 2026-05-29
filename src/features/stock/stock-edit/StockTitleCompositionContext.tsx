import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import type { StockFormValues } from "../stock-form-schema";
import { useStockTitleComposition } from "./useStockTitleComposition";

type StockTitleCompositionContextValue = ReturnType<typeof useStockTitleComposition>;

const StockTitleCompositionContext = createContext<StockTitleCompositionContextValue | null>(null);

export function StockTitleCompositionProvider({
  children,
  resetSeed,
  isStockCreated = false,
}: {
  children: ReactNode;
  resetSeed?: string;
  /** Persisted stock — checkbox composition updates generated title only. */
  isStockCreated?: boolean;
}) {
  const value = useStockTitleComposition(isStockCreated);
  const { resetCompositionTracking, seedFromFormValues, syncShowInTitleFromCatalog } = value;
  const { watch } = useFormContext<StockFormValues>();
  const stockId = watch("id");

  useEffect(() => {
    resetCompositionTracking();
    seedFromFormValues();
    void syncShowInTitleFromCatalog();
  }, [resetSeed, stockId, resetCompositionTracking, seedFromFormValues, syncShowInTitleFromCatalog]);

  return (
    <StockTitleCompositionContext.Provider value={value}>{children}</StockTitleCompositionContext.Provider>
  );
}

export function useStockTitleCompositionContext(): StockTitleCompositionContextValue {
  const ctx = useContext(StockTitleCompositionContext);
  if (!ctx) {
    throw new Error("useStockTitleCompositionContext must be used within StockTitleCompositionProvider");
  }
  return ctx;
}
