export type ID = string;

/** Composed material row on a stock item. */
export interface StockMaterialRow {
  materialId?: number;
  material: string;
  composite: number;
}

export type StockMaterialRowUpdate = Partial<StockMaterialRow>;

/** Stock range row on SEO tab (`range.range_N` in API). */
export interface StockRangeRow {
  rangeId?: number;
  range: string;
}

export interface StockItem {
  id: ID;
  code: string;
  title: string;
  category: string;
  categoryId?: number;
  colourId?: number;
  assortmentId?: number;
  collectionId?: number;
  selectionId?: number;
  genderId?: number;
  unitId?: number;
  packagingId?: number;
  displayId?: number;
  tariffCodeId?: number;
  vatRateCodeId?: number;
  joeOnlineRangeId?: number;
  stockBuyerId?: number;
  onHand: number;
  reorderLevel: number;
  color: string;
  size?: string;
  ringSizeId?: number;
  introDate: string;
  costPrice: number;
  sellingPrice: number;
  supplierCode?: string;
  status: "active" | "low" | "out" | "archived";
  imageHue: number;
  /** Active Storage URLs from the API. */
  images?: string[];
  /** Base64 data URLs queued for upload on save. */
  pendingImages?: string[];
  flags: string[];
  notes?: string;
  // Header
  toZoho?: boolean;
  editedTitle?: string;
  generatedTitle?: string;
  // Makeup
  categoryCode?: string;
  colorCode?: string;
  displayCode?: string;
  displayName?: string;
  cost?: number;
  uniqueDescription?: string;
  packBarcode?: string;
  retailBarcode?: string;
  assortment?: string;
  collection?: string;
  selections?: string;
  packaging?: string;
  gender?: string;
  unchanged?: string;
  units?: string;
  itemTariff?: string;
  vatRate?: string;
  categoryTariff?: string;
  frontLocation?: string;
  backLocation?: string;
  catalogueLocation?: string;
  materials?: StockMaterialRow[];
  // SEO
  wholesaleBlurb?: string;
  consumerBlurb?: string;
  ranges?: StockRangeRow[];
  seoKeywords?: string;
  // Supplier
  supplierId?: number;
  supplier?: string;
  supplierName?: string;
  supplierKind?: string;
  supplierAddress?: string;
  supplierAddress2?: string;
  supplierTown?: string;
  supplierRegion?: string;
  supplierZip?: string;
  supplierCountry?: string;
  supplierIso?: string;
  supplierContact?: string;
  supplierPhone?: string;
  supplierEmail?: string;
  supplierWebsite?: string;
  supplierItemCode?: string;
  buyer?: string;
  manufacturerId?: number;
  manufacturer?: string;
  manufacturerCode?: string;
  manufacturerName?: string;
  manufacturerKind?: string;
  manufacturerAddress?: string;
  manufacturerAddress2?: string;
  manufacturerTown?: string;
  manufacturerRegion?: string;
  manufacturerZip?: string;
  manufacturerCountry?: string;
  manufacturerIso?: string;
  manufacturerContact?: string;
  manufacturerPhone?: string;
  manufacturerEmail?: string;
  manufacturerWebsite?: string;
  manufrItemCode?: string;
  wholesaleReorderLevel?: number;
  reorderQty?: number;
  wholesaleTopUpTo?: number;
  // Cost Prices
  supplierFobX?: number;
  factyCost?: number;
  factyPer?: number;
  factyPack?: string;
  factyAmount?: number;
  factyInvd?: number;
  packagingName?: string;
  packagingNewAmount?: number;
  agentCommPct?: number;
  agentAmount?: number;
  agentBase?: number;
  agentCost?: number;
  agentPackPct?: number;
  agentPackAmount?: number;
  qualityPct?: number;
  probsPct?: number;
  chargesPct?: number;
  fobChargesPct?: number;
  fobChargesAmount?: number;
  itemOb?: number;
  fobBase?: number;
  jcPacking?: string;
  jcPackingAmount?: number;
  jcObCost?: number;
  freightPct?: number;
  freightAmount?: number;
  arriveUk?: number;
  calcFobX?: number;
  currencyCode?: string;
  currentRate?: number;
  lastUsedXRate?: number;
  buyAdjustPct?: number;
  effectiveRate?: number;
  arriveUkRate?: number;
  upGbp?: number;
  ukDutyPct?: number;
  ukDutyAmount?: number;
  dutyPaid?: number;
  clearancePct?: number;
  clearanceAmount?: number;
  ukLanded?: number;
  deliveryPct?: number;
  deliveryAmount?: number;
  delivered?: number;
  assembly?: string;
  assemblyAmount?: number;
  assembled?: number;
  display?: string;
  displayAmount?: number;
  calcReady?: number;
  per?: number;
  roundedUp?: number;
  landedFactr?: number;
  storedReady?: number;
  calcdMarkup?: number;
  gbpWhlsl?: number;
  // Selling Prices
  sellGbp?: number;
  sellEur?: number;
  sellUsd?: number;
  whlslGbpPrice?: number; whlslGbpPer?: number; whlslGbpPct?: number;
  whlslEurPrice?: number; whlslEurPer?: number; whlslEurPct?: number;
  whlslUsdPrice?: number; whlslUsdPer?: number; whlslUsdPct?: number;
  retailGbpPrice?: number; retailGbpPer?: number; retailGbpPct?: number;
  retailEurPrice?: number; retailEurPer?: number; retailEurPct?: number;
  retailUsdPrice?: number; retailUsdPer?: number; retailUsdPct?: number;
  amazonGbpPrice?: number; amazonGbpPer?: number; amazonGbpPct?: number;
  amazonEurPrice?: number; amazonEurPer?: number; amazonEurPct?: number;
  amazonUsdPrice?: number; amazonUsdPer?: number; amazonUsdPct?: number;
  specialPrice?: number;
  // Flags / Specials
  flagCodes?: Record<string, boolean>;
  // Orders Levels / Stock Position
  warehouseLevels?: number;
  stockAllocated?: number;
  transit?: number;
  supplierOrders?: number;
  shelf?: number;
  available?: number;
  supCodir?: number;
  stockSls?: number;
  boxes?: number;
  customerOrders?: number;
  transitAllocated?: number;
  chinaCo?: number;
  free?: number;
  spare?: number;
  twelveMthSls?: number;
  spareSls?: number;
  // Details
  packQuantity?: number;
  weightGm?: number;
  volume?: number;
  length?: number;
  breadth?: number;
  height?: number;
  a4PackLabels?: number;
  fittingPackAssort?: string;
  fittingMeasure?: string;
  fittingSpec?: string;
  dimensionPack?: string;
  dimensionMeasure?: string;
  dimensionSpec?: string;
}

export type AddressType = "Supplier" | "Customer";
export type AddressKind = string;
export interface AddressFlags {
  flag1?: boolean; flag2?: boolean; flag3?: boolean;
  stop?: boolean; bad?: boolean; shop?: boolean; ownShop?: boolean; apOnly?: boolean; salesLead?: boolean;
  statement?: boolean; whlslEmailShots?: boolean; reorderPrompts?: boolean;
  orderBalnsPrint?: boolean; lateOrderSheet?: boolean; allowOverdue?: boolean;
  bestSellerConsider?: boolean; customsInvoice?: boolean;
}
export interface Address {
  id: ID;
  code: string;
  name: string;
  type: AddressType;
  kind?: string;
  created?: string;
  // Contact
  contact?: string;
  email?: string;
  phone?: string;
  website?: string;
  // Address
  address1: string;
  address2?: string;
  town: string;
  region?: string;
  zip?: string;
  country: string;
  countryId?: number;
  category?: string;
  categoryId?: number;
  categoryCode?: string;
  area?: string;
  areaId?: number;
  areaCode?: string;
  deliveryAccount?: string;
  deliveryAccId?: number;
  invoiceAccId?: number;
  // Terms — Invoicing
  invoiceEnv?: string; invoiceEnvCode?: string;
  invoiceEnvId?: number;
  creditEnv?: string; creditEnvCode?: string;
  creditEnvId?: number;
  currency?: string;
  orderCurrencyId?: number;
  priceCategory?: string;
  orderPriceId?: number;
  costCode?: string; costCodeValue?: string;
  orderCostCodeId?: number;
  fobFactor?: string;
  overallInvDscPct?: number;
  whlslItemDscPct?: number;
  vatReg?: string;
  vatKind?: string;
  vatKindId?: number;
  orderKind?: string;
  orderKindId?: number;
  vatRate?: string; vatRateValue?: string;
  vatRateCodeId?: number;
  language?: string;
  languageId?: number;
  barcodeLabel?: string;
  labelSourceId?: number;
  specialInvoice?: string;
  specialInvsId?: number;
  // Terms — Payment
  payTerms?: string;
  payTermId?: number;
  standardDays?: number;
  settleDays?: number;
  settleDiscount?: number;
  payMethod?: string;
  payMethodId?: number;
  bankAcct?: string;
  bankAccountId?: number;
  // Terms — Shipping
  shipFrom?: string;
  shipFromId?: number;
  warehouse?: string;
  warehouseId?: number;
  shipMethod?: string;
  shipMethodId?: number;
  transitDay?: number;
  shipCharging?: string;
  shippingChargeId?: number;
  charge?: number;
  // Flags & Agent
  accountManager?: string; accountManagerCode?: string;
  accountManagerId?: number;
  agent?: string; agentCode?: string;
  agentId?: number;
  profitCentre?: string;
  profitCentreId?: number;
  costFactorCurrencyId?: number;
  flags?: AddressFlags;
  // Notes
  notes?: string;
  // Cost Factor
  items?: string;
  suppFobFactor?: string;
  costCurrency?: string;
  agentCommPct?: number;
  agentPackingChargePct?: number;
  qualityPct?: number;
  probsPct?: number;
  chargesPct?: number;
  freightToUkPct?: number;
  fobAdminChargesPct?: number;
  ukClearPct?: number;
  ukDeliveryPct?: number;
  ukDutyPct?: number;
  masterUniqId?: string;
  workUniqId?: string;
  lastOrder?: string;
}

export type OrderStatus = "Draft" | "Confirmed" | "Shipped" | "Cancelled";
export type OrderKind = "REGULAR" | "SAMPLE" | "BACKORDER";
export interface OrderLine {
  id: ID;
  itemCode: string;
  itemName: string;
  qty: number;
  price: number;
  per: number;
}

/** Inline edits merged onto an existing order line (`id` unchanged). */
export type OrderLineUpdate = Partial<Pick<OrderLine, "itemCode" | "itemName" | "qty" | "price" | "per">>;

export interface Order {
  id: ID;
  code: string;
  addrType: AddressType;
  addrCode: string;
  addrName: string;
  logRef: string;
  ourRef?: string;
  theirRef?: string;
  kind: OrderKind;
  status: OrderStatus;
  written: string;
  ship: string;
  cancel: string;
  lines: OrderLine[];
  notes?: string;
  messages?: string;
  // Header
  venues?: string;
  centre?: string;
  invEnvironment?: string;
  costCode?: string;
  selectAcManager?: string;
  inputer?: string;
  currency?: string;
  vatKind?: string;
  agent?: string;
  agentCommRate?: number;
  price?: string;
  vatRateCode?: string;
  vatRateValue?: string;
  author?: string;
  authorCommRate?: number;
  source?: string;
  sourceCommRate?: number;
  confirmed?: boolean;
  allowAllocs?: boolean;
  // Dates
  dateLodged?: string;
  dateExpect?: string;
  dateDeliveryFirst?: string;
  dateDeliveryLast?: string;
  datePickupFirst?: string;
  datePickupLast?: string;
  dateInvoiceFirst?: string;
  dateInvoiceLast?: string;
  priority?: string;
  fobCharge?: number;
  discountOverall?: number;
  discountItems?: number;
  barcodeSource?: string;
  language?: string;
  // Address
  vatRegNo?: string;
  email?: string;
  buyerName?: string;
  category?: string;
  invAddressCode?: string;
  delAddressCode?: string;
  // Ship & Pay
  shipFrom?: string;
  shipMethod?: string;
  shipCharging?: string;
  charge?: number;
  transitDays?: number;
  payMethod?: string;
  payTerms?: string;
  bankAcct?: string;
  standardDays?: number;
  settleDays?: number;
  settleDiscPct?: number;
  payStatus?: string;
  // Item summary
  exchRate?: number;
}

export type TxnKind = "Invoice" | "Payment" | "Credit";
export type TranType = "Sale" | "Purchase" | "Refund" | "Adjustment";
export interface TxnLine {
  id: ID;
  itemCode: string;
  description: string;
  qty: number;
  price: number;
}

/** Inline edits merged onto an existing transaction line (`id` unchanged). */
export type TxnLineUpdate = Partial<Pick<TxnLine, "itemCode" | "description" | "qty" | "price">>;

export interface TxnAllocation {
  id: ID;
  invoiceRef: string;
  amount: number;
}

/** Inline edits merged onto an existing allocation row (`id` unchanged). */
export type TxnAllocationUpdate = Partial<Pick<TxnAllocation, "invoiceRef" | "amount">>;

export interface Transaction {
  id: ID;
  refMain: string;
  kind: TxnKind;
  addrCode: string;
  addrName: string;
  date: string;
  invoicedQty: number;
  balancedQty: number;
  lines: number;
  value: number;
  status: "Open" | "Paid" | "Partial" | "Void";
  // Rich Main Transaction Detail (legacy parity)
  tranType?: TranType;
  profCentre?: string;
  taxPeriod?: string;
  delvDate?: string;
  dueDate?: string;
  transRef?: string;
  auditRef?: string;
  agent?: string;
  commPct?: number;
  vatBand?: string;
  ratePct?: number;
  comment?: string;
  payTerms?: string;
  currency?: string;
  mainCode?: string;
  postCode?: string;
  discountGiven?: number;
  vatCode?: string;
  exclusiveValue?: number;
  controlCode?: string;
  bankAcct?: string;
  bankCurrency?: string;
  standardDays?: number;
  settleDays?: number;
  settleDiscPct?: number;
  acctBalance?: number;
  overdue?: number;
  txnLines?: TxnLine[];
  allocations?: TxnAllocation[];
}

export interface Operator {
  id: ID;
  code: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Staff" | "Viewer";
  active: boolean;
  lastSeen: string;
}

export interface TimeEntry {
  id: ID;
  operatorCode: string;
  operatorName: string;
  date: string;
  inAt: string;
  outAt: string;
  notes?: string;
  // Legacy parity
  morningBegin?: string;
  morningEnd?: string;
  afternoonBegin?: string;
  afternoonEnd?: string;
  extraBegin?: string;
  extraEnd?: string;
  breaksNo?: number;
  breaksTime?: number;
  totalWorked?: number;
  holidayHalf?: boolean;
  holidayFull?: boolean;
  sickHalf?: boolean;
  sickFull?: boolean;
  discretionHalf?: boolean;
  discretionFull?: boolean;
  absentHalf?: boolean;
  absentFull?: boolean;
}

export interface SettingItem {
  id: ID;
  code: string;
  name: string;
  group?: string;
  meta?: string;
  show: boolean;
}

/** Fields editable on settings catalog rows (inline edit / forms). */
export type SettingItemUpdate = Pick<SettingItem, "code" | "name" | "show">;
