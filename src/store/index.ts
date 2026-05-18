import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  stocks, addresses, orders, transactions, operators, timeEntries, settingsCatalog,
} from "@/mock/seed";
import type {
  StockItem, Address, Order, Transaction, Operator, TimeEntry, SettingItem,
} from "@/lib/types";

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

type CrudActions<T extends { id: string }> = {
  add: (item: T) => void;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
  bulkUpdate: (ids: string[], patch: Partial<T>) => void;
};

interface StockState extends CrudActions<StockItem> { items: StockItem[]; }
export const useStocks = create<StockState>()(
  persist(
    (set) => ({
      items: stocks,
      add: (it) => set((s) => ({ items: [it, ...s.items] })),
      update: (id, patch) => set((s) => ({ items: s.items.map(i => i.id === id ? { ...i, ...patch } : i) })),
      remove: (id) => set((s) => ({ items: s.items.filter(i => i.id !== id) })),
      bulkUpdate: (ids, patch) => set((s) => ({ items: s.items.map(i => ids.includes(i.id) ? { ...i, ...patch } : i) })),
    }),
    { name: "joecool-stocks" },
  ),
);

interface AddressState extends CrudActions<Address> { items: Address[]; }
export const useAddresses = create<AddressState>()(
  persist(
    (set) => ({
      items: addresses,
      add: (it) => set((s) => ({ items: [it, ...s.items] })),
      update: (id, patch) => set((s) => ({ items: s.items.map(i => i.id === id ? { ...i, ...patch } : i) })),
      remove: (id) => set((s) => ({ items: s.items.filter(i => i.id !== id) })),
      bulkUpdate: (ids, patch) => set((s) => ({ items: s.items.map(i => ids.includes(i.id) ? { ...i, ...patch } : i) })),
    }),
    { name: "joecool-addresses" },
  ),
);

interface OrderState extends CrudActions<Order> { items: Order[]; }
export const useOrders = create<OrderState>()(
  persist(
    (set) => ({
      items: orders,
      add: (it) => set((s) => ({ items: [it, ...s.items] })),
      update: (id, patch) => set((s) => ({ items: s.items.map(i => i.id === id ? { ...i, ...patch } : i) })),
      remove: (id) => set((s) => ({ items: s.items.filter(i => i.id !== id) })),
      bulkUpdate: (ids, patch) => set((s) => ({ items: s.items.map(i => ids.includes(i.id) ? { ...i, ...patch } : i) })),
    }),
    { name: "joecool-orders" },
  ),
);

interface TxnState extends CrudActions<Transaction> { items: Transaction[]; }
export const useTxns = create<TxnState>()(
  persist(
    (set) => ({
      items: transactions,
      add: (it) => set((s) => ({ items: [it, ...s.items] })),
      update: (id, patch) => set((s) => ({ items: s.items.map(i => i.id === id ? { ...i, ...patch } : i) })),
      remove: (id) => set((s) => ({ items: s.items.filter(i => i.id !== id) })),
      bulkUpdate: (ids, patch) => set((s) => ({ items: s.items.map(i => ids.includes(i.id) ? { ...i, ...patch } : i) })),
    }),
    { name: "joecool-txns" },
  ),
);

interface OperatorState extends CrudActions<Operator> { items: Operator[]; }
export const useOperators = create<OperatorState>()(
  persist(
    (set) => ({
      items: operators,
      add: (it) => set((s) => ({ items: [it, ...s.items] })),
      update: (id, patch) => set((s) => ({ items: s.items.map(i => i.id === id ? { ...i, ...patch } : i) })),
      remove: (id) => set((s) => ({ items: s.items.filter(i => i.id !== id) })),
      bulkUpdate: (ids, patch) => set((s) => ({ items: s.items.map(i => ids.includes(i.id) ? { ...i, ...patch } : i) })),
    }),
    { name: "joecool-operators" },
  ),
);

interface TimeState extends CrudActions<TimeEntry> { items: TimeEntry[]; }
export const useTime = create<TimeState>()(
  persist(
    (set) => ({
      items: timeEntries,
      add: (it) => set((s) => ({ items: [it, ...s.items] })),
      update: (id, patch) => set((s) => ({ items: s.items.map(i => i.id === id ? { ...i, ...patch } : i) })),
      remove: (id) => set((s) => ({ items: s.items.filter(i => i.id !== id) })),
      bulkUpdate: (ids, patch) => set((s) => ({ items: s.items.map(i => ids.includes(i.id) ? { ...i, ...patch } : i) })),
    }),
    { name: "joecool-time" },
  ),
);

interface SettingsState {
  catalogs: Record<string, SettingItem[]>;
  add: (section: string, item: SettingItem) => void;
  update: (section: string, id: string, patch: Partial<SettingItem>) => void;
  remove: (section: string, id: string) => void;
}
export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      catalogs: settingsCatalog,
      add: (section, item) => set((s) => ({
        catalogs: { ...s.catalogs, [section]: [item, ...(s.catalogs[section] ?? [])] },
      })),
      update: (section, id, patch) => set((s) => ({
        catalogs: { ...s.catalogs, [section]: (s.catalogs[section] ?? []).map(i => i.id === id ? { ...i, ...patch } : i) },
      })),
      remove: (section, id) => set((s) => ({
        catalogs: { ...s.catalogs, [section]: (s.catalogs[section] ?? []).filter(i => i.id !== id) },
      })),
    }),
    { name: "joecool-settings" },
  ),
);

interface UiState {
  theme: "light" | "dark";
  density: "compact" | "cozy";
  sidebarCollapsed: boolean;
  toggleTheme: () => void;
  setTheme: (t: "light" | "dark") => void;
  setDensity: (d: "compact" | "cozy") => void;
  toggleSidebar: () => void;
}
export const useUi = create<UiState>()(
  persist(
    (set) => ({
      theme: "light",
      density: "compact",
      sidebarCollapsed: false,
      toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
      setTheme: (t) => set({ theme: t }),
      setDensity: (d) => set({ density: d }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    { name: "joecool-ui" },
  ),
);
