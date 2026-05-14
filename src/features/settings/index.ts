// Public surface of the settings feature.
// Routes and other features should import only from here.

export { SettingsPage } from "./SettingsPage";
export {
  FieldControl,
  ResourceRowForm,
  SettingsResourceListing,
  SettingsSectionPage,
  buildListingColumns,
} from "./components";

export { useResourceListingState } from "./hooks/useResourceListingState";
export { getSettingsResource, settingsResourceRegistry } from "./registry";
export { COMMON_FIELDS, DEFAULT_PAGE_SIZE, SETTINGS_SIDEBAR_ROOT_PARENT_KEY } from "./constants";
export {
  hasErrors,
  toFormPayload,
  toFormValues,
  validateFormValues,
} from "./utils";

export type {
  EditingState,
  FieldDef,
  FieldKind,
  FormErrors,
  FormMode,
  FormPayload,
  FormValues,
  SettingItemLike,
  SettingsResource,
  SettingsResourceEntry,
  SettingsSidebarExpandedByParent,
  SidebarGroupProps,
  StockSubgroupRowProps,
  ToggleSettingsSidebarGroup,
} from "./types";
