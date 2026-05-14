import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "@/features/orders/OrdersPage";
import { OrderEditPage } from "@/features/orders/OrderEditPage";

export const ordersRoute = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Orders — Joe Cool" }] }),
  component: OrdersPage,
});

export const orderIdRoute = createFileRoute("/order/$id")({
  head: ({ params }) => ({ meta: [{ title: `Edit Order ${params.id} — Joe Cool` }] }),
  component: OrderEditPage,
});
