import { FLAG_CODES, MATERIAL_FLAGS } from "../constants";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { StockFlagCodeCheckbox } from "../form-helpers";

export function StockEditFlagsTab() {
  return (
    <TabsContent value="flags" className="mt-3">
      <EditCard title="Flag Codes">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {FLAG_CODES.map((f) => (
            <StockFlagCodeCheckbox key={f.code} code={f.code} label={f.label} />
          ))}
        </div>
      </EditCard>
      <EditCard title="Materials">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {MATERIAL_FLAGS.map((f) => (
            <StockFlagCodeCheckbox key={f.code} code={f.code} label={f.label} />
          ))}
        </div>
      </EditCard>
    </TabsContent>
  );
}
