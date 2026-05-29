import type { StockRow, StockWritePayload } from "@/api/stocks";
import { todayApiDate } from "@/lib/dates";
import type { StockItem, StockMaterialRow, StockRangeRow } from "@/lib/types";
import { stockFlagCodesFromApi, stockFlagsToApi, type ReferenceOption } from "@/lib/reference";
import { referenceLabel } from "@/lib/reference-display";
import { parseStockImages, pendingStockImagesForPayload } from "./stock-images";
import {
  buildNoOfDimensionPayload,
  dimensionSlotCountFromNoOfDimension,
  dimensionSpecValuesCount,
  parseNoOfDimension,
  resizeDimensionNoOfDimension,
} from "./stock-edit/dimension-sizes";
import {
  buildFittingNoOfSizesPayload,
  fittingSlotCountFromNoOfSizes,
  fittingSpecValuesCount,
  parseFittingNoOfSizes,
  resizeFittingNoOfSizes,
} from "./stock-edit/fitting-sizes";
import { mapCostPriceToForm } from "./stock-edit/cost/map-cost-price";
import {
  mapSellingPricesToForm,
  parseSellingPricesFromApi,
} from "./stock-edit/selling/map-selling-prices";

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function str(v: unknown, fallback = ""): string {
  if (v == null) return fallback;
  return String(v);
}

function firstNonEmpty(...values: unknown[]): string {
  for (const v of values) {
    const s = str(v);
    if (s.trim()) return s;
  }
  return "";
}

function flatRelationLabel(value: unknown): string {
  if (value == null || typeof value === "object") return "";
  return str(value);
}

/** Label from a hydrated JSON:API relationship or flat `*_name` fields. */
function relationLabel(rel: Record<string, unknown>, ...flat: unknown[]): string {
  return firstNonEmpty(
    rel.name,
    rel.code,
    rel.whlsl_title,
    ...flat.map(flatRelationLabel),
  );
}

/** Label for stock-settings rows (matches `FormReferenceField` / `referenceLabel`). */
function settingsRelationLabel(value: unknown): string {
  if (value == null || typeof value !== "object") return "";
  const rec = value as Record<string, unknown>;
  if (rec.id == null && rec.name == null && rec.code == null) return "";
  return referenceLabel(rec as ReferenceOption);
}

/** FK from denormalized `fitting_info` / `dimension_info` (hydrated rel, `*_id`, or scalar FK). */
function settingsRelationId(info: Record<string, unknown>, relationKey: string): number | undefined {
  const fromFk = idNum(info[`${relationKey}_id`]);
  if (fromFk != null) return fromFk;
  const rel = info[relationKey];
  if (rel != null && typeof rel !== "object") return idNum(rel);
  return idNum(asRecord(rel).id);
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

function optionalNum(v: unknown): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function parseMaterials(raw: unknown): StockMaterialRow[] {
  // New API shape: `materials_attributes` array of material rows.
  if (Array.isArray(raw)) {
    return raw
      .filter((row): row is Record<string, unknown> => !!row && typeof row === "object")
      .map((row) => ({
        materialId: idNum(row.material_id),
        composite: num(row.composite),
        name: str(row.name),
      }));
  }

  // Backward compatibility for legacy `materials.material_N` object payloads.
  if (!raw || typeof raw !== "object") return [];
  const obj = raw as Record<string, unknown>;
  return Object.entries(obj)
    .filter(([k]) => k.startsWith("material_"))
    .map(([, v]) => ({ name: str(v), composite: 0 }));
}

function rangeKeyOrder(key: string): number {
  const m = /^range_(\d+)$/.exec(key);
  return m ? Number(m[1]) : Number.MAX_SAFE_INTEGER;
}

function parseRanges(raw: unknown): StockRangeRow[] {
  if (!raw || typeof raw !== "object") return [];
  const obj = raw as Record<string, unknown>;
  return Object.entries(obj)
    .filter(([k]) => k.startsWith("range_"))
    .sort(([a], [b]) => rangeKeyOrder(a) - rangeKeyOrder(b))
    .map(([, v]) => ({ rangeId: idNum(v), range: "" }));
}

function blurbTypeKey(type: unknown): "wholesale" | "consumer" | null {
  if (type === 0 || type === "0") return "wholesale";
  if (type === 1 || type === "1") return "consumer";
  const s = String(type).toLowerCase();
  if (s.includes("wholesale") || s === "wholesaler") return "wholesale";
  if (s.includes("consumer")) return "consumer";
  return null;
}

function noteTypeKey(type: unknown): "general" | "supplier" | null {
  if (type === 0 || type === "0") return "general";
  if (type === 1 || type === "1") return "supplier";
  const s = String(type).toLowerCase();
  if (s.includes("supplier")) return "supplier";
  if (s.includes("general") || s.includes("stock")) return "general";
  return null;
}

/** Reads `notes` from stock detail include (`note_type` 0 = general, 1 = supplier). */
function parseStockNotes(raw: unknown): { notes: string; supplierNotes: string } {
  const out = { notes: "", supplierNotes: "" };
  if (typeof raw === "string") {
    const text = raw.trim();
    if (text && !text.includes("[object Object]")) out.notes = text;
    return out;
  }
  const rows = Array.isArray(raw) ? raw : raw != null && typeof raw === "object" ? [raw] : [];
  for (const row of rows) {
    if (typeof row === "string") {
      const text = row.trim();
      if (text && !out.notes) out.notes = text;
      continue;
    }
    const n = asRecord(row);
    const text = str(n.note ?? n.notes ?? n.body ?? n.content);
    if (!text.trim()) continue;
    const kind = noteTypeKey(n.note_type);
    if (kind === "supplier") out.supplierNotes = text;
    else if (kind === "general") out.notes = text;
    else if (!out.notes) out.notes = text;
  }
  return out;
}

/** Reads `blurbs` from stock detail include (`blurb_type` 0/1 or wholesale/consumer strings). */
function parseStockBlurbs(raw: unknown): { wholesaleBlurb: string; consumerBlurb: string } {
  const out = { wholesaleBlurb: "", consumerBlurb: "" };
  const rows = Array.isArray(raw) ? raw : raw != null && typeof raw === "object" ? [raw] : [];
  for (const row of rows) {
    const b = asRecord(row);
    const text = str(b.blurb);
    if (!text) continue;
    const kind = blurbTypeKey(b.blurb_type);
    if (kind === "wholesale") out.wholesaleBlurb = text;
    else if (kind === "consumer") out.consumerBlurb = text;
  }
  return out;
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
  const title = firstNonEmpty(
    attrs.whlsl_title,
    attrs.edited_title,
    attrs.generated_title,
    row.name,
  );
  const reorderLevel = num(attrs.reorder_lvl_whlsl ?? attrs.reorder_level, 5);
  const onHand = num(
    attrs.free ?? attrs.spare ?? attrs.stock_sls ?? attrs.warehouse_levels ?? attrs.on_hand,
    0,
  );
  const dimensionInfo = asRecord(attrs.dimension_info);
  const noOfDimension = asRecord(dimensionInfo.no_of_dimension);
  const dimensionNoOfDimension = parseNoOfDimension(dimensionInfo.no_of_dimension);
  const dimensionSpecObj = asRecord(dimensionInfo.dimension_spec);
  const dimensionSpecSlotCountFromSpec = dimensionSpecValuesCount(dimensionSpecObj.values);
  const dimensionDataSlotCount = dimensionSlotCountFromNoOfDimension(noOfDimension);
  const dimensionSpecSlotCount = Math.max(dimensionSpecSlotCountFromSpec, dimensionDataSlotCount);
  const fittingInfo = asRecord(attrs.fitting_info);
  const stockDimension = asRecord(attrs.stock_dimension);
  const costPrice = asRecord(attrs.cost_price);
  const sellingPricesRaw = attrs.selling_prices;
  const costPriceForm = mapCostPriceToForm(costPrice);
  const sellingPriceForm = mapSellingPricesToForm(
    parseSellingPricesFromApi(sellingPricesRaw),
  );
  const display = asRecord(attrs.display);
  const category = asRecord(attrs.category);
  const tariffCode = asRecord(attrs.tariff_code);
  const stockPackagingData = asRecord(attrs.stock_packaging_data);
  const noOfSizes = asRecord(fittingInfo.no_of_sizes);
  const fittingNoOfSizes = parseFittingNoOfSizes(fittingInfo.no_of_sizes);
  const fittingSpecObj = asRecord(fittingInfo.fitting_spec);
  const specSlotCount = fittingSpecValuesCount(fittingSpecObj.values);
  const dataSlotCount = fittingSlotCountFromNoOfSizes(noOfSizes);
  const fittingSpecSlotCount = Math.max(specSlotCount, dataSlotCount);
  const ringSizeRaw = firstNonEmpty(noOfSizes.size_1, attrs.size);
  const ringSizeId = idNum(ringSizeRaw);
  const stockNotes = parseStockNotes(attrs.notes ?? attrs.note);
  const blurbs = parseStockBlurbs(attrs.blurbs);
  const supplierData = asRecord(attrs.supplier_data);

  const introDate =
    str(dimensionInfo.intro_date) ||
    str(fittingInfo.intro_date) ||
    str(attrs.intro_date).slice(0, 10) ||
    todayApiDate();

  return {
    id,
    code,
    title,
    category: relationLabel(category, attrs.category_name, attrs.category),
    categoryId: idNum(attrs.category_id ?? category.id),
    onHand,
    reorderLevel,
    color: str(attrs.colour ?? attrs.color, "—"),
    colourId: idNum(attrs.colour_id),
    ringSizeId,
    size: ringSizeId ? "" : str(ringSizeRaw),
    introDate,
    costPrice: num(costPrice.landed_factr ?? costPrice.calc_ready ?? attrs.cost),
    sellingPrice: num(
      sellingPriceForm.gbpWhlsl ??
        attrs.sell_gbp ??
        attrs.gbp_whlsl,
    ),
    costPriceRaw: costPrice,
    sellingPricesRaw:
      sellingPricesRaw && typeof sellingPricesRaw === "object"
        ? (sellingPricesRaw as Record<string, unknown>)
        : undefined,
    ...costPriceForm,
    ...sellingPriceForm,
    supplierFobX: num(supplierData.fob_factor),
    supplierId: idNum(attrs.suppcode ?? supplierData.id),
    supplier: firstNonEmpty(supplierData.name, supplierData.code),
    supplierCode: str(supplierData.code),
    status: deriveStatus(onHand, reorderLevel),
    imageHue: imageHueFromId(id),
    images: parseStockImages(attrs.images),
    flags: [],
    flagCodes: stockFlagCodesFromApi(attrs.flags),
    notes: stockNotes.notes,
    supplierNotes: stockNotes.supplierNotes,
    editedTitle: str(attrs.edited_title),
    generatedTitle: str(attrs.generated_title),
    toZoho: !!(attrs.flag_zoho ?? (attrs.flags && asRecord(attrs.flags).flag_zoho)),
    categoryCode: str(attrs.category_code),
    colorCode: str(attrs.colour_code ?? attrs.color_code),
    displayCode: str(attrs.display_code ?? display.code),
    displayName: str(attrs.display_name ?? display.name),
    displayId: idNum(attrs.display_id ?? display.id),
    cost: optionalNum(display.cost ?? attrs.display_cost),
    uniqueDescription: str(attrs.uniq_desc),
    packBarcode: str(attrs.pack_barcode),
    retailBarcode: str(attrs.retail_barcode),
    assortment: relationLabel(asRecord(attrs.assortment), attrs.assortment_name, attrs.assortment),
    assortmentId: idNum(attrs.assortment_id),
    collection: relationLabel(asRecord(attrs.collection), attrs.collection_name, attrs.collection),
    collectionId: idNum(attrs.collection_id),
    selections: relationLabel(asRecord(attrs.selection), attrs.selection_name, attrs.selection),
    selectionId: idNum(attrs.selection_id),
    packaging: firstNonEmpty(stockPackagingData.code, attrs.packaging_name),
    packagingId: idNum(attrs.stock_packaging_id ?? stockPackagingData.id),
    gender: relationLabel(asRecord(attrs.gender), attrs.gender_name, attrs.gender),
    genderId: idNum(attrs.gender_id),
    units: relationLabel(asRecord(attrs.unit), attrs.unit_name, attrs.unit),
    unitId: idNum(attrs.unit_id),
    itemTariff: relationLabel(tariffCode, attrs.tariff_code_name, attrs.tariff_code),
    tariffCodeId: idNum(attrs.tariff_code_id ?? tariffCode.id),
    vatRate: relationLabel(asRecord(attrs.vat_rate_code), attrs.vat_rate_code_name, attrs.vat_rate_code),
    vatRateCodeId: idNum(attrs.vat_rate_code_id),
    unchanged: str(attrs.retail_label),
    categoryTariff: str(attrs.category_tarrif ?? category.category_tarrif),
    joeOnlineRangeId: idNum(attrs.joe_online_range_id),
    stockBuyerId: idNum(attrs.stock_buyer_id),
    frontLocation: str(attrs.locn_front),
    backLocation: str(attrs.locn_back),
    catalogueLocation: str(attrs.catal_page),
    materials: parseMaterials(attrs.materials_attributes ?? attrs.materials),
    wholesaleBlurb: firstNonEmpty(blurbs.wholesaleBlurb, attrs.wholesale_blurb),
    consumerBlurb: firstNonEmpty(blurbs.consumerBlurb, attrs.consumer_blurb),
    ranges: parseRanges(attrs.range),
    seoKeywords: str(attrs.keywords),
    supplierName: str(supplierData.name),
    supplierItemCode: str(attrs.suppitem),
    buyer: str(attrs.buyer ?? attrs.stock_buyer_name),
    manufacturerId: idNum(attrs.manufcode),
    manufacturer: str(attrs.manufitem),
    manufacturerName: str(attrs.manufitem),
    manufrItemCode: str(attrs.manufitem),
    manufacturerCountry: str(attrs.manu_country_of_origin ?? attrs.country_of_origin),
    wholesaleReorderLevel: num(attrs.reorder_lvl_whlsl),
    reorderQty: num(attrs.reorder_qnty),
    wholesaleTopUpTo: num(attrs.topup_to_whlsl),
    packQuantity: num(attrs.pack_qnty),
    weightGm: num(attrs.weight_grams),
    volume: num(attrs.volume_ccs),
    length: num(stockDimension.length),
    breadth: num(stockDimension.breadth),
    height: num(stockDimension.height),
    a4PackLabels: num(attrs.barlabqnty),
    fittingPackAssortId: settingsRelationId(fittingInfo, "fitting_assortment"),
    fittingPackAssort: settingsRelationLabel(fittingInfo.fitting_assortment),
    fittingMeasureId: settingsRelationId(fittingInfo, "fitting_measure"),
    fittingMeasure: settingsRelationLabel(fittingInfo.fitting_measure),
    fittingSpecId: settingsRelationId(fittingInfo, "fitting_spec"),
    fittingSpec: settingsRelationLabel(fittingInfo.fitting_spec),
    fittingSpecSlotCount: fittingSpecSlotCount || undefined,
    fittingNoOfSizes:
      fittingSpecSlotCount > 0
        ? resizeFittingNoOfSizes(fittingNoOfSizes, fittingSpecSlotCount)
        : Object.keys(fittingNoOfSizes).length
          ? fittingNoOfSizes
          : undefined,
    dimensionPackId: settingsRelationId(dimensionInfo, "dimension_assortment"),
    dimensionPack: settingsRelationLabel(dimensionInfo.dimension_assortment),
    dimensionMeasureId: settingsRelationId(dimensionInfo, "dimension_measure"),
    dimensionMeasure: settingsRelationLabel(dimensionInfo.dimension_measure),
    dimensionSpecId: settingsRelationId(dimensionInfo, "dimension_spec"),
    dimensionSpec: settingsRelationLabel(dimensionInfo.dimension_spec),
    dimensionSpecSlotCount: dimensionSpecSlotCount || undefined,
    dimensionNoOfDimension:
      dimensionSpecSlotCount > 0
        ? resizeDimensionNoOfDimension(dimensionNoOfDimension, dimensionSpecSlotCount)
        : Object.keys(dimensionNoOfDimension).length
          ? dimensionNoOfDimension
          : undefined,
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
    suppcode:
      item.supplierId != null
        ? String(item.supplierId)
        : item.supplierCode || undefined,
    suppitem: item.supplierItemCode || item.supplierName || undefined,
    manufcode:
      item.manufacturerId != null
        ? String(item.manufacturerId)
        : item.manufacturerCode || undefined,
    manufitem: item.manufrItemCode || item.manufacturerName || undefined,
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
    category_tarrif: item.categoryTariff || undefined,
    category_id: item.categoryId,
    colour_id: item.colourId,
    assortment_id: item.assortmentId,
    collection_id: item.collectionId,
    selection_id: item.selectionId,
    gender_id: item.genderId,
    unit_id: item.unitId,
    stock_packaging_id: item.packagingId,
    retail_label: item.unchanged || undefined,
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
    const materialsAttributes = item.materials
      .filter((m) => m.materialId != null || m.name.trim() !== "")
      .map((m) => ({
        material_id: m.materialId,
        composite: String(m.composite ?? 0),
        name: m.name,
      }));
    if (materialsAttributes.length) payload.materials_attributes = materialsAttributes;
  }

  if (item.ranges?.length) {
    const range: Record<string, string> = {};
    item.ranges.forEach((r, i) => {
      if (r.rangeId != null) range[`range_${i + 1}`] = String(r.rangeId);
    });
    if (Object.keys(range).length) payload.range = range;
  }

  const blurbs: Record<string, unknown>[] = [];
  if (item.wholesaleBlurb) blurbs.push({ blurb_type: 0, blurb: item.wholesaleBlurb });
  if (item.consumerBlurb) blurbs.push({ blurb_type: 1, blurb: item.consumerBlurb });
  if (blurbs.length) payload.blurbs_attributes = blurbs;

  const notesAttributes: Record<string, unknown>[] = [];
  if (item.notes?.trim()) notesAttributes.push({ note_type: 0, note: item.notes });
  if (item.supplierNotes?.trim()) notesAttributes.push({ note_type: 1, note: item.supplierNotes });
  if (notesAttributes.length) payload.notes_attributes = notesAttributes;

  const dimensionInfoAttributes: Record<string, unknown> = {};
  const fittingInfoAttributes: Record<string, unknown> = {};

  if (item.introDate) {
    dimensionInfoAttributes.intro_date = item.introDate;
    fittingInfoAttributes.intro_date = item.introDate;
  }
  if (item.dimensionPackId != null) {
    dimensionInfoAttributes.dimension_assortment_id = item.dimensionPackId;
  }
  if (item.dimensionMeasureId != null) {
    dimensionInfoAttributes.dimension_measure_id = item.dimensionMeasureId;
  }
  if (item.dimensionSpecId != null) {
    dimensionInfoAttributes.dimension_spec_id = item.dimensionSpecId;
  }
  const noOfDimension = buildNoOfDimensionPayload(
    item.dimensionSpecSlotCount,
    item.dimensionNoOfDimension,
  );
  if (noOfDimension) {
    dimensionInfoAttributes.no_of_dimension = noOfDimension;
  }
  if (item.fittingPackAssortId != null) {
    fittingInfoAttributes.fitting_assortment_id = item.fittingPackAssortId;
  }
  if (item.fittingMeasureId != null) {
    fittingInfoAttributes.fitting_measure_id = item.fittingMeasureId;
  }
  if (item.fittingSpecId != null) {
    fittingInfoAttributes.fitting_spec_id = item.fittingSpecId;
  }
  const noOfSizes = buildFittingNoOfSizesPayload(
    item.fittingSpecSlotCount,
    item.fittingNoOfSizes,
    item.ringSizeId,
  );
  if (noOfSizes) {
    fittingInfoAttributes.no_of_sizes = noOfSizes;
  } else if (item.size?.trim()) {
    fittingInfoAttributes.no_of_sizes = { size_1: item.size.trim() };
  }

  if (Object.keys(dimensionInfoAttributes).length) {
    payload.dimension_info_attributes = dimensionInfoAttributes;
  }
  if (Object.keys(fittingInfoAttributes).length) {
    payload.fitting_info_attributes = fittingInfoAttributes;
  }

  const stockDim: Record<string, number> = {};
  if (item.length != null) stockDim.length = item.length;
  if (item.breadth != null) stockDim.breadth = item.breadth;
  if (item.height != null) stockDim.height = item.height;
  if (Object.keys(stockDim).length) payload.stock_dimension = stockDim;

  if (item.a4PackLabels != null) payload.barlabqnty = item.a4PackLabels;

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
