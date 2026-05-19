import type { FieldDef } from "../../../types";
import { addressFormFields } from "./address";
import { messagesFormFields } from "./messages";
import { priceFormFields } from "./price";
import { stockFormFields } from "./stock";
import { systemFormFields } from "./system";

export const SettingsModuleFormData: Record<string, FieldDef[]> = {
  ...stockFormFields,
  ...priceFormFields,
  ...addressFormFields,
  ...messagesFormFields,
  ...systemFormFields,
};

export {
  stockFormFields,
  priceFormFields,
  addressFormFields,
  messagesFormFields,
  systemFormFields,
};
