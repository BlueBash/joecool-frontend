import type { UserRow, UserWritePayload } from "@/api/users";
import type { Operator } from "@/lib/types";

function str(v: unknown, fallback = ""): string {
  if (v == null) return fallback;
  return String(v);
}

function mapRole(raw: unknown): Operator["role"] {
  const name = str(raw);
  if (name === "Admin") return "Admin";
  if (name === "Manager" || name.includes("Manager")) return "Manager";
  if (name === "Viewer") return "Viewer";
  return "Staff";
}

function formatLastSeen(updatedAt?: string): string {
  if (!updatedAt) return "—";
  const d = new Date(updatedAt);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Maps a flattened user row into the UI operator model. */
export function mapRowToOperator(row: UserRow): Operator {
  const roles = Array.isArray(row.roles) ? row.roles : [];
  const primaryRole = roles[0] ?? row.role ?? row.name;

  return {
    id: str(row.id),
    code: str(row.code),
    name: str(row.name),
    email: str(row.email),
    role: mapRole(primaryRole),
    active: true,
    lastSeen: formatLastSeen(row.updated_at as string | undefined),
  };
}

export function operatorToPayload(
  operator: Operator,
  options?: { password?: string; permissions?: string[]; roles?: string[] },
): UserWritePayload {
  return {
    name: operator.name,
    code: operator.code || null,
    email: operator.email || null,
    password: options?.password,
    password_confirmation: options?.password,
    roles: options?.roles ?? [operator.role],
    permissions: options?.permissions,
  };
}
