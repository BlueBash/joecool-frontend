import { createJsonApiResource } from "@/api/_client";
import type { UserRow, UserWritePayload } from "./types";

export const USER_INCLUDE = "permissions,roles";

export const users = createJsonApiResource<UserRow, UserWritePayload>(
  ["users"],
  "/users",
  "user",
  {
    defaultListParams: { include: USER_INCLUDE },
    defaultDetailParams: { include: USER_INCLUDE },
  },
);
