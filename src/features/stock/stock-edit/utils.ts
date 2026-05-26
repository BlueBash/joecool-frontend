import { todayApiDate } from "@/lib/dates";
import { stockCreateDefaultFlagCodes } from "@/lib/reference";
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
    introDate: todayApiDate(),
    costPrice: 0,
    sellingPrice: 0,
    status: "active",
    imageHue: Math.floor(Math.random() * 360),
    flags: [],
    flagCodes: stockCreateDefaultFlagCodes(),
    frontLocation: "A",
    backLocation: "A",
    materials: [],
    ranges: [],
    pendingImages: [],
  };
}

export function refId(v: string | number | null): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
