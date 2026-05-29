export const BALANCE_ORDER_KINDS = ["REGULAR", "CODIR", "FORECAST", "DROPPED"] as const;
export type BalanceOrderKind = (typeof BALANCE_ORDER_KINDS)[number];

export type BalanceOrderRow = "orders" | "quantities" | "values";

export type BalanceOrdersGrid = Record<
  BalanceOrderRow,
  Record<BalanceOrderKind, number>
>;

export type OrderKindSummaryEntry = {
  order_kind: string;
  address_type: string;
  count: number;
  total_original_qty: number;
  total_original_value: number;
};

function emptyGrid(): BalanceOrdersGrid {
  return {
    orders: { REGULAR: 0, CODIR: 0, FORECAST: 0, DROPPED: 0 },
    quantities: { REGULAR: 0, CODIR: 0, FORECAST: 0, DROPPED: 0 },
    values: { REGULAR: 0, CODIR: 0, FORECAST: 0, DROPPED: 0 },
  };
}

const EXCLUDED_KINDS = new Set(["UNIQUE", "AP", "OWN"]);

/** Parses `GET /stocks/:id/order_kind_summary` into Customer/Supplier grids. */
export function parseOrderKindSummary(data: unknown): {
  customer: BalanceOrdersGrid;
  supplier: BalanceOrdersGrid;
} {
  const customer = emptyGrid();
  const supplier = emptyGrid();

  const attrs =
    data && typeof data === "object"
      ? ((data as Record<string, unknown>).attributes as Record<string, unknown> | undefined) ??
        (data as Record<string, unknown>)
      : undefined;

  const counts = attrs?.order_kind_counts;
  if (!Array.isArray(counts)) return { customer, supplier };

  for (const raw of counts) {
    if (!raw || typeof raw !== "object") continue;
    const row = raw as OrderKindSummaryEntry;
    const kind = String(row.order_kind ?? "").toUpperCase();
    if (EXCLUDED_KINDS.has(kind) || !BALANCE_ORDER_KINDS.includes(kind as BalanceOrderKind)) {
      continue;
    }

    const addressType = String(row.address_type ?? "").toLowerCase();
    const grid = addressType === "supplier" ? supplier : customer;
    const k = kind as BalanceOrderKind;

    grid.orders[k] = Number(row.count) || 0;
    grid.quantities[k] = Number(row.total_original_qty) || 0;
    grid.values[k] = Number(Number(row.total_original_value ?? 0).toFixed(2));
  }

  return { customer, supplier };
}

export const BALANCE_ORDER_COLUMNS: { kind: BalanceOrderKind; label: string }[] = [
  { kind: "REGULAR", label: "Regular" },
  { kind: "CODIR", label: "Codir" },
  { kind: "FORECAST", label: "Forecast" },
  { kind: "DROPPED", label: "Dropped" },
];

export const BALANCE_ORDER_ROWS: { key: BalanceOrderRow; label: string }[] = [
  { key: "orders", label: "Orders" },
  { key: "quantities", label: "Qntys" },
  { key: "values", label: "Values" },
];
