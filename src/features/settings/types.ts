import type { Resource } from "@/api/_client";
import type { SettingsGroup } from "@/lib/settings-nav";

// ---------------------------------------------------------------------------
// Resource registry — typed surface every settings catalog implements.
// ---------------------------------------------------------------------------

/** Minimum row shape exposed to the listing/form UI. */
export interface SettingItemLike {
  id: string;
  name: string;
  description?: string | null;
  [key: string]: unknown;
}

/** Erased resource type used by the registry — UI works against this shape. */
export type SettingsResource = Resource<SettingItemLike, unknown, unknown>;

export type FieldKind = "text" | "textarea";

export interface FieldDef {
  name: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export interface SettingsResourceEntry {
  resource: SettingsResource;
  /** Singular noun used in "Add X" / "Edit X" copy. */
  singular: string;
  /** Plural noun used in empty/search copy. */
  plural: string;
  /** Fields rendered in the inline create/edit form, in display order. */
  fields: FieldDef[];
}

// ---------------------------------------------------------------------------
// Inline editor state machine.
// ---------------------------------------------------------------------------

export type EditingState =
  | { kind: "none" }
  | { kind: "create" }
  | { kind: "edit"; id: string };

export type FormMode = { kind: "create" } | { kind: "edit"; id: string };

export type FormValues = Record<string, string>;
export type FormErrors = Record<string, string | undefined>;
export type FormPayload = Record<string, string | null>;

// ---------------------------------------------------------------------------
// Sidebar (legacy `SettingsPage` shell).
// ---------------------------------------------------------------------------

/** Map of parent slug → currently-expanded child slug. */
export type SettingsSidebarExpandedByParent = Record<string, string>;

export type ToggleSettingsSidebarGroup = (parentKey: string, slug: string) => void;

export interface SidebarGroupProps {
  group: SettingsGroup;
  depth: number;
  parentKey: string;
  expandedByParent: SettingsSidebarExpandedByParent;
  onToggleGroup: ToggleSettingsSidebarGroup;
  activeSection: string;
  activeGroupSlugs: Set<string>;
  hideSectionsInSidebar?: boolean;
}

export interface StockSubgroupRowProps {
  group: SettingsGroup;
  depth: number;
  activeGroupSlugs: Set<string>;
}
