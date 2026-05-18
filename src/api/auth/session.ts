import { users, USER_INCLUDE } from "@/api/users";
import { extractPermissionNames } from "@/lib/auth-permissions";
import type { AuthUser } from "@/store";

export interface UserSession {
  user: AuthUser;
  permissions: string[];
}

export async function fetchUserSession(userId: string): Promise<UserSession> {
  const row = await users.api.detail(userId, { include: USER_INCLUDE });
  const record = row as Record<string, unknown>;
  const permissions = extractPermissionNames(record);
  const user: AuthUser = {
    id: String(record.id ?? userId),
    name: String(record.name ?? ""),
    code: String(record.code ?? ""),
    username: String(record.username ?? record.name ?? ""),
    email: String(record.email ?? ""),
    permissions,
  };
  return { user, permissions };
}
