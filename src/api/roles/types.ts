import type { JsonApiRow } from "@/api/_client";

export type RoleRow = JsonApiRow;

export type RoleWritePayload = Record<string, unknown> & { name: string };
