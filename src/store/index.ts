import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  name: string;
  code: string;
  username: string;
  email: string;
  permissions: string[];
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** Flat permission names for guards (mirrors `user.permissions`). */
  permissions: string[];
  setUser: (user: AuthUser | null) => void;
  clear: () => void;
}

/**
 * Auth slice. The JWT itself lives in `authStorage` (localStorage seam) so
 * `http` can read it without subscribing — this store mirrors the user
 * profile + an `isAuthenticated` flag for the UI.
 */
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      permissions: [],
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          permissions: user?.permissions ?? [],
        }),
      clear: () => set({ user: null, isAuthenticated: false, permissions: [] }),
    }),
    { name: "joecool-auth" },
  ),
);

interface UiState {
  theme: "light" | "dark";
  density: "compact" | "cozy";
  sidebarCollapsed: boolean;
  settingsSidebarCollapsed: boolean;
  toggleTheme: () => void;
  setTheme: (t: "light" | "dark") => void;
  setDensity: (d: "compact" | "cozy") => void;
  toggleSidebar: () => void;
  toggleSettingsSidebar: () => void;
}
export const useUi = create<UiState>()(
  persist(
    (set) => ({
      theme: "light",
      density: "compact",
      sidebarCollapsed: false,
      settingsSidebarCollapsed: false,
      toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
      setTheme: (t) => set({ theme: t }),
      setDensity: (d) => set({ density: d }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      toggleSettingsSidebar: () =>
        set((s) => ({ settingsSidebarCollapsed: !s.settingsSidebarCollapsed })),
    }),
    {
      name: "joecool-ui",
      partialize: (state) => ({
        theme: state.theme,
        density: state.density,
        sidebarCollapsed: state.sidebarCollapsed,
        settingsSidebarCollapsed: state.settingsSidebarCollapsed,
      }),
    },
  ),
);
