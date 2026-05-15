import type { JsonApiRow } from "@/api/_client";

export type UserRow = JsonApiRow & {
  email?: string | null;
  roles?: string[];
  permissions?: string[];
  flag_hourly?: boolean | null;
  updated_at?: string;
};

export type UserWritePayload = Record<string, unknown> & {
  name: string;
  code?: string | null;
  email?: string | null;
  password?: string;
  password_confirmation?: string;
  roles?: string[];
  permissions?: string[];
};
