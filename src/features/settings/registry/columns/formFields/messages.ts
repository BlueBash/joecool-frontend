import type { FieldDef } from "../../../types";
import { codeNameFields } from "./shared";

const messageBody: FieldDef = {
  name: "message",
  label: "Message",
  type: "textarea",
  required: true,
  maxLength: 2000,
};

const languageRef: FieldDef = {
  name: "language_id",
  label: "Language",
  type: "reference",
  referenceKlass: "Language",
  placeholder: "Search languages…",
};

export const messagesFormFields = {
  message_purpose: [
    ...codeNameFields(),
    {
      name: "balance_reminder_msg_id",
      label: "Balance reminder message",
      type: "reference",
      referenceKlass: "MessageSettings::GeneralMessage",
      placeholder: "Search messages…",
    },
    { name: "balance_invoice", label: "Balance invoice", type: "boolean" },
    { name: "balance_remind", label: "Balance remind", type: "boolean" },
  ] satisfies FieldDef[],

  general_message: [
    messageBody,
    languageRef,
    {
      name: "message_purpose_id",
      label: "Message purpose",
      type: "reference",
      referenceKlass: "MessageSettings::MessagePurpose",
      placeholder: "Search purposes…",
    },
  ] satisfies FieldDef[],

  shipping_message: [
    messageBody,
    languageRef,
    {
      name: "document_id",
      label: "Document",
      type: "reference",
      referenceKlass: "Document",
      placeholder: "Search documents…",
    },
    {
      name: "ship_method_id",
      label: "Ship method",
      type: "reference",
      referenceKlass: "AddressSettings::ShipMethod",
      placeholder: "Search ship methods…",
    },
  ] satisfies FieldDef[],

  payment_term_message: [
    messageBody,
    languageRef,
    {
      name: "document_id",
      label: "Document",
      type: "reference",
      referenceKlass: "Document",
      placeholder: "Search documents…",
    },
    {
      name: "pay_term_id",
      label: "Pay term",
      type: "reference",
      referenceKlass: "AddressSettings::PayTerm",
      placeholder: "Search pay terms…",
    },
  ] satisfies FieldDef[],

  payment_method_message: [
    messageBody,
    languageRef,
    {
      name: "document_id",
      label: "Document",
      type: "reference",
      referenceKlass: "Document",
      placeholder: "Search documents…",
    },
    {
      name: "payment_method_id",
      label: "Payment method",
      type: "reference",
      referenceKlass: "AddressSettings::PaymentMethod",
      placeholder: "Search payment methods…",
    },
  ] satisfies FieldDef[],

  bank_message: [
    messageBody,
    languageRef,
    {
      name: "bank_account_id",
      label: "Bank account",
      type: "reference",
      referenceKlass: "BankAccount",
      placeholder: "Search bank accounts…",
    },
  ] satisfies FieldDef[],
} as const;
