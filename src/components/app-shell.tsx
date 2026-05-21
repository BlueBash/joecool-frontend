import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Boxes,
  MapPin,
  ShoppingCart,
  ArrowLeftRight,
  BarChart3,
  Users,
  Clock,
  Settings,
  Search,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeft,
  LogIn,
  Copy,
  LogOut,
} from "lucide-react";
import { useUi, useAuth } from "@/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { paths } from "@/lib/config/paths";
import { authStorage, useLogoutMutation } from "@/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav = [
  { to: paths.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { to: paths.stocks, label: "Stock", icon: Boxes },
  { to: paths.addresses, label: "Addresses", icon: MapPin },
  { to: paths.orders, label: "Orders", icon: ShoppingCart },
  { to: paths.transactions, label: "Transactions", icon: ArrowLeftRight },
  { to: paths.reports, label: "Reports", icon: BarChart3 },
  { to: paths.operators, label: "Operators", icon: Users },
  { to: paths.timekeeping, label: "Time", icon: Clock },
  { to: paths.settings, label: "Settings", icon: Settings },
] as const;

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { theme, sidebarCollapsed, toggleTheme, toggleSidebar, setTheme } = useUi();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user, clear: clearAuth } = useAuth();

  const logout = useLogoutMutation();

  const handleLogout = () => {
    const token = authStorage.getAccessToken();
    const finish = () => {
      authStorage.clear();
      clearAuth();
      toast.success("Signed out");
      navigate({ to: paths.login, replace: true });
    };
    if (!token) {
      finish();
      return;
    }
    logout.mutate(
      { token },
      {
        onSettled: finish,
        onError: (err) => {
          // The local clear still runs in onSettled. Just surface why server logout failed.
          if (err.message) toast.error(err.message);
        },
      },
    );
  };

  const displayName = user?.name ?? user?.username ?? user?.email ?? "Account";
  const avatarInitial = (displayName || "?").charAt(0).toUpperCase();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Sync OS theme on first mount only (when localStorage hadn't been set)
  useEffect(() => {
    if (!localStorage.getItem("joecool-ui")) {
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(dark ? "dark" : "light");
    }
  }, [setTheme]);

  return (
    <main className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <aside
        className={cn(
          "shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 hidden md:flex flex-col",
          sidebarCollapsed ? "w-14" : "w-46",
        )}
      >
        <div
          className={cn(
            "flex h-12 items-center gap-2 px-3 border-b border-sidebar-border",
            sidebarCollapsed && "justify-center px-0",
          )}
        >
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-primary to-info grid place-items-center text-primary-foreground font-bold text-xs">
            JC
          </div>
          {!sidebarCollapsed && <span className="font-semibold tracking-tight">Joe Cool</span>}
        </div>
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto scrollbar-thin">
          {nav.map((item) => {
            const isActive =
              item.to === paths.dashboard
                ? path === paths.home ||
                  path === paths.dashboard ||
                  path.startsWith(`${paths.dashboard}/`)
                : item.to === paths.stocks
                  ? path === paths.stocks || path.startsWith("/stock/")
                  : item.to === paths.addresses
                    ? path === paths.addresses || path.startsWith("/address/")
                    : item.to === paths.orders
                      ? path === paths.orders || path.startsWith("/order/")
                      : item.to === paths.operators
                        ? path === paths.operators || path.startsWith("/operator/")
                        : item.to === paths.transactions
                          ? path === paths.transactions ||
                            path.startsWith(`${paths.transactions}/`) ||
                            path.startsWith("/transaction/")
                          : path === item.to || path.startsWith(`${item.to}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  sidebarCollapsed && "justify-center px-0",
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-sidebar-border">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center h-8 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/70"
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 shrink-0 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center gap-3 px-3 sticky top-0 z-20">
          <div className="md:hidden h-7 w-7 rounded-md bg-gradient-to-br from-primary to-info grid place-items-center text-primary-foreground font-bold text-xs">
            JC
          </div>
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Jump to code, name, or order ref…"
              className="pl-8 h-8 text-[13px]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  toast.success(`Searching for "${(e.target as HTMLInputElement).value}"`);
                }
              }}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 hidden sm:flex"
            onClick={() => toast.success("Checked in")}
          >
            <LogIn className="h-3.5 w-3.5" /> Check In/Out
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/80 to-info/80 grid place-items-center text-primary-foreground text-xs font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Open user menu"
              >
                {avatarInitial}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-0.5">
                  <span className="text-sm font-medium">{displayName}</span>
                  {user?.email && (
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={handleLogout}
                disabled={logout.isPending}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{logout.isPending ? "Signing out…" : "Sign out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </main>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-2 border-b border-border bg-background sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {/* {description && <p className="text-[13px] text-muted-foreground mt-0.5">{description}</p>} */}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

interface CopyableCodeProps {
  value: string;
  className?: string;
}

export function CopyableCode({ value, className }: CopyableCodeProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard?.writeText(value);
        toast.success(`Copied ${value}`);
      }}
      className={cn(
        "group inline-flex items-center gap-1 text-code text-foreground/90 hover:text-primary transition-colors",
        className,
      )}
      title={`Copy ${value}`}
    >
      <span>{value}</span>
      <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
