import type { StockRow, StockWritePayload } from "@/api/stocks";
import type { StockItem, StockMaterialRow } from "@/lib/types";
import { stockFlagCodesFromApi, stockFlagsToApi } from "@/lib/reference";
import { parseStockImages, pendingStockImagesForPayload } from "./stock-images";

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function str(v: unknown, fallback = ""): string {
  if (v == null) return fallback;
  return String(v);
}

function num(v: unknown, fallback = 0): number {
  if (v == null || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function idNum(v: unknown): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function parseMaterials(raw: unknown): StockMaterialRow[] {
  if (!raw || typeof raw !== "object") return [];
  const obj = raw as Record<string, unknown>;
  return Object.entries(obj)
    .filter(([k]) => k.startsWith("material_"))
    .map(([, v]) => ({ material: str(v), composite: 0 }));
}

function deriveStatus(onHand: number, reorderLevel: number): StockItem["status"] {
  if (onHand <= 0) return "out";
  if (onHand < reorderLevel) return "low";
  return "active";
}

function imageHueFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 17) % 360;
  return h;
}

/** Maps a flattened JSON:API stock row into the UI `StockItem` model. */
export function mapRowToStockItem(row: StockRow): StockItem {
  const attrs = asRecord(row);
  const id = str(attrs.id ?? row.id);
  const code = str(attrs.code);
  const title = str(attrs.whlsl_title ?? attrs.edited_title ?? attrs.generated_title ?? row.name);
  const reorderLevel = num(attrs.reorder_lvl_whlsl ?? attrs.reorder_level, 5);
  const onHand = num(
    attrs.free ?? attrs.spare ?? attrs.stock_sls ?? attrs.warehouse_levels ?? attrs.on_hand,
    0,
  );
  const dimensionInfo = asRecord(attrs.dimension_info);
  const fittingInfo = asRecord(attrs.fitting_info);
  const costPrice = asRecord(attrs.cost_price);

  const introDate =
    str(dimensionInfo.intro_date) ||
    str(fittingInfo.intro_date) ||
    str(attrs.intro_date).slice(0, 10) ||
    new Date().toISOString().slice(0, 10);

  return {
    id,
    code,
    title,
    category: str(attrs.category_name ?? attrs.category),
    categoryId: idNum(attrs.category_id),
    onHand,
    reorderLevel,
    color: str(attrs.colour ?? attrs.color, "—"),
    colourId: idNum(attrs.colour_id),
    size: str(attrs.size),
    introDate,
    costPrice: num(costPrice.landed_factr ?? costPrice.calc_ready ?? attrs.cost),
    sellingPrice: num(attrs.sell_gbp ?? attrs.gbp_whlsl),
    supplierCode: str(attrs.suppcode),
    status: deriveStatus(onHand, reorderLevel),
    imageHue: imageHueFromId(id),
    images: parseStockImages(attrs.images),
    flags: [],
    flagCodes: stockFlagCodesFromApi(attrs.flags),
    notes: str(attrs.notes ?? attrs.note),
    editedTitle: str(attrs.edited_title),
    generatedTitle: str(attrs.generated_title),
    toZoho: !!(attrs.flag_zoho ?? (attrs.flags && asRecord(attrs.flags).flag_zoho)),
    categoryCode: str(attrs.category_code),
    colorCode: str(attrs.colour_code ?? attrs.color_code),
    displayCode: str(attrs.display_code),
    displayName: str(attrs.display_name),
    displayId: idNum(attrs.display_id),
    uniqueDescription: str(attrs.uniq_desc),
    packBarcode: str(attrs.pack_barcode),
    retailBarcode: str(attrs.retail_barcode),
    assortment: str(attrs.assortment_name ?? attrs.assortment),
    assortmentId: idNum(attrs.assortment_id),
    collection: str(attrs.collection_name ?? attrs.collection),
    collectionId: idNum(attrs.collection_id),
    selections: str(attrs.selection_name ?? attrs.selection),
    selectionId: idNum(attrs.selection_id),
    packaging: str(attrs.packaging_name ?? attrs.packaging),
    packagingId: idNum(attrs.packaging_id ?? attrs.stock_packaging_id),
    gender: str(attrs.gender_name ?? attrs.gender),
    genderId: idNum(attrs.gender_id),
    units: str(attrs.unit_name ?? attrs.unit),
    unitId: idNum(attrs.unit_id),
    itemTariff: str(attrs.tariff_code_name ?? attrs.tariff_code),
    tariffCodeId: idNum(attrs.tariff_code_id),
    vatRate: str(attrs.vat_rate_code_name ?? attrs.vat_rate_code),
    vatRateCodeId: idNum(attrs.vat_rate_code_id),
    joeOnlineRangeId: idNum(attrs.joe_online_range_id),
    stockBuyerId: idNum(attrs.stock_buyer_id),
    frontLocation: str(attrs.locn_front),
    backLocation: str(attrs.locn_back),
    catalogueLocation: str(attrs.catal_page),
    materials: parseMaterials(attrs.materials),
    wholesaleBlurb: str(attrs.wholesale_blurb),
    consumerBlurb: str(attrs.consumer_blurb),
    seoKeywords: str(attrs.keywords),
    supplierName: str(attrs.suppitem),
    supplierItemCode: str(attrs.suppcode),
    buyer: str(attrs.buyer ?? attrs.stock_buyer_name),
    manufacturerCode: str(attrs.manufcode),
    manufacturerName: str(attrs.manufitem),
    manufacturerCountry: str(attrs.manu_country_of_origin ?? attrs.country_of_origin),
    wholesaleReorderLevel: num(attrs.reorder_lvl_whlsl),
    reorderQty: num(attrs.reorder_qnty),
    wholesaleTopUpTo: num(attrs.topup_to_whlsl),
    packQuantity: num(attrs.pack_qnty),
    weightGm: num(attrs.weight_grams),
    volume: num(attrs.volume_ccs),
    warehouseLevels: num(attrs.warehouse_levels),
    stockAllocated: num(attrs.stock_allocated),
    transit: num(attrs.transit),
    available: num(attrs.available ?? attrs.free),
    free: num(attrs.free),
    spare: num(attrs.spare),
  };
}

/** Builds a create/update payload for `POST/PATCH /stocks`. */
export function stockItemToPayload(item: StockItem): StockWritePayload {
  const payload: StockWritePayload = {
    code: item.code,
    whlsl_title: item.editedTitle ?? item.title,
    generated_title: item.generatedTitle,
    suppcode: item.supplierCode ?? item.supplierItemCode,
    suppitem: item.supplierName,
    manufcode: item.manufacturerCode,
    manufitem: item.manufacturerName,
    pack_qnty: item.packQuantity,
    pack_barcode: item.packBarcode,
    retail_barcode: item.retailBarcode,
    reorder_lvl_whlsl: item.wholesaleReorderLevel ?? item.reorderLevel,
    topup_to_whlsl: item.wholesaleTopUpTo,
    reorder_qnty: item.reorderQty,
    locn_front: item.frontLocation,
    locn_back: item.backLocation,
    catal_page: item.catalogueLocation,
    keywords: item.seoKeywords,
    weight_grams: item.weightGm,
    volume_ccs: item.volume,
    country_of_origin: item.manufacturerCountry,
    uniq_desc: item.uniqueDescription || undefined,
    category_id: item.categoryId,
    colour_id: item.colourId,
    assortment_id: item.assortmentId,
    collection_id: item.collectionId,
    selection_id: item.selectionId,
    gender_id: item.genderId,
    unit_id: item.unitId,
    packaging_id: item.packagingId,
    stock_packaging_id: item.packagingId,
    display_id: item.displayId,
    tariff_code_id: item.tariffCodeId,
    vat_rate_code_id: item.vatRateCodeId,
    joe_online_range_id: item.joeOnlineRangeId,
    stock_buyer_id: item.stockBuyerId,
  };

  const flags = stockFlagsToApi(item.flagCodes);
  if (flags) payload.flags = flags;
  if (item.toZoho != null) {
    payload.flags = { ...(payload.flags as Record<string, boolean> | undefined), flag_zoho: !!item.toZoho };
  }

  if (item.materials?.length) {
    const materials: Record<string, string> = {};
    item.materials.forEach((m, i) => {
      if (m.material) materials[`material_${i + 1}`] = m.material;
    });
    payload.materials = materials;
  }

  const blurbs: Record<string, unknown>[] = [];
  if (item.wholesaleBlurb) blurbs.push({ blurb_type: 0, blurb: item.wholesaleBlurb });
  if (item.consumerBlurb) blurbs.push({ blurb_type: 1, blurb: item.consumerBlurb });
  if (blurbs.length) payload.blurbs_attributes = blurbs;

  if (item.notes?.trim()) {
    payload.notes_attributes = [{ note_type: 0, note: item.notes }];
  }

  if (item.introDate) {
    payload.dimension_info_attributes = {
      intro_date: item.introDate,
    };
    payload.fitting_info_attributes = {
      intro_date: item.introDate,
    };
  }

  const pendingImages = pendingStockImagesForPayload(item.pendingImages);
  if (pendingImages) payload.images = pendingImages;

  return payload;
}

export function filterStocksLocally(items: StockItem[], search: string): StockItem[] {
  const q = search.trim().toLowerCase();
  if (!q) return items;
  return items.filter((s) =>
    [s.code, s.title, s.color, s.category].some((v) => v?.toLowerCase().includes(q)),
  );
}
