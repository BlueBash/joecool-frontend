import { STOCK_CREATE_DEFAULT_FLAGS } from "@/lib/reference";
import type { StockItem } from "@/lib/types";

export function blankStock(): StockItem {
  return {
    id: `s_${Date.now()}`,
    code: "",
    title: "",
    category: "",
    onHand: 0,
    reorderLevel: 5,
    color: "",
    introDate: new Date().toISOString().slice(0, 10),
    costPrice: 0,
    sellingPrice: 0,
    status: "active",
    imageHue: Math.floor(Math.random() * 360),
    flags: [],
    flagCodes: { ...STOCK_CREATE_DEFAULT_FLAGS },
    frontLocation: "A",
    backLocation: "A",
  };
}

export function refId(v: string | number | null): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
