import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockImagesTab } from "../StockImagesTab";
import { STOCK_EDIT_TABS } from "./constants";
import type {
  StockEditFlagsTabProps,
  StockEditImagesTabProps,
  StockEditMakeupTabProps,
  StockEditTabProps,
} from "./types";
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
  tabProps: StockEditTabProps;
  makeupTabProps: StockEditMakeupTabProps;
  flagsTabProps: StockEditFlagsTabProps;
  imagesTabProps: StockEditImagesTabProps;
};

export function StockEditTabs({
  tabProps,
  makeupTabProps,
  flagsTabProps,
  imagesTabProps,
}: StockEditTabsProps) {
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
        <StockImagesTab {...imagesTabProps} />
      </TabsContent>
      <StockEditSeoTab {...tabProps} />
      <StockEditSupplierTab {...tabProps} />
      <StockEditLevelsTab {...tabProps} />
      <StockEditCostTab {...tabProps} />
      <StockEditSellingTab {...tabProps} />
      <StockEditFlagsTab {...flagsTabProps} />
      <StockEditNotesTab {...tabProps} />
      <StockEditDetailsTab {...tabProps} />
      <StockEditKitsTab {...tabProps} />
    </Tabs>
  );
}
