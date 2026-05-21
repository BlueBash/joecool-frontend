import type { StockEditTabProps } from "../types";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";

export function StockEditKitsTab(_props: StockEditTabProps) {

  return (
    <TabsContent value="kits" className="mt-3">
            <EditCard title="Kits">
              <table className="w-full text-[13px]">
                <thead className="text-[11.5px] uppercase text-muted-foreground border-b border-border">
                  <tr>
                    {[
                      "Show Kit",
                      "Bay",
                      "Bay Name",
                      "Board",
                      "Position",
                      "Stock Code",
                      "Pieces",
                    ].map((h) => (
                      <th key={h} className="text-left font-medium pb-1.5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground text-[12.5px]"
                    >
                      No kits assigned.
                    </td>
                  </tr>
                </tbody>
              </table>
            </EditCard>
    </TabsContent>
  );
}
