import { FLAG_CODES, MATERIAL_FLAGS } from "../constants";
import type { StockEditFlagsTabProps } from "../types";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";

export function StockEditFlagsTab(props: StockEditFlagsTabProps) {
  const { draft, setFlag } = props;

  return (
    <TabsContent value="flags" className="mt-3">
            <EditCard title="Flag Codes">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {FLAG_CODES.map((f) => (
                  <label
                    key={f.code}
                    className="flex items-center gap-2 px-2 py-1.5 rounded border border-border hover:bg-accent cursor-pointer text-[13px]"
                  >
                    <input
                      type="checkbox"
                      checked={!!draft.flagCodes?.[f.code]}
                      onChange={(e) => setFlag(f.code, e.target.checked)}
                    />
                    <span className="text-muted-foreground">({f.code})</span> {f.label}
                  </label>
                ))}
              </div>
            </EditCard>
            <EditCard title="Materials">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {MATERIAL_FLAGS.map((f) => (
                  <label
                    key={f.code}
                    className="flex items-center gap-2 px-2 py-1.5 rounded border border-border hover:bg-accent cursor-pointer text-[13px]"
                  >
                    <input
                      type="checkbox"
                      checked={!!draft.flagCodes?.[f.code]}
                      onChange={(e) => setFlag(f.code, e.target.checked)}
                    />
                    <span className="text-muted-foreground">({f.code})</span> {f.label}
                  </label>
                ))}
              </div>
            </EditCard>
    </TabsContent>
  );
}
