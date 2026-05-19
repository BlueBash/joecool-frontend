import {
  settingsBankMessages,
  settingsGeneralMessages,
  settingsMessagePurposes,
  settingsPaymentMethodMessages,
  settingsPaymentTermMessages,
  settingsShippingMessages,
} from "@/api/settings/messages";
import type { SettingsResource, SettingsSectionConfig } from "../types";
import {
  mapBankMessagePayload,
  mapGeneralMessagePayload,
  mapMessagePurposePayload,
  mapPaymentMethodMessagePayload,
  mapPaymentTermMessagePayload,
  mapShippingMessagePayload,
} from "../payload-maps";
import { SettingsModuleFormData } from "./columns/formFields";
import { buildSettingListingColumns } from "./columns/listingData";
import { listing } from "./helpers";

export const messagesSettingsSections: Partial<Record<string, SettingsSectionConfig>> = {
  "messages/purposes": listing({
    resource: settingsMessagePurposes as unknown as SettingsResource,
    singular: "Message purpose",
    plural: "Message purposes",
    bodyKey: "message_purpose",
    fields: SettingsModuleFormData.message_purpose,
    mapWritePayload: mapMessagePurposePayload,
    buildListingColumns: buildSettingListingColumns,
  }),
  "messages/general": listing({
    resource: settingsGeneralMessages as unknown as SettingsResource,
    singular: "General message",
    plural: "General messages",
    bodyKey: "general_message",
    fields: SettingsModuleFormData.general_message,
    mapWritePayload: mapGeneralMessagePayload,
    buildListingColumns: buildSettingListingColumns,
  }),
  "messages/shipping": listing({
    resource: settingsShippingMessages as unknown as SettingsResource,
    singular: "Shipping message",
    plural: "Shipping messages",
    bodyKey: "shipping_message",
    fields: SettingsModuleFormData.shipping_message,
    mapWritePayload: mapShippingMessagePayload,
    buildListingColumns: buildSettingListingColumns,
  }),
  "messages/payment-term": listing({
    resource: settingsPaymentTermMessages as unknown as SettingsResource,
    singular: "Payment term message",
    plural: "Payment term messages",
    bodyKey: "payment_term_message",
    fields: SettingsModuleFormData.payment_term_message,
    mapWritePayload: mapPaymentTermMessagePayload,
    buildListingColumns: buildSettingListingColumns,
  }),
  "messages/payment-method": listing({
    resource: settingsPaymentMethodMessages as unknown as SettingsResource,
    singular: "Payment method message",
    plural: "Payment method messages",
    bodyKey: "payment_method_message",
    fields: SettingsModuleFormData.payment_method_message,
    mapWritePayload: mapPaymentMethodMessagePayload,
    buildListingColumns: buildSettingListingColumns,
  }),
  "messages/bank": listing({
    resource: settingsBankMessages as unknown as SettingsResource,
    singular: "Bank message",
    plural: "Bank messages",
    bodyKey: "bank_message",
    fields: SettingsModuleFormData.bank_message,
    mapWritePayload: mapBankMessagePayload,
    buildListingColumns: buildSettingListingColumns,
  }),
};
