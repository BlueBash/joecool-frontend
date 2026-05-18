import type { AddressCreatePayload, AddressRow, AddressTypeParam } from "@/api/address";
import type { Address, AddressType } from "@/lib/types";

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function extractAddressable(attrs: Record<string, unknown>): Record<string, unknown> | null {
  const nested = attrs.addressable;
  if (!nested || typeof nested !== "object") return null;
  const n = nested as Record<string, unknown>;
  const data = n.data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (d.attributes && typeof d.attributes === "object") {
      return d.attributes as Record<string, unknown>;
    }
  }
  if (n.attributes && typeof n.attributes === "object") {
    return n.attributes as Record<string, unknown>;
  }
  return null;
}

function mapAddressableType(raw: unknown): AddressType {
  const s = String(raw ?? "");
  if (s.includes("Supplier") || s === "supplier") return "Supplier";
  return "Customer";
}

function str(v: unknown, fallback = ""): string {
  if (v == null) return fallback;
  return String(v);
}

function num(v: unknown): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function idNum(v: unknown): number | undefined {
  return num(v);
}

/** Maps a flattened JSON:API address (or supplier) row into the UI `Address` model. */
export function mapRowToAddress(row: AddressRow): Address {
  const attrs = asRecord(row);
  const addressable = extractAddressable(attrs);
  const base = addressable ?? attrs;
  const jsonType = str(attrs.type ?? row.type);

  const type: AddressType =
    jsonType === "supplier" || base.kind === "S"
      ? "Supplier"
      : mapAddressableType(attrs.addressable_type ?? jsonType);

  const noteText =
    typeof attrs.note === "string"
      ? attrs.note
      : asRecord(attrs.note_attributes).note != null
        ? str(asRecord(attrs.note_attributes).note)
        : undefined;

  const firstContact = Array.isArray(attrs.contacts)
    ? asRecord(attrs.contacts[0])
    : asRecord(attrs.contact);

  const cost = asRecord(attrs.supp_stock_cost_factor);

  return {
    id: str(attrs.id ?? row.id),
    code: str(base.code),
    name: str(base.name ?? attrs.name ?? row.name),
    type,
    kind: str(base.kind),
    created: str(attrs.created_at ?? base.created_at).slice(0, 10) || undefined,
    contact: str(firstContact.name ?? attrs.contact),
    email: str(firstContact.email ?? attrs.email),
    phone: str(firstContact.phone ?? attrs.phone ?? attrs.fax),
    website: str(attrs.website),
    address1: str(base.address_1 ?? attrs.address_1),
    address2: str(base.address_2 ?? attrs.address_2) || undefined,
    town: str(base.town ?? attrs.town),
    region: str(base.region ?? base.state ?? attrs.region ?? attrs.state) || undefined,
    zip: str(base.zip ?? attrs.zip) || undefined,
    country: str(base.country ?? attrs.country ?? attrs.country_name, "—"),
    countryId: idNum(base.country_id ?? attrs.country_id),
    category: str(attrs.category_name ?? attrs.category),
    categoryId: idNum(attrs.category_id),
    categoryCode: str(attrs.category_code),
    area: str(attrs.area_name ?? attrs.area),
    areaId: idNum(attrs.area_id),
    areaCode: str(attrs.area_code),
    deliveryAccId: idNum(attrs.delivery_acc_id),
    invoiceAccId: idNum(attrs.invoice_acc_id),
    invoiceEnv: str(attrs.invoice_env_name ?? attrs.invoice_env),
    invoiceEnvId: idNum(attrs.invoice_env_id),
    creditEnv: str(attrs.credit_env_name ?? attrs.credit_env),
    creditEnvId: idNum(attrs.credit_env_id),
    currency: str(attrs.order_currency_name ?? attrs.order_currency),
    orderCurrencyId: idNum(attrs.order_currency_id),
    priceCategory: str(attrs.order_price_name ?? attrs.order_price),
    orderPriceId: idNum(attrs.order_price_id),
    costCode: str(attrs.order_cost_code_name ?? attrs.order_cost_code),
    orderCostCodeId: idNum(attrs.order_cost_code_id),
    fobFactor: str(base.fob_factor ?? attrs.fob_factor),
    overallInvDscPct: num(attrs.discnt_overall),
    whlslItemDscPct: num(attrs.price_increament),
    vatReg: str(attrs.vat_regno),
    vatKind: str(attrs.vat_kind_name ?? attrs.vat_kind),
    vatKindId: idNum(attrs.vat_kind_id),
    orderKind: str(attrs.order_kind_name ?? attrs.order_kind),
    orderKindId: idNum(attrs.order_kind_id),
    vatRate: str(attrs.vat_rate_code_name ?? attrs.vat_rate_code),
    vatRateCodeId: idNum(attrs.vat_rate_code_id),
    language: str(attrs.language_name ?? attrs.language),
    languageId: idNum(attrs.language_id),
    barcodeLabel: str(attrs.label_source_name ?? attrs.label_source),
    labelSourceId: idNum(attrs.label_source_id),
    specialInvoice: str(attrs.special_invs_name ?? attrs.special_invs),
    specialInvsId: idNum(attrs.special_invs_id),
    payTerms: str(attrs.pay_term_name ?? attrs.pay_term),
    payTermId: idNum(attrs.pay_term_id),
    standardDays: num(attrs.standard_days),
    settleDays: num(attrs.settle_days),
    settleDiscount: num(attrs.settle_discount),
    payMethod: str(attrs.pay_method_name ?? attrs.pay_method),
    payMethodId: idNum(attrs.pay_method_id),
    bankAcct: str(attrs.bank_account_name ?? attrs.bank_account),
    bankAccountId: idNum(attrs.bank_account_id),
    shipFrom: str(attrs.ship_from_name ?? attrs.ship_from),
    shipFromId: idNum(attrs.ship_from_id),
    warehouse: str(attrs.warehouse_name ?? attrs.warehouse),
    warehouseId: idNum(attrs.warehouse_id),
    shipMethod: str(attrs.ship_method_name ?? attrs.ship_method),
    shipMethodId: idNum(attrs.ship_method_id),
    transitDay: num(attrs.transit_days),
    shipCharging: str(attrs.shipping_charge_name ?? attrs.shipping_charge),
    shippingChargeId: idNum(attrs.shipping_charge_id),
    charge: num(attrs.shipping_charge_amount),
    accountManager: str(attrs.account_manager_name ?? attrs.account_manager),
    accountManagerId: idNum(attrs.account_manager_id),
    agent: str(attrs.agent_name ?? attrs.agent),
    agentId: idNum(attrs.agent_id),
    profitCentre: str(attrs.profit_centre_name ?? attrs.profit_centre),
    profitCentreId: idNum(attrs.profit_centre_id),
    notes: noteText ?? str(attrs.notes),
    suppFobFactor: str(base.fob_factor ?? cost.fob_factor),
    costCurrency: str(asRecord(cost.currency_data).code ?? cost.currency_code),
    costFactorCurrencyId: idNum(cost.currency_id),
    agentCommPct: num(cost.agentcommpct),
    agentPackingChargePct: num(cost.agentpackingchargepct),
    qualityPct: num(cost.qualitypct),
    probsPct: num(cost.probspct),
    chargesPct: num(cost.chargespct),
    freightToUkPct: num(cost.freighttoukpct),
    fobAdminChargesPct: num(cost.fobadminchargespct),
    ukClearPct: num(cost.ukclearpct),
    ukDeliveryPct: num(cost.ukdeliverypct),
    ukDutyPct: num(cost.ukdutypct),
  };
}

/** Builds a create/update payload for `POST/PATCH /addresses`. */
export function addressToPayload(draft: Address): AddressCreatePayload {
  const kind = draft.type === "Supplier" ? "S" : "C";

  const payload: AddressCreatePayload = {
    type_attributes: {
      kind,
      code: draft.code,
      name: draft.name,
      address_1: draft.address1,
      address_2: draft.address2 ?? null,
      region: draft.region ?? null,
      town: draft.town,
      state: draft.region ?? null,
      zip: draft.zip ?? null,
      country_id: draft.countryId,
    },
    fax: draft.phone ?? undefined,
    website: draft.website ?? undefined,
    vat_regno: draft.vatReg || undefined,
    discnt_overall: draft.overallInvDscPct,
    price_increament: draft.whlslItemDscPct,
    transit_days: draft.transitDay,
    shipping_charge_amount: draft.charge,
    settle_discount: draft.settleDiscount,
    settle_days: draft.settleDays,
    standard_days: draft.standardDays,
    category_id: draft.categoryId,
    area_id: draft.areaId,
    account_manager_id: draft.accountManagerId,
    agent_id: draft.agentId,
    profit_centre_id: draft.profitCentreId,
    invoice_acc_id: draft.invoiceAccId,
    delivery_acc_id: draft.deliveryAccId,
    invoice_env_id: draft.invoiceEnvId,
    credit_env_id: draft.creditEnvId,
    order_currency_id: draft.orderCurrencyId,
    order_price_id: draft.orderPriceId,
    order_cost_code_id: draft.orderCostCodeId,
    vat_kind_id: draft.vatKindId,
    order_kind_id: draft.orderKindId,
    vat_rate_code_id: draft.vatRateCodeId,
    language_id: draft.languageId,
    label_source_id: draft.labelSourceId,
    special_invs_id: draft.specialInvsId,
    pay_term_id: draft.payTermId,
    pay_method_id: draft.payMethodId,
    bank_account_id: draft.bankAccountId,
    ship_from_id: draft.shipFromId,
    warehouse_id: draft.warehouseId,
    ship_method_id: draft.shipMethodId,
    shipping_charge_id: draft.shippingChargeId,
  };

  if (draft.notes?.trim()) {
    payload.note_attributes = { code: draft.code, note: draft.notes };
  }

  if (draft.type === "Supplier") {
    const fob = draft.fobFactor ?? draft.suppFobFactor;
    const typeAttrs = payload.type_attributes as Record<string, unknown>;
    if (fob) typeAttrs.fob_factor = Number(fob) || fob;

    payload.supp_stock_cost_factor_attributes = {
      agentcommpct: draft.agentCommPct,
      agentpackingchargepct: draft.agentPackingChargePct,
      chargespct: draft.chargesPct,
      fobadminchargespct: draft.fobAdminChargesPct,
      freighttoukpct: draft.freightToUkPct,
      probspct: draft.probsPct,
      qualitypct: draft.qualityPct,
      ukclearpct: draft.ukClearPct,
      ukdeliverypct: draft.ukDeliveryPct,
      ukdutypct: draft.ukDutyPct,
      currency_id: draft.costFactorCurrencyId,
    };
  }

  if (draft.contact || draft.email || draft.phone) {
    payload.contacts_attributes = [
      {
        name: draft.contact ?? draft.name,
        email: draft.email ?? "",
        phone: draft.phone ?? "",
        mobile: "",
        flag_newsletter: false,
      },
    ];
  }

  return payload;
}

export function addressTypeToApiParam(type: AddressType): AddressTypeParam {
  return type === "Supplier" ? "supplier" : "customer";
}

export function filterAddressesLocally(items: Address[], search: string): Address[] {
  const q = search.trim().toLowerCase();
  if (!q) return items;
  return items.filter((a) =>
    [a.code, a.name, a.town, a.country].some((v) => v?.toLowerCase().includes(q)),
  );
}
