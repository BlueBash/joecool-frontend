import type { ComponentType } from "react";
import type { Resource } from "@/api/_client";
import type { Column } from "@/components/data-table";
import type { SettingsGroup } from "@/lib/settings-nav";
import type { SettingsListFilterConfig } from "./filters";

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

export type FieldType = "text" | "textarea" | "reference" | "boolean" | "number" | "select";

export interface FieldSelectOption {
  value: string;
  label: string;
}

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  referenceKlass?: string;
  readPath?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  options?: FieldSelectOption[];
}

// ---------------------------------------------------------------------------
// Inline editor state machine.
// ---------------------------------------------------------------------------

export type EditingState = { kind: "none" } | { kind: "create" } | { kind: "edit"; id: string };

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
  onDelete: (row: SettingItemLike) => void;
}

/** Override per slug when the default Name / Code / Actions table is not enough. */
export type BuildListingColumnsFn = (ctx: BuildListingColumnsContext) => Column<SettingItemLike>[];

/** Shared config for listing and form-only settings sections. */
export interface SettingsEntryBase {
  resource: SettingsResource;
  /** Singular noun used in "Add X" / "Edit X" copy. */
  singular: string;
  bodyKey: string;
  /** Fields rendered in create/edit forms, in display order. */
  fields: FieldDef[];
  /**
   * Maps validated form values to the flat object nested under the Rails
   * param key (see `createResource` `bodyKey`).
   */
  mapWritePayload?: (payload: FormPayload) => Record<string, unknown>;
  /**
   * Maps an API row to form values. Used when nested or renamed fields
   * cannot be resolved via `FieldDef.readPath` alone.
   */
  mapFromRow?: (row: SettingItemLike) => FormValues;
}

export interface SettingsResourceEntry extends SettingsEntryBase {
  /** Plural noun used in empty/search copy. */
  plural: string;
  /**
   * Key into `SettingsModuleListingData` when it differs from `bodyKey`
   * (e.g. address vs stock both use API body key `category`).
   */
  listingKey?: string;
  /**
   * Custom table columns for this resource. When omitted, the shared
   * default listing (name, code/details summary, actions) is used.
   */
  buildListingColumns?: BuildListingColumnsFn;
  /**
   * Optional list filter config for this slug. When omitted, filters are
   * resolved from `getSettingsListFilters` (body-key defaults and presets).
   */
  listFilters?: SettingsListFilterConfig;
}

/** Form-only section (no DataTable). */
export interface SettingsFormEntry extends SettingsEntryBase {
  /**
   * Fixed record id for singleton settings. When omitted, the first list
   * row is used when available; otherwise the create flow is shown.
   */
  recordId?: string;
}

export type SettingsCustomSectionProps = { slug: string; title: string };

export type SettingsSectionConfig =
  | { view: "listing"; entry: SettingsResourceEntry }
  | { view: "form"; entry: SettingsFormEntry }
  | { view: "custom"; component: ComponentType<SettingsCustomSectionProps> };

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
  collapsed?: boolean;
}

export interface StockSubgroupRowProps {
  group: SettingsGroup;
  depth: number;
  activeGroupSlugs: Set<string>;
}
