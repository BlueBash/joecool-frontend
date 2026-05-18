/** Normalizes permission names from a user detail row. */
export function extractPermissionNames(row: Record<string, unknown> | undefined): string[] {
  if (!row) return [];
  const raw = row.permissions;
  if (!Array.isArray(raw)) return [];
  const names: string[] = [];
  for (const p of raw) {
    if (typeof p === "string") {
      names.push(p);
      continue;
    }
    if (p && typeof p === "object") {
      const name = (p as { name?: unknown }).name;
      if (typeof name === "string") names.push(name);
    }
  }
  return [...new Set(names)];
}

export function hasPermission(permissions: string[], check: string): boolean {
  if (permissions.length === 0) return true;
  return permissions.includes(check);
}
