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
    category: str(attrs.category_name ?? attrs.category),
    categoryCode: str(attrs.category_code),
    area: str(attrs.area_name ?? attrs.area),
    areaCode: str(attrs.area_code),
    invoiceEnv: str(attrs.invoice_env_name ?? attrs.invoice_env),
    creditEnv: str(attrs.credit_env_name ?? attrs.credit_env),
    currency: str(attrs.order_currency_name ?? attrs.order_currency),
    priceCategory: str(attrs.order_price_name ?? attrs.order_price),
    costCode: str(attrs.order_cost_code_name ?? attrs.order_cost_code),
    fobFactor: str(base.fob_factor ?? attrs.fob_factor),
    overallInvDscPct: num(attrs.discnt_overall),
    whlslItemDscPct: num(attrs.price_increament),
    vatReg: str(attrs.vat_regno),
    vatKind: str(attrs.vat_kind_name ?? attrs.vat_kind),
    orderKind: str(attrs.order_kind_name ?? attrs.order_kind),
    vatRate: str(attrs.vat_rate_code_name ?? attrs.vat_rate_code),
    language: str(attrs.language_name ?? attrs.language),
    barcodeLabel: str(attrs.label_source_name ?? attrs.label_source),
    specialInvoice: str(attrs.special_invs_name ?? attrs.special_invs),
    payTerms: str(attrs.pay_term_name ?? attrs.pay_term),
    standardDays: num(attrs.standard_days),
    settleDays: num(attrs.settle_days),
    settleDiscount: num(attrs.settle_discount),
    payMethod: str(attrs.pay_method_name ?? attrs.pay_method),
    bankAcct: str(attrs.bank_account_name ?? attrs.bank_account),
    shipFrom: str(attrs.ship_from_name ?? attrs.ship_from),
    warehouse: str(attrs.warehouse_name ?? attrs.warehouse),
    shipMethod: str(attrs.ship_method_name ?? attrs.ship_method),
    transitDay: num(attrs.transit_days),
    shipCharging: str(attrs.shipping_charge_name ?? attrs.shipping_charge),
    charge: num(attrs.shipping_charge_amount),
    accountManager: str(attrs.account_manager_name ?? attrs.account_manager),
    agent: str(attrs.agent_name ?? attrs.agent),
    profitCentre: str(attrs.profit_centre_name ?? attrs.profit_centre),
    notes: noteText ?? str(attrs.notes),
    suppFobFactor: str(base.fob_factor ?? cost.fob_factor),
    costCurrency: str(asRecord(cost.currency_data).code ?? cost.currency_code),
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
