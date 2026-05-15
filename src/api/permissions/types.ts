import type { JsonApiRow } from "@/api/_client";

export type PermissionRow = JsonApiRow;

export type PermissionWritePayload = Record<string, unknown> & { name: string };
