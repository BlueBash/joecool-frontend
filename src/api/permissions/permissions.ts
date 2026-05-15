import { createJsonApiResource } from "@/api/_client";
import type { PermissionRow, PermissionWritePayload } from "./types";

export const permissions = createJsonApiResource<PermissionRow, PermissionWritePayload>(
  ["permissions"],
  "/permissions",
  "permission",
);
