import { createFileRoute } from "@tanstack/react-router";
import { TransactionsPage } from "@/features/transactions/TransactionsPage";
import { TransactionEditPage } from "@/features/transactions/TransactionEditPage";
import { NewInvoicePage } from "@/features/transactions/NewInvoicePage";
import { NewPaymentPage } from "@/features/transactions/NewPaymentPage";

export const transactionsRoute = createFileRoute("/transactions")({
  head: () => ({ meta: [{ title: "Transactions — Joe Cool" }] }),
  component: TransactionsPage,
});

export const transactionsIdRoute = createFileRoute("/transactions/$id")({
  head: ({ params }) => ({ meta: [{ title: `Edit Transaction ${params.id} — Joe Cool` }] }),
  component: TransactionEditPage,
});

export const transactionInvoiceRoute = createFileRoute("/transaction/invoice")({
  head: () => ({ meta: [{ title: "New Invoice — Joe Cool" }] }),
  component: NewInvoicePage,
});

export const transactionPaymentRoute = createFileRoute("/transaction/payment")({
  head: () => ({ meta: [{ title: "New Payment — Joe Cool" }] }),
  component: NewPaymentPage,
});
