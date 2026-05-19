import type { SettingsListFilterConfig } from "./types";

/** Reusable filter field groups aligned with the legacy settings listings. */
export const SETTINGS_FILTER_PRESETS = {
  codeName(): SettingsListFilterConfig {
    return {
      fields: [
        { kind: "text", key: "code", placeholder: "Code" },
        { kind: "text", key: "name", placeholder: "Name" },
      ],
    };
  },

  codeBlurb(): SettingsListFilterConfig {
    return {
      fields: [
        { kind: "text", key: "code", placeholder: "Code" },
        { kind: "text", key: "blurb", placeholder: "Blurb" },
      ],
    };
  },

  message(): SettingsListFilterConfig {
    return {
      fields: [{ kind: "text", key: "message", placeholder: "Message" }],
    };
  },

  nameOnly(): SettingsListFilterConfig {
    return {
      fields: [{ kind: "text", key: "name", placeholder: "Name" }],
    };
  },

  categoryAudience(): SettingsListFilterConfig {
    return {
      fields: [
        {
          kind: "text",
          key: "category",
          param: "category_name",
          placeholder: "Category Name",
        },
        {
          kind: "select",
          key: "audience",
          placeholder: "Select Audience",
          clearable: true,
          predicate: "in",
          options: [
            { value: "wholesale", label: "wholesale" },
            { value: "retail", label: "retail" },
          ],
        },
      ],
    };
  },

  ringSize(): SettingsListFilterConfig {
    return {
      fields: [
        {
          kind: "text",
          key: "diameter_mm",
          predicate: "eq",
          placeholder: "Diameter (mm)",
        },
        { kind: "text", key: "uk_size", placeholder: "UK Size" },
      ],
    };
  },

  country(): SettingsListFilterConfig {
    return {
      fields: [
        { kind: "text", key: "name", placeholder: "Name" },
        {
          kind: "text",
          key: "iso_number",
          predicate: "eq",
          placeholder: "ISO Number",
        },
      ],
    };
  },

  accountManager(): SettingsListFilterConfig {
    return {
      fields: [
        { kind: "text", key: "code", placeholder: "Code" },
        { kind: "text", key: "name", placeholder: "Name" },
        { kind: "text", key: "email", placeholder: "Email" },
      ],
    };
  },
} as const;
