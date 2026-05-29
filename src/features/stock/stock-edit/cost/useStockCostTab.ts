import { useCallback, useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { http } from "@/api/_client";
import { currencies } from "@/api/platform/catalogs";
import { stockCostPrices } from "@/api/stocks";
import { stocks } from "@/api/stocks";
import { supplierStockCostFactors } from "@/api/supplier-stock-cost-factors";
import { suppliers } from "@/api/suppliers";
import type { StockFormValues } from "../../stock-form-schema";
import { refId } from "../utils";
import { computeCostPrices } from "./cost-calculations";
import {
  applySupplierCostFactorDefaults,
  formToCostPricePatch,
  hasSupplierCostFactorData,
  mapCostPriceToForm,
} from "./map-cost-price";

export function useStockCostTab(stockId: string, isNew: boolean) {
  const { watch, setValue, getValues } = useFormContext<StockFormValues>();
  const baselineRef = useRef<Partial<StockFormValues> | null>(null);
  const prevSupplierIdRef = useRef<number | null | undefined>(undefined);

  const supplierId = watch("supplierId");
  const packagingId = watch("packagingId");
  const factCurrencyId = watch("factCurrencyId");
  const costPriceId = watch("costPriceId");

  const currenciesQuery = currencies.hooks.useList({ pageSize: 300 });

  const supplierQuery = suppliers.hooks.useDetail(
    supplierId != null ? String(supplierId) : ("" as never),
    { enabled: supplierId != null },
  );

  const supplierFactorFromDetail = supplierQuery.data?.supp_stock_cost_factor as
    | Record<string, unknown>
    | undefined;

  const supplierDefaultsQuery = supplierStockCostFactors.hooks.useSupplierDefaults(
    supplierId != null ? supplierId : undefined,
    {
      enabled:
        supplierId != null &&
        supplierQuery.isFetched &&
        !hasSupplierCostFactorData(supplierFactorFromDetail),
    },
  );

  const packagingAmountQuery = useQuery({
    queryKey: stocks.keys.actions("packaging-amount", {
      packagingId,
      factCurrencyId,
    }),
    queryFn: () =>
      stocks.api.stockPackagingAmount({
        packaging_stock_id: String(packagingId),
        current_currency_id: String(factCurrencyId),
      }),
    enabled: packagingId != null && factCurrencyId != null && !isNew,
  });

  const updateCostMutation = stockCostPrices.hooks.useUpdate();
  const updateFactorMutation = supplierStockCostFactors.hooks.useUpdate();

  const currencyOptions = useMemo(() => {
    return (currenciesQuery.data?.items ?? []).map((c) => ({
      id: Number(c.id),
      code: String(c.code ?? c.name ?? c.id).toUpperCase(),
      exchangeRate: Number(c.exchange_rate_buy ?? c.exchange_rate_gbp) || 0,
      costAdjust: Number(c.cost_adjust) || 0,
    }));
  }, [currenciesQuery.data?.items]);

  const resolveSupplierCostFactor = useCallback((): Record<string, unknown> | null => {
    const fromDetail = supplierQuery.data?.supp_stock_cost_factor;
    if (hasSupplierCostFactorData(fromDetail as Record<string, unknown> | undefined)) {
      return fromDetail as Record<string, unknown>;
    }
    return supplierDefaultsQuery.data ?? null;
  }, [supplierQuery.data?.supp_stock_cost_factor, supplierDefaultsQuery.data]);

  const restoreCostBaseline = useCallback(() => {
    const costRaw = getValues("costPriceRaw");
    const costPatch =
      baselineRef.current ??
      (costRaw && typeof costRaw === "object"
        ? mapCostPriceToForm(costRaw as Record<string, unknown>)
        : {});
    for (const [k, v] of Object.entries(costPatch)) {
      if (v !== undefined) setValue(k as keyof StockFormValues, v as never, { shouldDirty: false });
    }
  }, [getValues, setValue]);

  const applySupplierDefaults = useCallback(
    (force = false) => {
      const factor = resolveSupplierCostFactor();
      if (!factor) return;
      const supplier = supplierQuery.data;
      const fob =
        supplier?.fob_factor != null ? Number(supplier.fob_factor) || 0 : undefined;
      applySupplierCostFactorDefaults(setValue, getValues, factor, {
        force,
        supplierFobX: fob,
      });
    },
    [getValues, resolveSupplierCostFactor, setValue, supplierQuery.data],
  );

  useEffect(() => {
    const raw = getValues("costPriceRaw");
    if (raw && typeof raw === "object" && Object.keys(raw).length > 0) {
      baselineRef.current = mapCostPriceToForm(raw as Record<string, unknown>);
    }
  }, [stockId, getValues]);

  useEffect(() => {
    if (supplierId == null) {
      prevSupplierIdRef.current = null;
      return;
    }
    const factor = resolveSupplierCostFactor();
    if (!factor) return;

    const prev = prevSupplierIdRef.current;
    const supplierChanged = prev != null && prev !== supplierId;
    prevSupplierIdRef.current = supplierId;

    const hasSavedCost = getValues("costPriceId") != null;
    applySupplierDefaults(supplierChanged || !hasSavedCost);
  }, [
    supplierId,
    costPriceId,
    resolveSupplierCostFactor,
    applySupplierDefaults,
    getValues,
  ]);

  useEffect(() => {
    const data = packagingAmountQuery.data;
    if (!data || typeof data !== "object") return;
    const row = data as Record<string, unknown>;
    if (row.fact_card_cost != null) {
      setValue("packagingNewAmount", Number(row.fact_card_cost) || 0);
    }
    if (row.fact_card_code != null) {
      setValue("packagingName", String(row.fact_card_code));
    }
  }, [packagingAmountQuery.data, setValue]);

  useEffect(() => {
    if (!factCurrencyId || !currencyOptions.length) return;
    const cur = currencyOptions.find((c) => c.id === factCurrencyId);
    if (!cur) return;
    setValue("currencyCode", cur.code, { shouldDirty: false });
    setValue("currentRate", cur.exchangeRate, { shouldDirty: false });
    setValue("lastUsedXRate", cur.exchangeRate, { shouldDirty: false });
    setValue("buyAdjustPct", cur.costAdjust, { shouldDirty: false });
  }, [factCurrencyId, currencyOptions, setValue]);

  const calcInputs = watch([
    "factyCost",
    "factyPer",
    "factyAmount",
    "packagingNewAmount",
    "agentCommPct",
    "agentPackPct",
    "qualityPct",
    "probsPct",
    "chargesPct",
    "fobChargesPct",
    "jcPackingAmount",
    "freightPct",
    "currentRate",
    "buyAdjustPct",
    "ukDutyPct",
    "clearancePct",
    "deliveryPct",
    "assemblyAmount",
    "displayAmount",
    "gbpWhlsl",
  ]);

  useEffect(() => {
    const [
      factyCost,
      factyPer,
      factyAmount,
      packagingNewAmount,
      agentCommPct,
      agentPackPct,
      qualityPct,
      probsPct,
      chargesPct,
      fobChargesPct,
      jcPackingAmount,
      freightPct,
      currentRate,
      buyAdjustPct,
      ukDutyPct,
      clearancePct,
      deliveryPct,
      assemblyAmount,
      displayAmount,
      gbpWhlsl,
    ] = calcInputs;

    const result = computeCostPrices({
      factPrice: Number(factyCost) || 0,
      factPer: Number(factyPer) || 1,
      factyAmount: Number(factyAmount) || 0,
      factCardCost: Number(packagingNewAmount) || 0,
      fobComm: Number(agentCommPct) || 0,
      agentPackPct: Number(agentPackPct) || 0,
      fobQuality: Number(qualityPct) || 0,
      fobProblems: Number(probsPct) || 0,
      fobCharge: Number(chargesPct) || 0,
      fobAdminCharge: Number(fobChargesPct) || 0,
      jcPackingCost: Number(jcPackingAmount) || 0,
      freight: Number(freightPct) || 0,
      factExchRate: Number(currentRate) || 1,
      buyAdjust: Number(buyAdjustPct) || 0,
      ukDuty: Number(ukDutyPct) || 0,
      ukClearance: Number(clearancePct) || 0,
      ukDelivery: Number(deliveryPct) || 0,
      assemblyCost: Number(assemblyAmount) || 0,
      displayCost: Number(displayAmount) || 0,
      gbpWhlsl: Number(gbpWhlsl) || 0,
    });

    const updates: Partial<StockFormValues> = {
      firstCost: result.firstCost,
      factyInvd: result.factyInvd,
      agentBase: result.agentBase,
      agentAmount: result.agentAmount,
      agentCost: result.agentCost,
      agentPackAmount: result.agentPackAmount,
      fobBase: result.fobBase,
      qualityAmount: result.qualityAmount,
      probsAmount: result.probsAmount,
      chargesAmount: result.chargesAmount,
      fobChargesAmount: result.fobChargesAmount,
      itemOb: result.itemOb,
      jcObCost: result.jcObCost,
      freightAmount: result.freightAmount,
      arriveUk: result.arriveUk,
      calcFobX: result.calcFobX,
      effectiveRate: result.effectiveRate,
      upGbp: result.upGbp,
      ukDutyAmount: result.ukDutyAmount,
      dutyPaid: result.dutyPaid,
      clearanceAmount: result.clearanceAmount,
      ukLanded: result.ukLanded,
      deliveryAmount: result.deliveryAmount,
      delivered: result.delivered,
      assembled: result.assembled,
      calcReady: result.calcReady,
      roundedUp: result.roundedUp,
      storedReady: result.roundedUp,
      landedFactr: result.landedFactor,
      calcdMarkup: result.calcdMarkup,
      arriveUkRate: result.upGbp,
    };

    for (const [k, v] of Object.entries(updates)) {
      setValue(k as keyof StockFormValues, v as never, { shouldDirty: false });
    }
  }, [calcInputs, setValue]);

  const setCostBaselineFromApi = useCallback((cost: Record<string, unknown>) => {
    baselineRef.current = mapCostPriceToForm(cost);
    for (const [k, v] of Object.entries(baselineRef.current)) {
      if (v !== undefined) setValue(k as keyof StockFormValues, v as never, { shouldDirty: false });
    }
  }, [setValue]);

  const handleIgnore = useCallback(() => {
    restoreCostBaseline();
    toast.info("Cost fields reset to saved values");
  }, [restoreCostBaseline]);

  const handleReadSuppDefaults = useCallback(async () => {
    if (!supplierId) {
      toast.error("Select a supplier first");
      return;
    }
    await Promise.all([supplierQuery.refetch(), supplierDefaultsQuery.refetch()]);
    applySupplierDefaults(true);
    toast.success("Supplier defaults applied");
  }, [supplierId, supplierQuery, supplierDefaultsQuery, applySupplierDefaults]);

  const handleSaveCostPrices = useCallback(async () => {
    if (!costPriceId) {
      toast.error("Save the stock item first to create cost prices");
      return;
    }
    try {
      await updateCostMutation.mutateAsync({
        id: String(costPriceId),
        data: formToCostPricePatch(getValues()) as never,
      });
      toast.success("Stock cost prices saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save cost prices");
    }
  }, [costPriceId, getValues, updateCostMutation]);

  const handleSaveSuppDefaults = useCallback(async () => {
    const factorId = getValues("supplierCostFactorId");
    if (!factorId) {
      toast.error("No supplier cost factor on record");
      return;
    }
    const v = getValues();
    try {
      await updateFactorMutation.mutateAsync({
        id: String(factorId),
        data: {
          agentcommpct: v.agentCommPct,
          agentpackingchargepct: v.agentPackPct,
          chargespct: v.chargesPct,
          fobadminchargespct: v.fobChargesPct,
          freighttoukpct: v.freightPct,
          probspct: v.probsPct,
          qualitypct: v.qualityPct,
          ukclearpct: v.clearancePct,
          ukdeliverypct: v.deliveryPct,
          ukdutypct: v.ukDutyPct,
        },
      });
      toast.success("Supplier defaults saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save supplier defaults");
    }
  }, [getValues, updateFactorMutation]);

  const handleSaveFobX = useCallback(async () => {
    if (!supplierId) {
      toast.error("Select a supplier first");
      return;
    }
    const fob = getValues("supplierFobX");
    try {
      await http.put(`/suppliers/${supplierId}`, {
        supplier: { fob_factor: fob },
      });
      toast.success("Supplier FOB X saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save FOB X");
    }
  }, [supplierId, getValues]);

  const onDisplayCostChange = useCallback(
    (id: number, name: string, cost: number) => {
      setValue("costDisplaySettingId", refId(id), { shouldDirty: true });
      setValue("display", name, { shouldDirty: true });
      setValue("displayAmount", cost, { shouldDirty: true });
    },
    [setValue],
  );

  const onFactCurrencyChange = useCallback(
    (id: number) => {
      setValue("factCurrencyId", id, { shouldDirty: true });
    },
    [setValue],
  );

  return {
    isNew,
    canSaveCost: !isNew && costPriceId != null,
    currencyOptions,
    supplierId,
    handleIgnore,
    handleReadSuppDefaults,
    handleSaveCostPrices,
    handleSaveSuppDefaults,
    handleSaveFobX,
    onDisplayCostChange,
    onFactCurrencyChange,
    setCostBaselineFromApi,
    isSavingCost: updateCostMutation.isPending,
  };
}
