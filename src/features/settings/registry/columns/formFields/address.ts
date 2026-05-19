import type { FieldDef } from "../../../types";
import { codeNameFields } from "./shared";

export const addressFormFields = {
  address_category: codeNameFields(),
  payment_method: codeNameFields(),
  ship_from: codeNameFields(),
  special_customer: codeNameFields(),
  ups_service: codeNameFields(),

  pay_term: [
    ...codeNameFields(),
    { name: "days_needed", label: "Days needed", type: "boolean" },
    { name: "prepay_needed", label: "Prepay needed", type: "boolean" },
  ] satisfies FieldDef[],

  ship_method: [
    ...codeNameFields(),
    {
      name: "ups_service_id",
      label: "UPS service",
      type: "reference",
      referenceKlass: "AddressSettings::UpsService",
      placeholder: "Search UPS services…",
    },
  ] satisfies FieldDef[],

  contact_dept: [
    ...codeNameFields(),
    { name: "list_order", label: "List order", type: "number" },
  ] satisfies FieldDef[],

  contact_role: [
    ...codeNameFields(),
    { name: "list_order", label: "List order", type: "number" },
  ] satisfies FieldDef[],

  agent: [
    { name: "name", label: "Name", type: "text", required: true, maxLength: 120 },
    { name: "code", label: "Code", type: "text", required: true, maxLength: 40 },
  ] satisfies FieldDef[],

  country: [
    { name: "name", label: "Name", type: "text", required: true, maxLength: 120 },
    { name: "iso_number", label: "ISO number", type: "text", maxLength: 20 },
    { name: "iso_1", label: "ISO 1", type: "text", maxLength: 10 },
    { name: "iso_2", label: "ISO 2", type: "text", maxLength: 10 },
  ] satisfies FieldDef[],

  account_manager: [
    { name: "name", label: "Name", type: "text", required: true, maxLength: 120 },
    { name: "code", label: "Code", type: "text", required: true, maxLength: 40 },
    { name: "email", label: "Email", type: "text", maxLength: 120 },
    { name: "telephone", label: "Telephone", type: "text", maxLength: 40 },
    { name: "mobile", label: "Mobile", type: "text", maxLength: 40 },
    { name: "monitor", label: "Monitor", type: "boolean" },
  ] satisfies FieldDef[],
} as const;
