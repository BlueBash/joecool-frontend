import { createFileRoute } from "@tanstack/react-router";
import { AddressesPage } from "@/features/addresses/AddressesPage";
import { AddressEditPage } from "@/features/addresses/AddressEditPage";

export const addressesRoute = createFileRoute("/addresses")({
  head: () => ({ meta: [{ title: "Addresses — Joe Cool" }] }),
  component: AddressesPage,
});

export const addressIdRoute = createFileRoute("/address/$id")({
  head: ({ params }) => ({ meta: [{ title: `Edit Address ${params.id} — Joe Cool` }] }),
  component: AddressEditPage,
});
