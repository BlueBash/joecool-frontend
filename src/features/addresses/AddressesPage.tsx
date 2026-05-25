import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Download, Zap, Loader2 } from "lucide-react";
import { addresses } from "@/api/address";
import type { ApiError } from "@/api/_client";
import { PageHeader, CopyableCode } from "@/components/app-shell";
import { DataTable, Toolbar, TableSearch, type Column } from "@/components/data-table";
import { Pill } from "@/components/pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationBar } from "@/components/pagination-bar";
import { RowActions, EditLink } from "@/components/row-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Address } from "@/lib/types";
import { firstFormErrorMessage } from "@/lib/form";
import { addressRowKey, useAddressDirectory, type AddressKindFilter } from "./hooks";
import { addressToPayload } from "./map-address";
import { QuickAddressFormSchema, type QuickAddressFormValues } from "./address-form-schema";

type AddAddressHandler = (address: Address) => void;

const KIND_FILTER_OPTIONS = [
  { value: "all", label: "All kinds" },
  { value: "Customer", label: "Customers" },
  { value: "Supplier", label: "Suppliers" },
] as const satisfies readonly { value: AddressKindFilter; label: string }[];

interface QuickAddAddressProps {
  onAdd: AddAddressHandler;
  onCancel: () => void;
  isSaving: boolean;
}

export function AddressesPage() {
  return <AddressesListing />;
}

function AddressesListing() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const [kind, setKind] = useState<AddressKindFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const directory = useAddressDirectory({ page, pageSize, search: q, kind });

  const createSupplier = addresses.hooks.useCreateSupplier();
  const createCustomer = addresses.hooks.useCreateCustomer();

  const onCreateSuccess = (row: { id: string | number }) => {
    toast.success("Address created");
    setAdding(false);
    nav({ to: "/address/$id", params: { id: String(row.id) } });
  };

  const onCreateError = (err: ApiError) => toast.error(err.message);

  const columns = [
    {
      key: "code",
      header: "Code",
      width: "100px",
      sortValue: (r) => r.code,
      cell: (r) => <CopyableCode value={r.code} />,
    },
    {
      key: "name",
      header: "Name",
      sortValue: (r) => r.name,
      cell: (r) => <span className="truncate block max-w-[320px]">{r.name}</span>,
    },
    {
      key: "type",
      header: "Type",
      width: "110px",
      cell: (r) => <Pill variant={r.type === "Supplier" ? "info" : "primary"}>{r.type}</Pill>,
    },
    { key: "town", header: "Town", width: "140px", cell: (r) => <span>{r.town}</span> },
    { key: "country", header: "Country", width: "120px", cell: (r) => <span>{r.country}</span> },
    {
      key: "last",
      header: "Last Order",
      width: "120px",
      align: "right",
      cell: (r) => <span className="text-muted-foreground tabular-nums">{r.lastOrder ?? "—"}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      width: "90px",
      align: "right",
      cell: (r) => (
        <RowActions>
          <EditLink to="/address/$id" params={{ id: r.id }} title="Edit address" />
        </RowActions>
      ),
    },
  ] satisfies Column<Address>[];

  const isSaving = createSupplier.isPending || createCustomer.isPending;

  const onQuickAdd = (address: Address) => {
    const payload = addressToPayload(address);
    const opts = { onSuccess: onCreateSuccess, onError: onCreateError };
    if (address.type === "Supplier") createSupplier.mutate(payload, opts);
    else createCustomer.mutate(payload, opts);
  };

  return (
    <div>
      <PageHeader
        title="Addresses"
        description="Customers and suppliers"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={() => setAdding((v) => !v)}
            >
              <Zap className="h-3.5 w-3.5" /> Quick Add
            </Button>
            <Button
              size="sm"
              className="h-8 gap-1.5"
              onClick={() => nav({ to: "/address/$id", params: { id: "new" } })}
            >
              <Plus className="h-3.5 w-3.5" /> Add Address
            </Button>
          </>
        }
      />
      <Toolbar>
        <Select
          value={kind}
          onValueChange={(v) => {
            setKind(v as AddressKindFilter);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-8 w-[160px] text-[13px]" aria-label="Filter by kind">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {KIND_FILTER_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <TableSearch
          value={q}
          onChange={(v) => {
            setQ(v);
            setPage(1);
          }}
          placeholder="Search code, name, town…"
        />
        <div className="ml-auto">
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </Toolbar>

      {directory.isPending ? (
        <div className="flex items-center gap-2 px-5 py-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading addresses…
        </div>
      ) : directory.isError ? (
        <div className="m-5 rounded-md border border-destructive/40 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">
            {(directory.error as ApiError)?.message ?? "Failed to load addresses"}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 h-8"
            onClick={() => directory.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : (
        <div className="px-5 py-3">
          <DataTable
            rows={directory.items}
            rowKey={addressRowKey}
            columns={columns}
            quickAddRow={
              adding ? (
                <QuickAddAddress
                  onAdd={onQuickAdd}
                  onCancel={() => setAdding(false)}
                  isSaving={isSaving}
                />
              ) : undefined
            }
            onRowClick={(r) => nav({ to: "/address/$id", params: { id: r.id } })}
            emptyState={
              q
                ? "No addresses match your search."
                : kind === "all"
                  ? "No addresses yet."
                  : `No ${kind === "Supplier" ? "suppliers" : "customers"} yet.`
            }
          />
          <PaginationBar
            page={directory.meta.page}
            pageSize={directory.meta.pageSize}
            total={directory.meta.total}
            onPageChange={setPage}
            onPageSizeChange={(n) => {
              setPageSize(n);
              setPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
}

function QuickAddAddress({ onAdd, onCancel, isSaving }: QuickAddAddressProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<QuickAddressFormValues>({
    resolver: zodResolver(QuickAddressFormSchema),
    defaultValues: { code: "", name: "", type: "Customer", town: "", country: "" },
    mode: "onTouched",
  });
  const busy = isSaving || isSubmitting;
  const submit = handleSubmit(
    (values) => {
      onAdd({
        id: "",
        code: values.code,
        name: values.name,
        type: values.type,
        address1: values.town || "—",
        town: values.town ?? "",
        country: values.country || "—",
      });
    },
    (errors) => toast.error(firstFormErrorMessage(errors) ?? "Code and Name are required"),
  );
  return (
    <form className="flex items-center gap-2 px-3 py-1.5" onSubmit={submit} noValidate>
      <Plus className="h-3.5 w-3.5 text-muted-foreground" />
      <Input autoFocus placeholder="Code" className="h-7 w-24 text-[13px] font-mono" disabled={busy} {...register("code")} />
      <Input placeholder="Name" className="h-7 flex-1 text-[13px]" disabled={busy} {...register("name")} />
      <select className="h-7 px-2 rounded border border-border bg-background text-[13px]" disabled={busy} {...register("type")}>
        <option value="Customer">Customer</option>
        <option value="Supplier">Supplier</option>
      </select>
      <Input placeholder="Town" className="h-7 w-32 text-[13px]" disabled={busy} {...register("town")} />
      <Input placeholder="Country" className="h-7 w-28 text-[13px]" disabled={busy} {...register("country")} />
      <Button type="submit" size="sm" className="h-7" disabled={busy}>
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Add"}
      </Button>
      <Button type="button" size="sm" variant="ghost" className="h-7" onClick={onCancel} disabled={busy}>
        Cancel
      </Button>
    </form>
  );
}
