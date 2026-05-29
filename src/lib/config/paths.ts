/**
 * Canonical path constants for navigation and route matching.
 * TanStack file routes use `$id` params; helpers below produce concrete paths where needed.
 */
export const paths = {
  home: "/",

  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",

  dashboard: "/dashboard",

  stocks: "/stocks",
  stockEditRoutes: ["/stock/$id"] as const,
  stockEdit: "/stock/$id" as const,

  /** @alias addresses — list route for address module */
  address: "/addresses",
  addresses: "/addresses",
  addressEditRoutes: ["/address/$id"] as const,
  addressEdit: "/address/$id" as const,

  orders: "/orders",
  orderEditRoutes: ["/order/$id"] as const,
  orderEdit: "/order/$id" as const,

  operators: "/operators",
  operatorEditRoutes: ["/operator/$id"] as const,
  operatorEdit: "/operator/$id" as const,

  reports: "/reports",
  timekeeping: "/timekeeping",

  transactions: "/transactions",
  transactionEdit: "/transactions/$id" as const,
  invoiceTransaction: "/transaction/invoice",
  paymentTransaction: "/transaction/payment",

  settings: "/settings",

  /** Reference route structure — kept in sync with TanStack `/settings/$` splat routes. */
  settingsStockDetailsCategoryRoutes: [
    "/settings/stock/category/categories",
    "/settings/stock/category/groups",
  ] as const,
  settingsStockDetailsFittingRoutes: [
    "/settings/stock/fittings/sizes-pack-assortments",
    "/settings/stock/fittings/sizes-specs",
    "/settings/stock/fittings/sizes-measures",
    "/settings/stock/fittings/messages",
  ] as const,
  settingsStockDetailsDimensionsRoutes: [
    "/settings/stock/dimensions/pack-assortments",
    "/settings/stock/dimensions/specs",
    "/settings/stock/dimensions/measures",
    "/settings/stock/dimensions/messages",
  ] as const,
  settingsStockDetailsStockRoutes: [
    "/settings/stock/stock/selections",
    "/settings/stock/stock/collections",
    "/settings/stock/stock/stock-ranges",
  ] as const,
  settingsStockDetailsMessagesRoutes: ["/settings/stock/messages"] as const,
  settingsStockDetailsUnitsRoutes: ["/settings/stock/units"] as const,
  settingsStockDetailsDisplaysRoutes: ["/settings/stock/displays"] as const,
  settingsStockDetailsColorsRoutes: [
    "/settings/stock/colors",
  ] as const,
  settingsStockDetailsSizesRoutes: ["/settings/stock/sizes"] as const,
  settingsStockDetailsCostsRoutes: [
    "/settings/stock/assembly-costs",
    "/settings/stock/packing-costs",
  ] as const,
  settingsStockDetailsOthersRoutes: [
    "/settings/stock/other-assortments",
    "/settings/stock/other-genders",
    "/settings/stock/other-materials",
    "/settings/stock/other-custom-tariff-codes",
  ] as const,

  settingsPriceCategoryRoutes: ["/settings/price/category"] as const,
  settingsPriceCalculationRoutes: ["/settings/price/calculation"] as const,
  settingsPriceCurrenciesRoutes: ["/settings/price/currencies"] as const,

  settingsAddressCategoryRoutes: ["/settings/address/category"] as const,
  settingsAddressAddressPaymentMethodRoutes: ["/settings/address/payment-method"] as const,
  settingsAddressShipFromRoutes: ["/settings/address/ship-from"] as const,
  settingsAddressPayTermRoutes: ["/settings/address/pay-term"] as const,
  settingsAddressShipMethodRoutes: ["/settings/address/ship-method"] as const,
  settingsAddressContactDepartmentsRoutes: ["/settings/address/contact-departments"] as const,
  settingsAddressContactRoleRoutes: ["/settings/address/contact-role"] as const,
  settingsAddressAgentRoutes: ["/settings/address/agent"] as const,
  settingsAddressCountryRoutes: ["/settings/address/country"] as const,
  settingsAddressUPSServiceRoutes: ["/settings/address/ups-service"] as const,

  settingsOthersProfileCentreRoutes: ["/settings/others/profit-centre"] as const,
  settingsOthersAreaRoutes: ["/settings/others/area"] as const,
  settingsOthersInvoiceEnvRoutes: ["/settings/others/invoice-environment"] as const,
  settingsOthersWarehouseRoutes: ["/settings/others/warehouse"] as const,
  settingsOthersShippingChargesRoutes: ["/settings/others/shipping-charges"] as const,
  settingsOthersCostCodesRoutes: ["/settings/others/cost-codes"] as const,
  settingsOthersOrderKindsRoutes: ["/settings/others/order-kinds"] as const,
  settingsOthersLanguagesRoutes: ["/settings/others/languages"] as const,
  settingsOthersLabelSourcesRoutes: ["/settings/others/label-sources"] as const,
  settingsOthersVatKindsRoutes: ["/settings/others/var-kinds"] as const,
  settingsOthersVatRateCodesRoutes: ["/settings/others/vat-rate-codes"] as const,
  settingsOthersBankAccountRoutes: ["/settings/others/bank-account"] as const,
  settingsOthersMapAccountantsRoutes: ["/settings/others/map-accountants"] as const,
  settingsOthersProfitLossRoutes: ["/settings/others/profit-loss"] as const,
  settingsOthersCashflowRoutes: ["/settings/others/cash-flow"] as const,
  settingsOthersVenuesRoutes: ["/settings/others/venues"] as const,
  settingsOthersDocumentsRoutes: ["/settings/others/documents"] as const,

  settingsMessagesPurposeRoutes: ["/settings/messages/purposes"] as const,
  settingsMessagesGeneralRoutes: ["/settings/messages/general"] as const,
  settingsMessagesShippingRoutes: ["/settings/messages/shipping"] as const,
  settingsMessagesPaymentTermRoutes: ["/settings/messages/payment-term"] as const,
  settingsMessagesPaymentMethodRoutes: ["/settings/messages/payment-method"] as const,
  settingsMessagesBankRoutes: ["/settings/messages/bank"] as const,
} as const;

/** Default landing when visiting `/` — swap for auth guard → `/login` later */
export const HOME_REDIRECT = paths.dashboard;

export function stockEditPath(id: string) {
  return `/stock/${id}` as const;
}

export function addressEditPath(id: string) {
  return `/address/${id}` as const;
}

export function orderEditPath(id: string) {
  return `/order/${id}` as const;
}

export function operatorEditPath(id: string) {
  return `/operator/${id}` as const;
}

export function transactionEditPath(id: string) {
  return `/transactions/${id}` as const;
}
