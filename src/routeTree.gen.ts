/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// Route tree for TanStack Router (code-based file routes). Update when adding routes under `src/routes/`.

import { Route as rootRouteImport } from "./routes/__root.tsx";
import { Route as IndexRouteImport } from "./routes/index";
import { Route as DashboardRouteImport } from "./routes/dashboard.tsx";
import {
  loginRoute as LoginRouteImport,
  forgotPasswordRoute as ForgotPasswordRouteImport,
  resetPasswordRoute as ResetPasswordRouteImport,
} from "./routes/auth.tsx";
import {
  addressesRoute as AddressesRouteImport,
  addressIdRoute as AddressIdRouteImport,
} from "./routes/addresses.tsx";
import {
  ordersRoute as OrdersRouteImport,
  orderIdRoute as OrderIdRouteImport,
} from "./routes/orders.tsx";
import {
  operatorsRoute as OperatorsRouteImport,
  operatorIdRoute as OperatorIdRouteImport,
} from "./routes/operators.tsx";
import { Route as ReportsRouteImport } from "./routes/reports.tsx";
import {
  stocksRoute as StocksRouteImport,
  stockIdRoute as StockIdRouteImport,
} from "./routes/stocks.tsx";
import { Route as TimekeepingRouteImport } from "./routes/timekeeping.tsx";
import {
  transactionsRoute as TransactionsRouteImport,
  transactionsIdRoute as TransactionsIdRouteImport,
  transactionInvoiceRoute as TransactionInvoiceRouteImport,
  transactionPaymentRoute as TransactionPaymentRouteImport,
} from "./routes/transactions.tsx";
import {
  settingsRoute as SettingsRouteImport,
  settingsSplatRoute as SettingsSplatRouteImport,
} from "./routes/settings.tsx";

const IndexRoute = IndexRouteImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => rootRouteImport,
} as any);

const DashboardRoute = DashboardRouteImport.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => rootRouteImport,
} as any);

const LoginRoute = LoginRouteImport.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => rootRouteImport,
} as any);

const ForgotPasswordRoute = ForgotPasswordRouteImport.update({
  id: "/forgot-password",
  path: "/forgot-password",
  getParentRoute: () => rootRouteImport,
} as any);

const ResetPasswordRoute = ResetPasswordRouteImport.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => rootRouteImport,
} as any);

const AddressesRoute = AddressesRouteImport.update({
  id: "/addresses",
  path: "/addresses",
  getParentRoute: () => rootRouteImport,
} as any);

const AddressIdRoute = AddressIdRouteImport.update({
  id: "/address/$id",
  path: "/address/$id",
  getParentRoute: () => rootRouteImport,
} as any);

const OrdersRoute = OrdersRouteImport.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => rootRouteImport,
} as any);

const OrderIdRoute = OrderIdRouteImport.update({
  id: "/order/$id",
  path: "/order/$id",
  getParentRoute: () => rootRouteImport,
} as any);

const OperatorsRoute = OperatorsRouteImport.update({
  id: "/operators",
  path: "/operators",
  getParentRoute: () => rootRouteImport,
} as any);

const OperatorIdRoute = OperatorIdRouteImport.update({
  id: "/operator/$id",
  path: "/operator/$id",
  getParentRoute: () => rootRouteImport,
} as any);

const ReportsRoute = ReportsRouteImport.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => rootRouteImport,
} as any);

const StocksRoute = StocksRouteImport.update({
  id: "/stocks",
  path: "/stocks",
  getParentRoute: () => rootRouteImport,
} as any);

const StockIdRoute = StockIdRouteImport.update({
  id: "/stock/$id",
  path: "/stock/$id",
  getParentRoute: () => rootRouteImport,
} as any);

const TimekeepingRoute = TimekeepingRouteImport.update({
  id: "/timekeeping",
  path: "/timekeeping",
  getParentRoute: () => rootRouteImport,
} as any);

const TransactionsRoute = TransactionsRouteImport.update({
  id: "/transactions",
  path: "/transactions",
  getParentRoute: () => rootRouteImport,
} as any);

const TransactionsIdRoute = TransactionsIdRouteImport.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => TransactionsRoute,
} as any);

const TransactionInvoiceRoute = TransactionInvoiceRouteImport.update({
  id: "/transaction/invoice",
  path: "/transaction/invoice",
  getParentRoute: () => rootRouteImport,
} as any);

const TransactionPaymentRoute = TransactionPaymentRouteImport.update({
  id: "/transaction/payment",
  path: "/transaction/payment",
  getParentRoute: () => rootRouteImport,
} as any);

const SettingsRoute = SettingsRouteImport.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => rootRouteImport,
} as any);

const SettingsSplatRoute = SettingsSplatRouteImport.update({
  id: "/$",
  path: "/$",
  getParentRoute: () => SettingsRoute,
} as any);

interface SettingsRouteChildren {
  SettingsSplatRoute: typeof SettingsSplatRoute;
}

const SettingsRouteChildren: SettingsRouteChildren = {
  SettingsSplatRoute: SettingsSplatRoute,
};

const SettingsRouteWithChildren = SettingsRoute._addFileChildren(SettingsRouteChildren);

interface TransactionsRouteChildren {
  TransactionsIdRoute: typeof TransactionsIdRoute;
}

const TransactionsRouteChildren: TransactionsRouteChildren = {
  TransactionsIdRoute: TransactionsIdRoute,
};

const TransactionsRouteWithChildren = TransactionsRoute._addFileChildren(TransactionsRouteChildren);

export interface FileRoutesByFullPath {
  "/": typeof IndexRoute;
  "/dashboard": typeof DashboardRoute;
  "/login": typeof LoginRoute;
  "/forgot-password": typeof ForgotPasswordRoute;
  "/reset-password": typeof ResetPasswordRoute;
  "/addresses": typeof AddressesRoute;
  "/address/$id": typeof AddressIdRoute;
  "/orders": typeof OrdersRoute;
  "/order/$id": typeof OrderIdRoute;
  "/operators": typeof OperatorsRoute;
  "/operator/$id": typeof OperatorIdRoute;
  "/reports": typeof ReportsRoute;
  "/stocks": typeof StocksRoute;
  "/stock/$id": typeof StockIdRoute;
  "/timekeeping": typeof TimekeepingRoute;
  "/transactions": typeof TransactionsRouteWithChildren;
  "/transactions/$id": typeof TransactionsIdRoute;
  "/transaction/invoice": typeof TransactionInvoiceRoute;
  "/transaction/payment": typeof TransactionPaymentRoute;
  "/settings": typeof SettingsRouteWithChildren;
  "/settings/$": typeof SettingsSplatRoute;
}

export interface FileRoutesByTo {
  "/": typeof IndexRoute;
  "/dashboard": typeof DashboardRoute;
  "/login": typeof LoginRoute;
  "/forgot-password": typeof ForgotPasswordRoute;
  "/reset-password": typeof ResetPasswordRoute;
  "/addresses": typeof AddressesRoute;
  "/address/$id": typeof AddressIdRoute;
  "/orders": typeof OrdersRoute;
  "/order/$id": typeof OrderIdRoute;
  "/operators": typeof OperatorsRoute;
  "/operator/$id": typeof OperatorIdRoute;
  "/reports": typeof ReportsRoute;
  "/stocks": typeof StocksRoute;
  "/stock/$id": typeof StockIdRoute;
  "/timekeeping": typeof TimekeepingRoute;
  "/transactions": typeof TransactionsRouteWithChildren;
  "/transactions/$id": typeof TransactionsIdRoute;
  "/transaction/invoice": typeof TransactionInvoiceRoute;
  "/transaction/payment": typeof TransactionPaymentRoute;
  "/settings": typeof SettingsRouteWithChildren;
  "/settings/$": typeof SettingsSplatRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRouteImport;
  "/": typeof IndexRoute;
  "/dashboard": typeof DashboardRoute;
  "/login": typeof LoginRoute;
  "/forgot-password": typeof ForgotPasswordRoute;
  "/reset-password": typeof ResetPasswordRoute;
  "/addresses": typeof AddressesRoute;
  "/address/$id": typeof AddressIdRoute;
  "/orders": typeof OrdersRoute;
  "/order/$id": typeof OrderIdRoute;
  "/operators": typeof OperatorsRoute;
  "/operator/$id": typeof OperatorIdRoute;
  "/reports": typeof ReportsRoute;
  "/stocks": typeof StocksRoute;
  "/stock/$id": typeof StockIdRoute;
  "/timekeeping": typeof TimekeepingRoute;
  "/transactions": typeof TransactionsRouteWithChildren;
  "/transactions/$id": typeof TransactionsIdRoute;
  "/transaction/invoice": typeof TransactionInvoiceRoute;
  "/transaction/payment": typeof TransactionPaymentRoute;
  "/settings": typeof SettingsRouteWithChildren;
  "/settings/$": typeof SettingsSplatRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths:
    | "/"
    | "/dashboard"
    | "/login"
    | "/forgot-password"
    | "/reset-password"
    | "/addresses"
    | "/address/$id"
    | "/orders"
    | "/order/$id"
    | "/operators"
    | "/operator/$id"
    | "/reports"
    | "/stocks"
    | "/stock/$id"
    | "/timekeeping"
    | "/transactions"
    | "/transactions/$id"
    | "/transaction/invoice"
    | "/transaction/payment"
    | "/settings"
    | "/settings/$";
  fileRoutesByTo: FileRoutesByTo;
  to:
    | "/"
    | "/dashboard"
    | "/login"
    | "/forgot-password"
    | "/reset-password"
    | "/addresses"
    | "/address/$id"
    | "/orders"
    | "/order/$id"
    | "/operators"
    | "/operator/$id"
    | "/reports"
    | "/stocks"
    | "/stock/$id"
    | "/timekeeping"
    | "/transactions"
    | "/transactions/$id"
    | "/transaction/invoice"
    | "/transaction/payment"
    | "/settings"
    | "/settings/$";
  id:
    | "__root__"
    | "/"
    | "/dashboard"
    | "/login"
    | "/forgot-password"
    | "/reset-password"
    | "/addresses"
    | "/address/$id"
    | "/orders"
    | "/order/$id"
    | "/operators"
    | "/operator/$id"
    | "/reports"
    | "/stocks"
    | "/stock/$id"
    | "/timekeeping"
    | "/transactions"
    | "/transactions/$id"
    | "/transaction/invoice"
    | "/transaction/payment"
    | "/settings"
    | "/settings/$";
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  DashboardRoute: typeof DashboardRoute;
  LoginRoute: typeof LoginRoute;
  ForgotPasswordRoute: typeof ForgotPasswordRoute;
  ResetPasswordRoute: typeof ResetPasswordRoute;
  AddressesRoute: typeof AddressesRoute;
  AddressIdRoute: typeof AddressIdRoute;
  OrdersRoute: typeof OrdersRoute;
  OrderIdRoute: typeof OrderIdRoute;
  OperatorsRoute: typeof OperatorsRoute;
  OperatorIdRoute: typeof OperatorIdRoute;
  ReportsRoute: typeof ReportsRoute;
  StocksRoute: typeof StocksRoute;
  StockIdRoute: typeof StockIdRoute;
  TimekeepingRoute: typeof TimekeepingRoute;
  TransactionsRoute: typeof TransactionsRouteWithChildren;
  TransactionInvoiceRoute: typeof TransactionInvoiceRoute;
  TransactionPaymentRoute: typeof TransactionPaymentRoute;
  SettingsRoute: typeof SettingsRouteWithChildren;
}

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/";
      path: "/";
      fullPath: "/";
      preLoaderRoute: typeof IndexRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/dashboard": {
      id: "/dashboard";
      path: "/dashboard";
      fullPath: "/dashboard";
      preLoaderRoute: typeof DashboardRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/login": {
      id: "/login";
      path: "/login";
      fullPath: "/login";
      preLoaderRoute: typeof LoginRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/forgot-password": {
      id: "/forgot-password";
      path: "/forgot-password";
      fullPath: "/forgot-password";
      preLoaderRoute: typeof ForgotPasswordRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/reset-password": {
      id: "/reset-password";
      path: "/reset-password";
      fullPath: "/reset-password";
      preLoaderRoute: typeof ResetPasswordRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/addresses": {
      id: "/addresses";
      path: "/addresses";
      fullPath: "/addresses";
      preLoaderRoute: typeof AddressesRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/address/$id": {
      id: "/address/$id";
      path: "/address/$id";
      fullPath: "/address/$id";
      preLoaderRoute: typeof AddressIdRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/orders": {
      id: "/orders";
      path: "/orders";
      fullPath: "/orders";
      preLoaderRoute: typeof OrdersRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/order/$id": {
      id: "/order/$id";
      path: "/order/$id";
      fullPath: "/order/$id";
      preLoaderRoute: typeof OrderIdRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/operators": {
      id: "/operators";
      path: "/operators";
      fullPath: "/operators";
      preLoaderRoute: typeof OperatorsRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/operator/$id": {
      id: "/operator/$id";
      path: "/operator/$id";
      fullPath: "/operator/$id";
      preLoaderRoute: typeof OperatorIdRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/reports": {
      id: "/reports";
      path: "/reports";
      fullPath: "/reports";
      preLoaderRoute: typeof ReportsRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/stocks": {
      id: "/stocks";
      path: "/stocks";
      fullPath: "/stocks";
      preLoaderRoute: typeof StocksRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/stock/$id": {
      id: "/stock/$id";
      path: "/stock/$id";
      fullPath: "/stock/$id";
      preLoaderRoute: typeof StockIdRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/timekeeping": {
      id: "/timekeeping";
      path: "/timekeeping";
      fullPath: "/timekeeping";
      preLoaderRoute: typeof TimekeepingRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/transactions": {
      id: "/transactions";
      path: "/transactions";
      fullPath: "/transactions";
      preLoaderRoute: typeof TransactionsRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/transactions/$id": {
      id: "/transactions/$id";
      path: "/$id";
      fullPath: "/transactions/$id";
      preLoaderRoute: typeof TransactionsIdRouteImport;
      parentRoute: typeof TransactionsRoute;
    };
    "/transaction/invoice": {
      id: "/transaction/invoice";
      path: "/transaction/invoice";
      fullPath: "/transaction/invoice";
      preLoaderRoute: typeof TransactionInvoiceRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/transaction/payment": {
      id: "/transaction/payment";
      path: "/transaction/payment";
      fullPath: "/transaction/payment";
      preLoaderRoute: typeof TransactionPaymentRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/settings": {
      id: "/settings";
      path: "/settings";
      fullPath: "/settings";
      preLoaderRoute: typeof SettingsRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/settings/$": {
      id: "/settings/$";
      path: "/$";
      fullPath: "/settings/$";
      preLoaderRoute: typeof SettingsSplatRouteImport;
      parentRoute: typeof SettingsRoute;
    };
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  DashboardRoute: DashboardRoute,
  LoginRoute: LoginRoute,
  ForgotPasswordRoute: ForgotPasswordRoute,
  ResetPasswordRoute: ResetPasswordRoute,
  AddressesRoute: AddressesRoute,
  AddressIdRoute: AddressIdRoute,
  OrdersRoute: OrdersRoute,
  OrderIdRoute: OrderIdRoute,
  OperatorsRoute: OperatorsRoute,
  OperatorIdRoute: OperatorIdRoute,
  ReportsRoute: ReportsRoute,
  StocksRoute: StocksRoute,
  StockIdRoute: StockIdRoute,
  TimekeepingRoute: TimekeepingRoute,
  TransactionsRoute: TransactionsRouteWithChildren,
  TransactionInvoiceRoute: TransactionInvoiceRoute,
  TransactionPaymentRoute: TransactionPaymentRoute,
  SettingsRoute: SettingsRouteWithChildren,
};

export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();
