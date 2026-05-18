import type { Resource } from "@/api/_client";
import type { Column } from "@/components/data-table";
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

export type FieldKind = "text" | "textarea" | "reference";

export interface FieldDef {
  name: string;
  label: string;
  kind: FieldKind;
  /** Required when `kind` is `reference` — autocomplete klass. */
  referenceKlass?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
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

/** Passed to default and custom listing column builders. */
export interface BuildListingColumnsContext {
  /** Registry entry for this slug (read `fields`, `singular`, etc.). */
  entry: SettingsResourceEntry;
  editing: EditingState;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/** Override per slug when the default Name / Code / Actions table is not enough. */
export type BuildListingColumnsFn = (
  ctx: BuildListingColumnsContext,
) => Column<SettingItemLike>[];

export interface SettingsResourceEntry {
  resource: SettingsResource;
  /** Singular noun used in "Add X" / "Edit X" copy. */
  singular: string;
  /** Plural noun used in empty/search copy. */
  plural: string;
  bodyKey: string;
  /** Fields rendered in the inline create/edit form, in display order. */
  fields: FieldDef[];
  /**
   * Maps validated form values to the flat object nested under the Rails
   * param key (see `createResource` `bodyKey`).
   */
  mapWritePayload?: (payload: FormPayload) => Record<string, unknown>;
  /**
   * Custom table columns for this resource. When omitted, the shared
   * default listing (name, code/details summary, actions) is used.
   */
  buildListingColumns?: BuildListingColumnsFn;
}

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
