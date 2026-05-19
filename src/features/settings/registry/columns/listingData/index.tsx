import { addressListingData } from "./address";
import { messagesListingData } from "./messages";
import { priceListingData } from "./price";
import { createBuildSettingListingColumns, type ListingColumn } from "./shared";
import { stockListingData } from "./stock";
import { systemListingData } from "./system";

export const SettingsModuleListingData: Record<string, ListingColumn[]> = {
  ...stockListingData,
  ...priceListingData,
  ...addressListingData,
  ...messagesListingData,
  ...systemListingData,
};

export const buildSettingListingColumns = createBuildSettingListingColumns(
  SettingsModuleListingData,
);

export { settingDataList, col } from "./shared";
export type { ListingColumn } from "./shared";
