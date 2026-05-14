import { createFileRoute } from "@tanstack/react-router";
import { OperatorsPage } from "@/features/operators/OperatorsPage";
import { OperatorEditPage } from "@/features/operators/OperatorEditPage";

export const operatorsRoute = createFileRoute("/operators")({
  head: () => ({ meta: [{ title: "Operators — Joe Cool" }] }),
  component: OperatorsPage,
});

export const operatorIdRoute = createFileRoute("/operator/$id")({
  head: ({ params }) => ({ meta: [{ title: `Edit Operator ${params.id} — Joe Cool` }] }),
  component: OperatorEditPage,
});
