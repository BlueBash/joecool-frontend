import { getRouteApi } from "@tanstack/react-router";
import type { FieldPath } from "react-hook-form";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { FormGrid } from "@/components/form-primitives";
import { FormNumberField } from "@/components/form";
import { Button } from "@/components/ui/button";
import type { StockFormValues } from "../../stock-form-schema";
import { categoryIdField, perField, priceField, pctField } from "../selling/map-selling-prices";
import { useStockSellingTab } from "../selling/useStockSellingTab";
import type { SellingCurrency } from "../selling/selling-types";
import { STOCK_FIELD_CLASS } from "../field-classes";

const routeApi = getRouteApi("/stock/$id");

const SELLING_GROUPS = [
  { key: "whlsl", title: "WHLSL" },
  { key: "retail", title: "Retail" },
  { key: "amazon", title: "AMAZON" },
] as const;

const SELLING_CURS: { key: SellingCurrency; label: string }[] = [
  { key: "gbp", label: "GBP" },
  { key: "eur", label: "EUR" },
  { key: "usd", label: "USD" },
];

export function StockEditSellingTab() {
  const { id } = routeApi.useParams();
  const isNew = id === "new";
  const { NUM } = STOCK_FIELD_CLASS;
  const selling = useStockSellingTab(id, isNew);

  return (
    <TabsContent value="selling" className="mt-3">
      <div className="flex flex-wrap gap-2 mb-3">
        <Button
          size="sm"
          className="h-8"
          disabled={!selling.canSave || selling.isSaving}
          onClick={() => void selling.handleSave()}
        >
          Save Sell Price Changes
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          disabled={isNew}
          onClick={selling.handleIgnore}
        >
          Ignore Sell Price Changes
        </Button>
      </div>

      <EditCard title="Currency Rates (reference)">
        <FormGrid cols={3}>
          <FormNumberField<StockFormValues>
            name="sellGbp"
            label="GBP"
            step="0.0001"
            readOnly
            inputClassName={NUM}
          />
          <FormNumberField<StockFormValues>
            name="sellEur"
            label="EUR"
            step="0.0001"
            readOnly
            inputClassName={NUM}
          />
          <FormNumberField<StockFormValues>
            name="sellUsd"
            label="USD"
            step="0.0001"
            readOnly
            inputClassName={NUM}
          />
        </FormGrid>
        <p className="text-[12px] text-muted-foreground mt-2">
          Rounded-up ready cost from Cost tab drives %Age:{" "}
          <span className="font-medium tabular-nums">{selling.roundedUpDisplay}</span>
        </p>
      </EditCard>

      {SELLING_GROUPS.map((group) => (
        <EditCard key={group.key} title={group.title}>
          {SELLING_CURS.map((cur) => (
            <div
              key={cur.key}
              className="grid grid-cols-[60px_1fr_1fr_1fr] gap-2 items-end mb-2"
            >
              <div className="text-[12px] font-medium text-muted-foreground pb-1.5">
                {cur.label}:
              </div>
              <FormNumberField<StockFormValues>
                name={priceField(group.key, cur.key) as FieldPath<StockFormValues>}
                label="Price"
                step="0.01"
                disabled={selling.isPriceDisabled(group.key, cur.key)}
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues>
                name={perField(group.key, cur.key) as FieldPath<StockFormValues>}
                label="Per"
                disabled={selling.isPriceDisabled(group.key, cur.key)}
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues>
                name={pctField(group.key, cur.key) as FieldPath<StockFormValues>}
                label="%Age"
                step="0.01"
                readOnly
                inputClassName={NUM}
              />
            </div>
          ))}
        </EditCard>
      ))}

      <EditCard title="Special Price">
        <p className="text-[13px] text-muted-foreground">
          {isNew
            ? "Save the stock item to view special prices."
            : `${selling.specialPriceCount} special price record(s) for this stock.`}
        </p>
      </EditCard>
    </TabsContent>
  );
}
