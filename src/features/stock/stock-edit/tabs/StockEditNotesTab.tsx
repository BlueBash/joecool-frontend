import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { FormTextareaField } from "@/components/form";
import type { StockFormValues } from "../../stock-form-schema";
import { StockItemCodeField } from "../form-helpers";

export function StockEditNotesTab() {
  return (
    <TabsContent value="notes" className="mt-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EditCard title="General Stock Item Notes">
          <StockItemCodeField />
          <FormTextareaField<StockFormValues>
            name="notes"
            minHeightClass="min-h-[140px]"
            className="mt-2"
          />
        </EditCard>
        <EditCard title="Stock Item Supplier Notes">
          <StockItemCodeField />
          <FormTextareaField<StockFormValues>
            name="wholesaleBlurb"
            minHeightClass="min-h-[140px]"
            className="mt-2"
          />
        </EditCard>
      </div>
    </TabsContent>
  );
}
