import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { FormTextareaField } from "@/components/form";
import type { StockFormValues } from "../../stock-form-schema";

export function StockEditNotesTab() {
  return (
    <TabsContent value="notes" className="mt-3">
      <EditCard title="General / Supplier Notes">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormTextareaField<StockFormValues>
            name="notes"
            label="General Stock Item Notes"
            rows={4}
            minHeightClass=""
            className="[&_textarea]:mt-2"
          />
          <FormTextareaField<StockFormValues>
            name="supplierNotes"
            label="Stock Item Supplier Notes"
            rows={4}
            minHeightClass=""
            className="[&_textarea]:mt-2"
          />
        </div>
      </EditCard>
    </TabsContent>
  );
}
