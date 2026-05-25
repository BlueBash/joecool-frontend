import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockImagesTab } from "../StockImagesTab";
import { STOCK_EDIT_TABS } from "./constants";
import type { StockEditMakeupTabProps } from "./types";
import {
  StockEditCostTab,
  StockEditDetailsTab,
  StockEditFlagsTab,
  StockEditKitsTab,
  StockEditLevelsTab,
  StockEditMakeupTab,
  StockEditNotesTab,
  StockEditSellingTab,
  StockEditSeoTab,
  StockEditSupplierTab,
} from "./tabs";

type StockEditTabsProps = {
  makeupTabProps: StockEditMakeupTabProps;
};

export function StockEditTabs({ makeupTabProps }: StockEditTabsProps) {
  return (
    <Tabs defaultValue="makeup" className="w-full">
      <TabsList className="bg-transparent p-0 h-auto border-b border-border rounded-none w-full justify-start gap-1 flex-wrap">
        {STOCK_EDIT_TABS.map(([v, l]) => (
          <TabsTrigger
            key={v}
            value={v}
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3 h-9 text-[13px]"
          >
            {l}
          </TabsTrigger>
        ))}
      </TabsList>

      <StockEditMakeupTab {...makeupTabProps} />
      <TabsContent value="images" className="mt-3">
        <StockImagesTab />
      </TabsContent>
      <StockEditSeoTab />
      <StockEditSupplierTab />
      <StockEditLevelsTab />
      <StockEditCostTab />
      <StockEditSellingTab />
      <StockEditFlagsTab />
      <StockEditNotesTab />
      <StockEditDetailsTab />
      <StockEditKitsTab />
    </Tabs>
  );
}
