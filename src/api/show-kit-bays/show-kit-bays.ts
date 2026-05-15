import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJsonApiResource, createResourceKeys, http } from "@/api/_client";
import type { ID } from "@/api/_client";
import type { ApiError } from "@/api/_client/errors";
import type { ShowKitBayRow, ShowKitBayWritePayload } from "./types";

export const SHOW_KIT_BAY_INCLUDE = "show_kit";

const baysBase = createJsonApiResource<ShowKitBayRow, ShowKitBayWritePayload>(
  ["show-kit-bays"],
  "/show_kit_bays",
  "show_kit_bay",
  {
    defaultListParams: { include: SHOW_KIT_BAY_INCLUDE },
    defaultDetailParams: { include: SHOW_KIT_BAY_INCLUDE },
  },
);

const bayKeys = createResourceKeys(["show-kit-bays"]);

export interface ImportShowKitItemsResult {
  message: string;
  errors?: string[];
}

async function importShowKitItems(bayId: ID, file: File) {
  const form = new FormData();
  form.append("import_file", file);
  const res = await http.post<ImportShowKitItemsResult>(
    `/show_kit_bays/${bayId}/import_show_kit_items`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res.data;
}

export const showKitBays = {
  ...baysBase,
  api: {
    ...baysBase.api,
    importShowKitItems,
  },
  hooks: {
    ...baysBase.hooks,
    useImportShowKitItems: () => {
      const qc = useQueryClient();
      return useMutation<ImportShowKitItemsResult, ApiError, { bayId: ID; file: File }>({
        mutationFn: ({ bayId, file }) => importShowKitItems(bayId, file),
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: bayKeys.all() });
          qc.invalidateQueries({ queryKey: createResourceKeys(["show-kit-items"]).all() });
        },
      });
    },
  },
};
