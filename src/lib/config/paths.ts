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
  stockEdit: "/stock/$id" as const,

  addresses: "/addresses",
  addressEdit: "/address/$id" as const,

  orders: "/orders",
  orderEdit: "/order/$id" as const,

  operators: "/operators",
  operatorEdit: "/operator/$id" as const,

  reports: "/reports",
  timekeeping: "/timekeeping",

  transactions: "/transactions",
  transactionEdit: "/transactions/$id" as const,
  invoiceTransaction: "/transaction/invoice",
  paymentTransaction: "/transaction/payment",

  settings: "/settings",
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
