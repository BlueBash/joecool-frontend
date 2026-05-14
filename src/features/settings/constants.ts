import type { FieldDef } from "./types";

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

/** Root-level parent key for the settings sidebar's `expandedByParent` map. */
export const SETTINGS_SIDEBAR_ROOT_PARENT_KEY = "__root__";

// ---------------------------------------------------------------------------
// Listing
// ---------------------------------------------------------------------------

export const DEFAULT_PAGE_SIZE = 25;

// ---------------------------------------------------------------------------
// Form
// ---------------------------------------------------------------------------

/** Fields shared by most catalog-style settings (name + description). */
export const COMMON_FIELDS: FieldDef[] = [
  {
    name: "name",
    label: "Name",
    kind: "text",
    required: true,
    placeholder: "Enter a name",
    maxLength: 120,
  },
  {
    name: "description",
    label: "Description",
    kind: "textarea",
    placeholder: "Optional notes…",
    maxLength: 500,
  },
];
