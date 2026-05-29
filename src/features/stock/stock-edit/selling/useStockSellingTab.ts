import { useCallback, useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { addressSpecialPrices } from "@/api/address/address";
import { currencies } from "@/api/platform/catalogs";
import { stocks } from "@/api/stocks";
import type { StockFormValues } from "../../stock-form-schema";
import { computeSellingAge, exchangeRateForCurrency } from "./selling-calculations";
import {
  categoryIdField,
  formToSaveSellPricesPayload,
  mapSellingPricesToForm,
  parseSellingPricesFromApi,
  perField,
  pctField,
  priceField,
} from "./map-selling-prices";
import { DEFAULT_SELLING_GROUPS, sellingGroupFromApi, type SellingCurrency } from "./selling-types";

const UI_GROUPS = ["whlsl", "retail", "amazon"] as const;
const CURS: SellingCurrency[] = ["gbp", "eur", "usd"];

function buildCategoryLookup(grouped: unknown): Record<string, Record<string, { id: number }>> {
  const out: Record<string, Record<string, { id: number }>> = {};
  if (!grouped || typeof grouped !== "object") return out;
  const root = grouped as Record<string, unknown>;
  const categories =
    (root.grouped_categories as Record<string, unknown[]>) ??
    (root as Record<string, unknown[]>);

  for (const [group, rows] of Object.entries(categories)) {
    if (!Array.isArray(rows)) continue;
    out[group] = out[group] ?? {};
    for (const row of rows) {
      if (!row || typeof row !== "object") continue;
      const r = row as Record<string, unknown>;
      const code = String(r.code ?? "").toLowerCase();
      const currency = code.slice(-3);
      if (["gbp", "eur", "usd"].includes(currency)) {
        out[group][currency] = { id: Number(r.id) };
      }
    }
  }
  return out;
}

export function useStockSellingTab(stockId: string, isNew: boolean) {
  const { watch, setValue, getValues } = useFormContext<StockFormValues>();
  const snapshotRef = useRef<Partial<StockFormValues> | null>(null);

  const roundedUp = watch("roundedUp");
  const currenciesQuery = currencies.hooks.useList({ pageSize: 300 });
  const groupedQuery = stocks.hooks.useGroupedPriceCategories({ enabled: !isNew });
  const saveMutation = stocks.hooks.useSaveSellPrices();

  const specialPricesQuery = addressSpecialPrices.hooks.useStockSpecialPrices(
    isNew ? null : stockId,
    { page: 1, pageSize: 1 },
  );

  const exchangeRates = useMemo(() => {
    const rates: Partial<Record<SellingCurrency, number>> = {};
    for (const row of currenciesQuery.data?.items ?? []) {
      const code = String(row.code ?? "").toLowerCase();
      if (code === "gbp" || code === "eur" || code === "usd") {
        rates[code] = exchangeRateForCurrency(code, row as Record<string, unknown>);
      }
    }
    return rates;
  }, [currenciesQuery.data?.items]);

  const categoryLookup = useMemo(
    () => buildCategoryLookup(groupedQuery.data),
    [groupedQuery.data],
  );

  const initFromSellingApi = useCallback(
    (raw: unknown) => {
      const selling = parseSellingPricesFromApi(raw);
      const patch = mapSellingPricesToForm(selling, categoryLookup);

      for (const apiGroup of DEFAULT_SELLING_GROUPS) {
        const uiGroup = sellingGroupFromApi(apiGroup);
        for (const cur of CURS) {
          const pricePath = priceField(uiGroup, cur);
          const perPath = perField(uiGroup, cur);
          const catPath = categoryIdField(uiGroup, cur);

          if ((patch as Record<string, unknown>)[pricePath] === undefined) {
            (patch as Record<string, unknown>)[pricePath] = 0;
          }
          if ((patch as Record<string, unknown>)[perPath] === undefined) {
            (patch as Record<string, unknown>)[perPath] = 1;
          }
          if (!(patch as Record<string, unknown>)[catPath] && categoryLookup[apiGroup]?.[cur]) {
            (patch as Record<string, unknown>)[catPath] = categoryLookup[apiGroup][cur].id;
          }
        }
      }

      snapshotRef.current = patch;
      for (const [k, v] of Object.entries(patch)) {
        if (v !== undefined) setValue(k as keyof StockFormValues, v as never, { shouldDirty: false });
      }

      if (exchangeRates.gbp != null) setValue("sellGbp", exchangeRates.gbp, { shouldDirty: false });
      if (exchangeRates.eur != null) setValue("sellEur", exchangeRates.eur, { shouldDirty: false });
      if (exchangeRates.usd != null) setValue("sellUsd", exchangeRates.usd, { shouldDirty: false });
    },
    [categoryLookup, exchangeRates, setValue],
  );

  useEffect(() => {
    if (!groupedQuery.data) return;
    const raw = getValues("sellingPricesRaw");
    if (raw) initFromSellingApi(raw);
  }, [groupedQuery.data, getValues, initFromSellingApi]);

  const pricePerFields = watch(
    UI_GROUPS.flatMap((g) => CURS.flatMap((c) => [priceField(g, c), perField(g, c)])),
  );

  useEffect(() => {
    const storedReady = Number(roundedUp) || 0;
    let idx = 0;
    for (const group of UI_GROUPS) {
      for (const cur of CURS) {
        const price = Number(pricePerFields[idx++]) || 0;
        const per = Number(pricePerFields[idx++]) || 1;
        const rate = exchangeRates[cur] ?? 1;
        const age = computeSellingAge(price, per, rate, storedReady);
        setValue(pctField(group, cur), age, { shouldDirty: false });
      }
    }
  }, [pricePerFields, roundedUp, exchangeRates, setValue]);

  const handleIgnore = useCallback(() => {
    const snap = snapshotRef.current;
    if (!snap) {
      toast.info("No saved selling price snapshot");
      return;
    }
    for (const [k, v] of Object.entries(snap)) {
      if (v !== undefined) setValue(k as keyof StockFormValues, v as never, { shouldDirty: false });
    }
    toast.info("Selling prices reset");
  }, [setValue]);

  const handleSave = useCallback(async () => {
    if (isNew) {
      toast.error("Save the stock item first");
      return;
    }
    try {
      await saveMutation.mutateAsync(formToSaveSellPricesPayload(stockId, getValues()));
      snapshotRef.current = { ...getValues() };
      toast.success("Selling prices saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save selling prices");
    }
  }, [isNew, stockId, getValues, saveMutation]);

  const isPriceDisabled = useCallback(
    (group: string, currency: SellingCurrency) => {
      const catId = getValues(categoryIdField(group, currency));
      return !catId;
    },
    [getValues],
  );

  const roundedUpDisplay = Number(roundedUp ?? 0).toFixed(2);

  return {
    isNew,
    canSave: !isNew,
    exchangeRates,
    roundedUpDisplay,
    specialPriceCount: specialPricesQuery.data?.length ?? 0,
    handleIgnore,
    handleSave,
    isPriceDisabled,
    initFromSellingApi,
    isSaving: saveMutation.isPending,
    sellGbp: exchangeRates.gbp,
    sellEur: exchangeRates.eur,
    sellUsd: exchangeRates.usd,
  };
}
