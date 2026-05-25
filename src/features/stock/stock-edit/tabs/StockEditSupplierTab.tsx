import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useReferenceOptions } from "@/hooks/use-reference-options";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { FormGrid } from "@/components/form-primitives";
import { FormNumberField, FormTextField } from "@/components/form";
import { ReferenceField } from "@/components/reference-field";
import type { StockFormValues } from "../../stock-form-schema";
import {
  applyPartyFromOption,
  buildPartyInfoRows,
  partyDisplayFromForm,
  SelectedPartyInfo,
} from "../form-helpers";
import { STOCK_FIELD_CLASS } from "../field-classes";
import { ReferenceKlass } from "@/lib/reference-registry";
import { refId } from "../utils";

export function StockEditSupplierTab() {
  const { NUM, MONO } = STOCK_FIELD_CLASS;
  const { control, setValue, watch } = useFormContext<StockFormValues>();

  const formValues = watch();
  const supplierLabel = formValues.supplier;
  const manufacturerLabel = formValues.manufacturer;
  const supplierId = formValues.supplierId;
  const manufacturerId = formValues.manufacturerId;
  const supplierCountry = formValues.supplierCountry;
  const manufacturerCountry = formValues.manufacturerCountry;

  const { options: supplierOptions } = useReferenceOptions({
    klass: ReferenceKlass.Supplier,
    search: "",
    enabled: supplierId != null,
  });
  const { options: manufacturerOptions } = useReferenceOptions({
    klass: ReferenceKlass.Supplier,
    search: "",
    enabled: manufacturerId != null,
  });

  useEffect(() => {
    if (supplierId == null || supplierCountry?.trim()) return;
    const opt = supplierOptions.find((o) => String(o.id) === String(supplierId));
    if (opt) applyPartyFromOption(setValue, "supplier", supplierId, opt);
  }, [supplierId, supplierOptions, supplierCountry, setValue]);

  useEffect(() => {
    if (manufacturerId == null || manufacturerCountry?.trim()) return;
    const opt = manufacturerOptions.find((o) => String(o.id) === String(manufacturerId));
    if (opt) applyPartyFromOption(setValue, "manufacturer", manufacturerId, opt);
  }, [manufacturerId, manufacturerOptions, manufacturerCountry, setValue]);

  return (
    <TabsContent value="supplier" className="mt-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <EditCard title="Supplier">
          <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
            <Controller
              control={control}
              name="supplierId"
              render={({ field }) => (
                <ReferenceField
                  label="Select Supplier"
                  klass={ReferenceKlass.Supplier}
                  value={field.value ?? null}
                  displayLabel={supplierLabel}
                  placeholder="Search suppliers…"
                  className="col-span-2"
                  onChange={(id, opt) => {
                    field.onChange(refId(id));
                    applyPartyFromOption(setValue, "supplier", id, opt);
                  }}
                />
              )}
            />
            <FormTextField<StockFormValues>
              name="supplierItemCode"
              label="Item Code"
              mono
              inputClassName={MONO}
            />
          </div>
          <SelectedPartyInfo
            partyLabel="supplier"
            rows={buildPartyInfoRows(partyDisplayFromForm("supplier", formValues))}
          />
        </EditCard>

        <EditCard title="Manufacturer">
          <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
            <Controller
              control={control}
              name="manufacturerId"
              render={({ field }) => (
                <ReferenceField
                  label="Select Manufacturer"
                  klass={ReferenceKlass.Supplier}
                  value={field.value ?? null}
                  displayLabel={manufacturerLabel}
                  placeholder="Search manufacturers…"
                  className="col-span-2"
                  onChange={(id, opt) => {
                    field.onChange(refId(id));
                    applyPartyFromOption(setValue, "manufacturer", id, opt);
                  }}
                />
              )}
            />
            <FormTextField<StockFormValues>
              name="manufrItemCode"
              label="Item Code"
              mono
              inputClassName={MONO}
            />
          </div>
          <SelectedPartyInfo
            partyLabel="manufacturer"
            rows={buildPartyInfoRows(partyDisplayFromForm("manufacturer", formValues))}
          />
        </EditCard>

        <EditCard title="Reorder Settings">
          <FormGrid cols={1}>
            <FormNumberField<StockFormValues>
              name="wholesaleReorderLevel"
              label="Wholesale Re-Order Level"
              inputClassName={NUM}
            />
            <FormNumberField<StockFormValues>
              name="reorderQty"
              label="Re-Order Quantity"
              inputClassName={NUM}
            />
            <FormNumberField<StockFormValues>
              name="wholesaleTopUpTo"
              label="Wholesale Top Up To"
              inputClassName={NUM}
            />
          </FormGrid>
        </EditCard>
      </div>
    </TabsContent>
  );
}
