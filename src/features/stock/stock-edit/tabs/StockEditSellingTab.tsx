import type { StockItem } from "@/lib/types";
import type { StockEditTabProps } from "../types";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { Field, FormGrid } from "@/components/form-primitives";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { STOCK_FIELD_CLASS } from "../field-classes";

export function StockEditSellingTab(props: StockEditTabProps) {
  const { draft, set } = props;
  const { TXT, NUM, MONO } = STOCK_FIELD_CLASS;

  return (
    <TabsContent value="selling" className="mt-3">
            <EditCard title="Currency Rates">
              <FormGrid cols={3}>
                <Field label="GBP">
                  <Input
                    type="number"
                    step="0.01"
                    value={draft.sellGbp ?? 1}
                    onChange={(e) => set("sellGbp", Number(e.target.value))}
                    className={NUM}
                  />
                </Field>
                <Field label="EUR">
                  <Input
                    type="number"
                    step="0.01"
                    value={draft.sellEur ?? 1.22}
                    onChange={(e) => set("sellEur", Number(e.target.value))}
                    className={NUM}
                  />
                </Field>
                <Field label="USD">
                  <Input
                    type="number"
                    step="0.01"
                    value={draft.sellUsd ?? 1.27}
                    onChange={(e) => set("sellUsd", Number(e.target.value))}
                    className={NUM}
                  />
                </Field>
              </FormGrid>
            </EditCard>
            {(["whlsl", "retail", "amazon"] as const).map((group) => (
              <EditCard
                key={group}
                title={group === "whlsl" ? "WHLSL" : group === "retail" ? "Retail" : "AMAZON"}
              >
                {(["Gbp", "Eur", "Usd"] as const).map((cur) => (
                  <div key={cur} className="grid grid-cols-[60px_1fr_1fr_1fr] gap-2 items-end mb-2">
                    <div className="text-[12px] font-medium text-muted-foreground pb-1.5">
                      {cur.toUpperCase()}:
                    </div>
                    <Field label="Price">
                      <Input
                        type="number"
                        step="0.01"
                        value={(draft as any)[`${group}${cur}Price`] ?? 0}
                        onChange={(e) =>
                          set(
                            `${group}${cur}Price` as keyof StockItem,
                            Number(e.target.value) as never,
                          )
                        }
                        className={NUM}
                      />
                    </Field>
                    <Field label="Per">
                      <Input
                        type="number"
                        value={(draft as any)[`${group}${cur}Per`] ?? 1}
                        onChange={(e) =>
                          set(
                            `${group}${cur}Per` as keyof StockItem,
                            Number(e.target.value) as never,
                          )
                        }
                        className={NUM}
                      />
                    </Field>
                    <Field label="%Age">
                      <Input
                        type="number"
                        step="0.01"
                        value={(draft as any)[`${group}${cur}Pct`] ?? 0}
                        onChange={(e) =>
                          set(
                            `${group}${cur}Pct` as keyof StockItem,
                            Number(e.target.value) as never,
                          )
                        }
                        className={NUM}
                      />
                    </Field>
                  </div>
                ))}
              </EditCard>
            ))}
            <EditCard title="Special Price">
              <FormGrid cols={2}>
                <Field label="Exist">
                  <Input
                    type="number"
                    step="0.01"
                    value={draft.specialPrice ?? 0}
                    onChange={(e) => set("specialPrice", Number(e.target.value))}
                    className={NUM}
                  />
                </Field>
              </FormGrid>
            </EditCard>
    </TabsContent>
  );
}
