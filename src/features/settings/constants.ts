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

/** @deprecated Prefer importing `F_CODE_NAME` from `./fields`. */
export const COMMON_FIELDS_FOR_FORM: FieldDef[] = [
  {
    name: "code",
    label: "Code",
    type: "text",
    required: true,
    placeholder: "Short code",
    maxLength: 80,
  },
  {
    name: "name",
    label: "Name",
    type: "text",
    required: true,
    placeholder: "Display name",
    maxLength: 200,
  },
];
