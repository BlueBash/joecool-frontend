import type { ReferenceOption } from "@/lib/reference";
import type { StockItem, StockMaterialRowUpdate } from "@/lib/types";

export type { StockItem, StockMaterialRowUpdate };

export type StockEditTabProps = {
  draft: StockItem;
  set: <K extends keyof StockItem>(k: K, v: StockItem[K]) => void;
  bindRef: (
    idKey: keyof StockItem,
    labelKey: keyof StockItem,
  ) => (refValue: string | number | null, opt?: ReferenceOption) => void;
};

export type StockEditMakeupTabProps = StockEditTabProps & {
  materials: NonNullable<StockItem["materials"]>;
  setMaterial: (idx: number, patch: StockMaterialRowUpdate) => void;
  addMaterial: () => void;
  removeMaterial: (idx: number) => void;
  onGenerateBarcodes: () => void | Promise<void>;
};

export type StockEditFlagsTabProps = StockEditTabProps & {
  setFlag: (code: string, v: boolean) => void;
};

export type StockEditImagesTabProps = {
  existingImages: string[];
  pendingImages: string[];
  onPendingChange: (images: string[]) => void;
};
