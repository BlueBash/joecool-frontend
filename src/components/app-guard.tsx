import { ReactNode } from "react";
import { useAuth } from "@/store";

interface AppGuardProps {
  checkName: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function AppGuard({ checkName, children, fallback = null }: AppGuardProps) {
  const permissions = useAuth((s) => s.permissions);
  const hasPermission =
    permissions.length === 0 || permissions.includes(checkName);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}