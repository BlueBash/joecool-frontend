import type { FieldDef } from "../../../types";

export function codeNameFields(nameMaxLength = 120): FieldDef[] {
  return [
    {
      name: "code",
      label: "Code",
      type: "text",
      required: true,
      maxLength: 40,
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      maxLength: nameMaxLength,
    },
  ];
}

export const AUDIENCE_OPTIONS = [
  { value: "retail", label: "Retail" },
  { value: "wholesale", label: "Wholesale" },
] as const;
