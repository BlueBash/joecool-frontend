import { mkSettingsResource } from "./resource";

export const settingsMessagePurposes = mkSettingsResource(
  ["settings", "message-purposes"],
  "/message/message_purposes",
  "message_purpose",
);

export const settingsGeneralMessages = mkSettingsResource(
  ["settings", "general-messages"],
  "/message/general_messages",
  "general_message",
  { include: "language,message_purpose" },
);

export const settingsShippingMessages = mkSettingsResource(
  ["settings", "shipping-messages"],
  "/message/shipping_messages",
  "shipping_message",
  { include: "language,document,ship_method" },
);

export const settingsPaymentTermMessages = mkSettingsResource(
  ["settings", "payment-term-messages"],
  "/message/payment_term_messages",
  "payment_term_message",
  { include: "language,document,pay_term" },
);

export const settingsPaymentMethodMessages = mkSettingsResource(
  ["settings", "payment-method-messages"],
  "/message/payment_method_messages",
  "payment_method_message",
  { include: "language,document,payment_method" },
);

export const settingsBankMessages = mkSettingsResource(
  ["settings", "bank-messages"],
  "/message/bank_messages",
  "bank_message",
  { include: "language,bank_account" },
);
