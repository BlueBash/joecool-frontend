import { createFileRoute } from "@tanstack/react-router";
import { StockPage } from "@/features/stock/StockPage";
import { StockEditPage } from "@/features/stock/StockEditPage";

/** Stock list at `/stocks`; edit screen uses singular `/stock/$id` per route contract */
export const stocksRoute = createFileRoute("/stocks")({
  head: () => ({ meta: [{ title: "Stock — Joe Cool" }] }),
  component: StockPage,
});

export const stockIdRoute = createFileRoute("/stock/$id")({
  head: ({ params }) => ({ meta: [{ title: `Edit Stock ${params.id} — Joe Cool` }] }),
  component: StockEditPage,
});
