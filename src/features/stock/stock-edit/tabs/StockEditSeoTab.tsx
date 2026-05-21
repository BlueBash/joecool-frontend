import type { StockEditTabProps } from "../types";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { Field, FormGrid } from "@/components/form-primitives";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { STOCK_FIELD_CLASS } from "../field-classes";

export function StockEditSeoTab(props: StockEditTabProps) {
  const { draft, set } = props;
  const { TXT, NUM, MONO } = STOCK_FIELD_CLASS;

  return (
    <TabsContent value="seo" className="mt-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <EditCard title="Wholesale Blurb">
                <Field label="Item">
                  <Input value={draft.code} disabled className={MONO} />
                </Field>
                <textarea
                  className="w-full min-h-[140px] mt-2 p-2 rounded-md border border-border bg-background text-[13px] resize-y"
                  value={draft.wholesaleBlurb ?? ""}
                  onChange={(e) => set("wholesaleBlurb", e.target.value)}
                />
              </EditCard>
              <EditCard title="Consumer Blurb">
                <Field label="Item">
                  <Input value={draft.code} disabled className={MONO} />
                </Field>
                <textarea
                  className="w-full min-h-[140px] mt-2 p-2 rounded-md border border-border bg-background text-[13px] resize-y"
                  value={draft.consumerBlurb ?? ""}
                  onChange={(e) => set("consumerBlurb", e.target.value)}
                />
              </EditCard>
            </div>
            <EditCard title="SEO">
              <Field label="Keywords" hint="Use : as separator">
                <Input
                  value={draft.seoKeywords ?? ""}
                  onChange={(e) => set("seoKeywords", e.target.value)}
                  className={TXT}
                />
              </Field>
            </EditCard>
    </TabsContent>
  );
}
