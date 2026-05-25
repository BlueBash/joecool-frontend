import type { FieldPath } from "react-hook-form";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { FormGrid } from "@/components/form-primitives";
import { FormNumberField } from "@/components/form";
import type { StockFormValues } from "../../stock-form-schema";
import { STOCK_FIELD_CLASS } from "../field-classes";

const SELLING_GROUPS = ["whlsl", "retail", "amazon"] as const;
const SELLING_CURS = ["Gbp", "Eur", "Usd"] as const;
const SELLING_SUFFIXES = ["Price", "Per", "Pct"] as const;

export function StockEditSellingTab() {
  const { NUM } = STOCK_FIELD_CLASS;

  return (
    <TabsContent value="selling" className="mt-3">
      <EditCard title="Currency Rates">
        <FormGrid cols={3}>
          <FormNumberField<StockFormValues> name="sellGbp" label="GBP" step="0.01" inputClassName={NUM} />
          <FormNumberField<StockFormValues> name="sellEur" label="EUR" step="0.01" inputClassName={NUM} />
          <FormNumberField<StockFormValues> name="sellUsd" label="USD" step="0.01" inputClassName={NUM} />
        </FormGrid>
      </EditCard>
      {SELLING_GROUPS.map((group) => (
        <EditCard
          key={group}
          title={group === "whlsl" ? "WHLSL" : group === "retail" ? "Retail" : "AMAZON"}
        >
          {SELLING_CURS.map((cur) => (
            <div key={cur} className="grid grid-cols-[60px_1fr_1fr_1fr] gap-2 items-end mb-2">
              <div className="text-[12px] font-medium text-muted-foreground pb-1.5">
                {cur.toUpperCase()}:
              </div>
              {SELLING_SUFFIXES.map((suffix) => {
                const name = `${group}${cur}${suffix}` as FieldPath<StockFormValues>;
                const label = suffix === "Price" ? "Price" : suffix === "Per" ? "Per" : "%Age";
                const step = suffix === "Per" ? undefined : "0.01";
                return (
                  <FormNumberField<StockFormValues>
                    key={suffix}
                    name={name}
                    label={label}
                    step={step}
                    inputClassName={NUM}
                  />
                );
              })}
            </div>
          ))}
        </EditCard>
      ))}
      <EditCard title="Special Price">
        <FormGrid cols={2}>
          <FormNumberField<StockFormValues>
            name="specialPrice"
            label="Exist"
            step="0.01"
            inputClassName={NUM}
          />
        </FormGrid>
      </EditCard>
    </TabsContent>
  );
}
