import { createJsonApiResource } from "@/api/_client";
import type { ShowKitItemRow, ShowKitItemWritePayload } from "./types";

export const SHOW_KIT_ITEM_INCLUDE = "stock,show_kit,show_kit_bay";

export const showKitItems = createJsonApiResource<ShowKitItemRow, ShowKitItemWritePayload>(
  ["show-kit-items"],
  "/show_kit_items",
  "show_kit_item",
  {
    defaultListParams: { include: SHOW_KIT_ITEM_INCLUDE },
    defaultDetailParams: { include: SHOW_KIT_ITEM_INCLUDE },
  },
);
