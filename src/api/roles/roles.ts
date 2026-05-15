import { createJsonApiResource } from "@/api/_client";
import type { RoleRow, RoleWritePayload } from "./types";

export const roles = createJsonApiResource<RoleRow, RoleWritePayload>(
  ["roles"],
  "/roles",
  "role",
);
