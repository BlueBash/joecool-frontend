import { getRouteApi } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { FormGrid } from "@/components/form-primitives";
import { FormNumberField } from "@/components/form";
import { Button } from "@/components/ui/button";
import type { StockFormValues } from "../../stock-form-schema";
import { BalanceOrdersTable } from "../levels/BalanceOrdersGrid";
import { useOrderKindSummary } from "../levels/useOrderKindSummary";
import { STOCK_FIELD_CLASS } from "../field-classes";

const routeApi = getRouteApi("/stock/$id");

export function StockEditLevelsTab() {
  const { id } = routeApi.useParams();
  const isNew = id === "new";
  const { NUM } = STOCK_FIELD_CLASS;
  const summary = useOrderKindSummary(id, !isNew);

  return (
    <TabsContent value="levels" className="mt-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {isNew ? (
            <EditCard title="Balance Orders">
              <p className="text-[13px] text-muted-foreground">
                Save the stock item to load order balances.
              </p>
            </EditCard>
          ) : summary.isPending ? (
            <EditCard title="Balance Orders">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading order summary…
              </div>
            </EditCard>
          ) : (
            <>
              <EditCard title="Balance Orders — Customer">
                <BalanceOrdersTable grid={summary.grids.customer} />
              </EditCard>
              <EditCard title="Balance Orders — Supplier">
                <BalanceOrdersTable grid={summary.grids.supplier} />
              </EditCard>
            </>
          )}
        </div>
        <EditCard title="Stock Position">
          <p className="text-[12px] text-muted-foreground mb-3">
            Warehouse position fields are placeholders until stock position APIs are wired.
          </p>
          <FormGrid cols={2}>
            <FormNumberField<StockFormValues>
              name="warehouseLevels"
              label="Warehouse Levels"
              readOnly
              inputClassName={NUM}
            />
            <FormNumberField<StockFormValues> name="boxes" label="Boxes" readOnly inputClassName={NUM} />
            <FormNumberField<StockFormValues>
              name="stockAllocated"
              label="Stock Allocated"
              readOnly
              inputClassName={NUM}
            />
            <FormNumberField<StockFormValues>
              name="customerOrders"
              label="Customer Orders"
              readOnly
              inputClassName={NUM}
            />
            <FormNumberField<StockFormValues> name="transit" label="Transit" readOnly inputClassName={NUM} />
            <FormNumberField<StockFormValues>
              name="transitAllocated"
              label="Transit Allocated"
              readOnly
              inputClassName={NUM}
            />
            <FormNumberField<StockFormValues>
              name="supplierOrders"
              label="Supplier Orders"
              readOnly
              inputClassName={NUM}
            />
            <FormNumberField<StockFormValues> name="chinaCo" label="China/CO" readOnly inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="shelf" label="Shelf" readOnly inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="free" label="Free" readOnly inputClassName={NUM} />
            <FormNumberField<StockFormValues>
              name="available"
              label="Available"
              readOnly
              inputClassName={NUM}
            />
            <FormNumberField<StockFormValues> name="spare" label="Spare" readOnly inputClassName={NUM} />
          </FormGrid>
          <Button size="sm" className="mt-3 h-8 w-full" variant="outline" disabled>
            Adjust
          </Button>
        </EditCard>
      </div>
    </TabsContent>
  );
}
