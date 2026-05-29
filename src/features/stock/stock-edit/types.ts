export type StockEditMakeupTabProps = {
  onGenerateBarcodes: () => void | Promise<void>;
  resetSeed?: string;
  /** Route is not `/stock/new` — checkbox composition skips edited title. */
  isStockCreated?: boolean;
};
