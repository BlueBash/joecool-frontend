// Public surface of the settings feature.
// Routes and other features should import only from here.

export { SettingsPage } from "./SettingsPage";
export {
  FieldControl,
  ResourceRowForm,
  SettingsResourceForm,
  SettingsResourceListing,
  SettingsSectionPage,
  SettingsSectionPlaceholder,
  buildListingColumns,
  buildRowActionsColumn,
} from "./components";

export { useResourceListingState } from "./hooks/useResourceListingState";
export { useSettingsListFilters } from "./hooks/useSettingsListFilters";
export {
  getSettingsListFilters,
  mapSettingsFiltersToApi,
  SETTINGS_FILTER_PRESETS,
} from "./filters";
export {
  getSettingsSection,
  getSettingsResource,
  settingsResourceRegistry,
  stockSettingsSections,
} from "./registry";
export {
  COMMON_FIELDS_FOR_FORM,
  DEFAULT_PAGE_SIZE,
  SETTINGS_SIDEBAR_ROOT_PARENT_KEY,
} from "./constants";
export {
  hasErrors,
  readFieldValue,
  toFormPayload,
  toFormValues,
  validateFormValues,
} from "./utils";

export type {
  SettingsApiFilters,
  SettingsFilterField,
  SettingsFilterValues,
  SettingsListFilterConfig,
} from "./filters";

export type {
  BuildListingColumnsContext,
  BuildListingColumnsFn,
  EditingState,
  FieldDef,
  FieldType,
  FieldSelectOption,
  FormErrors,
  FormMode,
  FormPayload,
  FormValues,
  SettingItemLike,
  SettingsCustomSectionProps,
  SettingsEntryBase,
  SettingsFormEntry,
  SettingsResource,
  SettingsResourceEntry,
  SettingsSectionConfig,
  SettingsSidebarExpandedByParent,
  SidebarGroupProps,
  StockSubgroupRowProps,
  ToggleSettingsSidebarGroup,
} from "./types";
