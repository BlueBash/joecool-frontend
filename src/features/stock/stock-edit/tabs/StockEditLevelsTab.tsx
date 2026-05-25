import { toast } from "sonner";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { FormGrid } from "@/components/form-primitives";
import { FormNumberField } from "@/components/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { StockFormValues } from "../../stock-form-schema";
import { STOCK_FIELD_CLASS } from "../field-classes";

export function StockEditLevelsTab() {
  const { NUM } = STOCK_FIELD_CLASS;

  return (
    <TabsContent value="levels" className="mt-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <EditCard title="Balance Orders — Customer">
            <table className="w-full text-[12.5px]">
              <thead className="text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left py-1.5"></th>
                  {["Regular", "Codir", "Forecast", "Dropped"].map((h) => (
                    <th key={h} className="text-right px-2">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["Orders", "Qntys", "Values"].map((r) => (
                  <tr key={r} className="border-b border-border/60">
                    <td className="py-1.5 font-medium">{r}</td>
                    {[0, 1, 2, 3].map((i) => (
                      <td key={i} className="px-2 py-1">
                        <Input
                          className={`${NUM} text-right`}
                          defaultValue={r === "Values" ? "0.00" : "0"}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </EditCard>
          <EditCard title="Balance Orders — Supplier">
            <table className="w-full text-[12.5px]">
              <thead className="text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left py-1.5"></th>
                  {["Regular", "Codir", "Forecast", "Dropped"].map((h) => (
                    <th key={h} className="text-right px-2">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["Orders", "Qntys", "Values"].map((r) => (
                  <tr key={r} className="border-b border-border/60">
                    <td className="py-1.5 font-medium">{r}</td>
                    {[0, 1, 2, 3].map((i) => (
                      <td key={i} className="px-2 py-1">
                        <Input
                          className={`${NUM} text-right`}
                          defaultValue={r === "Values" ? "0.00" : "0"}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </EditCard>
        </div>
        <EditCard title="Stock Position">
          <FormGrid cols={2}>
            <FormNumberField<StockFormValues> name="warehouseLevels" label="Warehouse Levels" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="boxes" label="Boxes" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="stockAllocated" label="Stock Allocated" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="customerOrders" label="Customer Orders" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="transit" label="Transit" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="transitAllocated" label="Transit Allocated" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="supplierOrders" label="Supplier Orders" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="chinaCo" label="China/CO" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="shelf" label="Shelf" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="free" label="Free" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="available" label="Available" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="spare" label="Spare" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="supCodir" label="Sup CODIR" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="twelveMthSls" label="12 Mth Sls" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="stockSls" label="Stock/Sls" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="spareSls" label="Spare/Sls" inputClassName={NUM} />
          </FormGrid>
          <Button size="sm" className="mt-3 h-8 w-full" onClick={() => toast.success("Adjusted")}>
            Adjust
          </Button>
        </EditCard>
      </div>
    </TabsContent>
  );
}
