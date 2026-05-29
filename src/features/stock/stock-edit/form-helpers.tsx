import type { ReactNode } from "react";
import {
  Controller,
  useFormContext,
  type FieldPath,
  type UseFormSetValue,
} from "react-hook-form";
import { Field } from "@/components/form-primitives";
import { FieldError } from "@/components/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { referenceLabel, type ReferenceOption } from "@/lib/reference";
import type { StockFormValues } from "../stock-form-schema";
import { STOCK_FIELD_CLASS } from "./field-classes";
import { refId } from "./utils";

type PartyFieldPrefix = "supplier" | "manufacturer";

export type PartyInfoRow = { label: string; value?: string };

export type PartyDisplayValues = {
  id?: string | number | null;
  code?: string;
  name?: string;
  kind?: string;
  address?: string;
  address2?: string;
  town?: string;
  region?: string;
  zip?: string;
  country?: string;
  isoCode?: string;
  contact?: string;
  phone?: string;
  email?: string;
  website?: string;
};

type PartyFormKeys = {
  label: FieldPath<StockFormValues>;
  code: FieldPath<StockFormValues>;
  name: FieldPath<StockFormValues>;
  kind: FieldPath<StockFormValues>;
  address: FieldPath<StockFormValues>;
  address2: FieldPath<StockFormValues>;
  town: FieldPath<StockFormValues>;
  region: FieldPath<StockFormValues>;
  zip: FieldPath<StockFormValues>;
  country: FieldPath<StockFormValues>;
  iso: FieldPath<StockFormValues>;
  contact: FieldPath<StockFormValues>;
  phone: FieldPath<StockFormValues>;
  email: FieldPath<StockFormValues>;
  website: FieldPath<StockFormValues>;
};

const PARTY_FORM_KEYS: Record<PartyFieldPrefix, PartyFormKeys> = {
  supplier: {
    label: "supplier",
    code: "supplierCode",
    name: "supplierName",
    kind: "supplierKind",
    address: "supplierAddress",
    address2: "supplierAddress2",
    town: "supplierTown",
    region: "supplierRegion",
    zip: "supplierZip",
    country: "supplierCountry",
    iso: "supplierIso",
    contact: "supplierContact",
    phone: "supplierPhone",
    email: "supplierEmail",
    website: "supplierWebsite",
  },
  manufacturer: {
    label: "manufacturer",
    code: "manufacturerCode",
    name: "manufacturerName",
    kind: "manufacturerKind",
    address: "manufacturerAddress",
    address2: "manufacturerAddress2",
    town: "manufacturerTown",
    region: "manufacturerRegion",
    zip: "manufacturerZip",
    country: "manufacturerCountry",
    iso: "manufacturerIso",
    contact: "manufacturerContact",
    phone: "manufacturerPhone",
    email: "manufacturerEmail",
    website: "manufacturerWebsite",
  },
};

function optStr(opt: ReferenceOption | undefined, ...keys: string[]): string {
  if (!opt) return "";
  for (const key of keys) {
    const v = opt[key];
    if (v != null && String(v).trim() !== "") return String(v);
  }
  return "";
}

function partyCountryIso(opt: ReferenceOption): { country: string; iso: string } {
  const countryRaw = opt.country;
  if (countryRaw && typeof countryRaw === "object") {
    const c = countryRaw as Record<string, unknown>;
    return {
      country: c.name != null ? String(c.name) : "",
      iso: String(c.iso_1 ?? c.iso_2 ?? c.iso_code ?? ""),
    };
  }
  return {
    country: countryRaw != null ? String(countryRaw) : "",
    iso: String(opt.iso_1 ?? opt.iso_2 ?? opt.iso_code ?? ""),
  };
}

/** Values for the supplier/manufacturer info panel (from form state or a reference row). */
export function partyDisplayFromOption(
  id: string | number | null,
  opt?: ReferenceOption,
): PartyDisplayValues {
  if (!opt || id == null || id === "") return {};
  const { country, iso } = partyCountryIso(opt);
  return {
    id,
    code: optStr(opt, "code"),
    name: optStr(opt, "name"),
    kind: optStr(opt, "kind"),
    address: optStr(opt, "address_1", "address1"),
    address2: optStr(opt, "address_2", "address2"),
    town: optStr(opt, "town"),
    region: optStr(opt, "region", "state"),
    zip: optStr(opt, "zip"),
    country,
    isoCode: iso,
    contact: optStr(opt, "contact"),
    phone: optStr(opt, "phone", "fax"),
    email: optStr(opt, "email"),
    website: optStr(opt, "website"),
  };
}

/** Syncs supplier/manufacturer detail fields when a reference row is chosen. */
export function applyPartyFromOption(
  setValue: UseFormSetValue<StockFormValues>,
  prefix: PartyFieldPrefix,
  id: string | number | null,
  opt?: ReferenceOption,
): void {
  const keys = PARTY_FORM_KEYS[prefix];
  const dirty = { shouldDirty: true };
  const display = partyDisplayFromOption(id, opt);

  if (!opt || id == null || id === "") {
    for (const path of Object.values(keys)) {
      setValue(path, "" as never, dirty);
    }
    return;
  }

  setValue(keys.label, referenceLabel(opt) as never, dirty);
  setValue(keys.code, display.code ?? "", dirty);
  setValue(keys.name, display.name ?? "", dirty);
  setValue(keys.kind, display.kind ?? "", dirty);
  setValue(keys.address, display.address ?? "", dirty);
  setValue(keys.address2, display.address2 ?? "", dirty);
  setValue(keys.town, display.town ?? "", dirty);
  setValue(keys.region, display.region ?? "", dirty);
  setValue(keys.zip, display.zip ?? "", dirty);
  setValue(keys.country, display.country ?? "", dirty);
  setValue(keys.iso, display.isoCode ?? "", dirty);
  setValue(keys.contact, display.contact ?? "", dirty);
  setValue(keys.phone, display.phone ?? "", dirty);
  setValue(keys.email, display.email ?? "", dirty);
  setValue(keys.website, display.website ?? "", dirty);
}

/** Rows shown in the supplier/manufacturer detail panel. */
export function buildPartyInfoRows(values: PartyDisplayValues): PartyInfoRow[] {
  return [
    { label: "ID", value: values.id != null && values.id !== "" ? String(values.id) : undefined },
    { label: "Name", value: values.name },
    { label: "Code", value: values.code },
    { label: "Kind", value: values.kind },
    { label: "Address", value: values.address },
    { label: "Address 2", value: values.address2 },
    { label: "Town", value: values.town },
    { label: "Region", value: values.region },
    { label: "Zip", value: values.zip },
    { label: "Country", value: values.country },
    { label: "ISO Code", value: values.isoCode },
    { label: "Contact", value: values.contact },
    { label: "Phone", value: values.phone },
    { label: "Email", value: values.email },
    { label: "Website", value: values.website },
  ];
}

export function partyDisplayFromForm(
  prefix: PartyFieldPrefix,
  values: StockFormValues,
): PartyDisplayValues {
  if (prefix === "supplier") {
    return {
      id: values.supplierId,
      code: values.supplierCode,
      name: values.supplierName,
      kind: values.supplierKind,
      address: values.supplierAddress,
      address2: values.supplierAddress2,
      town: values.supplierTown,
      region: values.supplierRegion,
      zip: values.supplierZip,
      country: values.supplierCountry,
      isoCode: values.supplierIso,
      contact: values.supplierContact,
      phone: values.supplierPhone,
      email: values.supplierEmail,
      website: values.supplierWebsite,
    };
  }
  return {
    id: values.manufacturerId,
    code: values.manufacturerCode,
    name: values.manufacturerName,
    kind: values.manufacturerKind,
    address: values.manufacturerAddress,
    address2: values.manufacturerAddress2,
    town: values.manufacturerTown,
    region: values.manufacturerRegion,
    zip: values.manufacturerZip,
    country: values.manufacturerCountry,
    isoCode: values.manufacturerIso,
    contact: values.manufacturerContact,
    phone: values.manufacturerPhone,
    email: values.manufacturerEmail,
    website: values.manufacturerWebsite,
  };
}

export function SelectedPartyInfo({
  partyLabel,
  rows,
}: {
  partyLabel: string;
  rows: PartyInfoRow[];
}) {
  const hasSelection = rows.some((r) => (r.value?.trim() ?? "") !== "");

  if (!hasSelection) {
    return (
      <p className="mt-3 text-[12.5px] text-muted-foreground">
        No {partyLabel.toLowerCase()} selected.
      </p>
    );
  }

  return (
    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 rounded-md border border-border bg-muted/30 p-3 text-[12.5px]">
      {rows.map((row) => (
        <p key={row.label} className="min-w-0">
          <span className="text-muted-foreground">{row.label}:</span> {row.value?.trim() || "—"}
        </p>
      ))}
    </div>
  );
}

/** Edited title falls back to `title` only when unset (`??`), not when cleared (`""`). */
export function StockEditedTitleField() {
  const {
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<StockFormValues>();
  const title = watch("title");
  const error = (errors.editedTitle ?? errors.title)?.message as string | undefined;
  const errorId = error ? "editedTitle-error" : undefined;

  return (
    <Field label="Edited Title">
      <Controller
        control={control}
        name="editedTitle"
        render={({ field }) => (
          <Input
            value={field.value ?? title ?? ""}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            disabled={isSubmitting}
            aria-invalid={!!error}
            aria-describedby={errorId}
            className={STOCK_FIELD_CLASS.TXT}
          />
        )}
      />
      <FieldError id={errorId} message={error} />
    </Field>
  );
}

/** Read-only stock code display (disabled inputs on several tabs). */
export function StockItemCodeField({ className }: { className?: string }) {
  const { register } = useFormContext<StockFormValues>();
  return (
    <Field label="Item" className={className}>
      <Input
        disabled
        className={STOCK_FIELD_CLASS.MONO}
        {...register("code")}
      />
    </Field>
  );
}

/** Read-only first cost (`factyCost / factyPer`) on the cost tab. */
export function StockFirstCostField({ className }: { className?: string }) {
  const { watch } = useFormContext<StockFormValues>();
  const firstCost = watch("firstCost");
  return (
    <Field label="First Cost" className={className}>
      <Input
        type="number"
        step="0.0001"
        value={firstCost ?? ""}
        disabled
        className={STOCK_FIELD_CLASS.NUM}
        readOnly
      />
    </Field>
  );
}

type StockFlagCodeCheckboxProps = {
  code: string;
  label: string;
};

/** Checkbox bound to `flagCodes.<code>` — preserves flag tab styling. */
export function StockFlagCodeCheckbox({ code, label }: StockFlagCodeCheckboxProps) {
  const { control, formState } = useFormContext<StockFormValues>();
  const name = `flagCodes.${code}` as FieldPath<StockFormValues>;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={false}
      render={({ field }) => (
        <label className="flex items-center gap-2 px-2 py-1.5 rounded border border-border hover:bg-accent cursor-pointer text-[13px]">
          <Checkbox
            size="sm"
            checked={field.value === true}
            onCheckedChange={(v) => field.onChange(Boolean(v))}
            onBlur={field.onBlur}
            ref={field.ref}
            disabled={formState.isSubmitting}
          />
          <span className="text-muted-foreground">({code})</span> {label}
        </label>
      )}
    />
  );
}

/** Checkbox for identity strip (TO Zoho). */
export function StockInlineCheckbox({
  name,
  children,
  className,
}: {
  name: FieldPath<StockFormValues>;
  children: ReactNode;
  className?: string;
}) {
  const { control, formState } = useFormContext<StockFormValues>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <label className={className ?? "inline-flex items-center gap-2 text-[13px] mt-3 cursor-pointer"}>
          <Checkbox
            size="sm"
            checked={!!field.value}
            onCheckedChange={(v) => field.onChange(Boolean(v))}
            onBlur={field.onBlur}
            ref={field.ref}
            disabled={formState.isSubmitting}
          />
          {children}
        </label>
      )}
    />
  );
}
