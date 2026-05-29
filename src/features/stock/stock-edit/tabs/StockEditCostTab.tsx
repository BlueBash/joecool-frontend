import { getRouteApi } from "@tanstack/react-router";
import { Controller, useFormContext } from "react-hook-form";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { FormGrid } from "@/components/form-primitives";
import { FormNumberField, FormReferenceField, FormSelectField, FormTextField } from "@/components/form";
import { ReferenceSelect } from "@/components/reference-select";
import { ReferenceKlass } from "@/lib/reference-registry";
import { STOCK_COST_REFERENCE_DISPLAY } from "@/lib/reference-display";
import { Button } from "@/components/ui/button";
import type { StockFormValues } from "../../stock-form-schema";
import { CostCalcRow } from "../cost/CostCalcRow";
import { CostCalcResultField, CostFlowRow } from "../cost/CostFlowRow";
import { useStockCostTab } from "../cost/useStockCostTab";
import { STOCK_FIELD_CLASS } from "../field-classes";
import { refId } from "../utils";

const routeApi = getRouteApi("/stock/$id");

export function StockEditCostTab() {
  const { id } = routeApi.useParams();
  const isNew = id === "new";
  const { TXT, NUM, MONO } = STOCK_FIELD_CLASS;
  const { control, watch } = useFormContext<StockFormValues>();
  const cost = useStockCostTab(id, isNew);

  const displayLabel = watch("display");

  return (
    <TabsContent value="cost" className="mt-3">
      <div className="flex flex-wrap gap-2 mb-3">
        {cost.canSaveCost && (
          <Button
            size="sm"
            className="h-8"
            disabled={cost.isSavingCost}
            onClick={() => void cost.handleSaveCostPrices()}
          >
            Save Stock Cost Prices
          </Button>
        )}
        {/* <Button variant="outline" size="sm" className="h-8" onClick={cost.handleIgnore}>
          Ignore
        </Button> */}
      </div>

      <EditCard title="Supplier">
        <FormGrid cols={3}>
          <FormTextField<StockFormValues>
            name="supplierCode"
            label="Supplier Code"
            readOnly
            inputClassName={MONO}
          />
          <FormTextField<StockFormValues>
            name="supplierName"
            label="Supplier Name"
            inputClassName={TXT}
          />
          <FormNumberField<StockFormValues>
            name="supplierFobX"
            label="Supplier FOB X"
            step="0.01"
            readOnly
            inputClassName={NUM}
          />
        </FormGrid>
      </EditCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EditCard
          title="Country Of Origin Costs"
          headerActions={
            <div className="flex items-center gap-1">
              <label className="text-[12px] font-medium text-muted-foreground">Currency</label>
              <FormSelectField<StockFormValues>
                name="factCurrencyId"
                className="max-w-[180px]"
              >
                <option value="">—</option>
                {cost.currencyOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}
                  </option>
                ))}
              </FormSelectField>
            </div>
          }
        >
          <div className="flex flex-col gap-2">
            <CostCalcRow
              left={{ name: "factyCost", label: "Facty Cost", step: "0.01" }}
              middle={{ name: "factyPer", label: "Per" }}
              result={{ name: "firstCost", label: "First Cost" }}
            />

            <CostFlowRow>
              <FormTextField<StockFormValues> name="factyPack" label="Facty Pack" inputClassName={TXT} />
              <FormNumberField<StockFormValues>
                name="factyAmount"
                label="Amount"
                step="0.01"
                inputClassName={NUM}
              />
              <CostCalcResultField name="factyInvd" label="Facty Invd" />
            </CostFlowRow>

            <CostFlowRow>
              <FormTextField<StockFormValues>
                name="packagingName"
                label="Packaging"
                readOnly
                inputClassName={TXT}
              />
              <FormNumberField<StockFormValues>
                name="packagingNewAmount"
                label="New Amount"
                step="0.01"
                inputClassName={NUM}
              />
              <CostCalcResultField name="agentBase" label="Agent Base" />
            </CostFlowRow>
            <CostFlowRow>
              <FormNumberField<StockFormValues>
                name="agentCommPct"
                label="Agent Com%"
                step="0.01"
                inputClassName={NUM}
              />
              <CostCalcResultField name="agentAmount" label="Agent Amount" />
              <CostCalcResultField name="agentCost" label="Agent Cost" />
            </CostFlowRow>
            <CostFlowRow>
              <FormNumberField<StockFormValues>
                name="agentPackPct"
                label="Agent Pack%"
                step="0.01"
                inputClassName={NUM}
              />
              <CostCalcResultField name="agentPackAmount" label="Agent Pack Amount" />
              <CostCalcResultField name="fobBase" label="FOB Base" />
            </CostFlowRow>
            <CostFlowRow>
              <FormNumberField<StockFormValues>
                name="qualityPct"
                label="Quality%"
                step="0.01"
                inputClassName={NUM}
              />
              <div className="hidden sm:block" aria-hidden />
              <CostCalcResultField name="qualityAmount" label="Quality Amount" />
            </CostFlowRow>
            <CostFlowRow>
              <FormNumberField<StockFormValues>
                name="probsPct"
                label="Probs%"
                step="0.01"
                inputClassName={NUM}
              />
              <div className="hidden sm:block" aria-hidden />
              <CostCalcResultField name="probsAmount" label="Probs Amount" />
            </CostFlowRow>
            <CostFlowRow>
              <FormNumberField<StockFormValues>
                name="chargesPct"
                label="Charges%"
                step="0.01"
                inputClassName={NUM}
              />
              <div className="hidden sm:block" aria-hidden />
              <CostCalcResultField name="chargesAmount" label="Charges Amount" />
            </CostFlowRow>
            <CostFlowRow>
              <FormNumberField<StockFormValues>
                name="fobChargesPct"
                label="FOB Charges%"
                step="0.01"
                inputClassName={NUM}
              />
              <div className="hidden sm:block" aria-hidden />
              <CostCalcResultField name="fobChargesAmount" label="FOB Charges Amount" />
            </CostFlowRow>
            <CostCalcResultField name="itemOb" label="Item OB" className="w-full" />
            <CostFlowRow>
              <FormReferenceField<StockFormValues>
                name="jcPackingId"
                labelKey="jcPacking"
                amountKey="jcPackingAmount"
                label="JC Packing"
                klass={ReferenceKlass.StockCostAssembly}
                displayConfig={STOCK_COST_REFERENCE_DISPLAY}
                inputClassName={TXT}
                placeholder="Search JC packing…"
              />
              <FormNumberField<StockFormValues>
                name="jcPackingAmount"
                label="JC Packing Amount"
                step="0.01"
                inputClassName={NUM}
                readOnly
              />
              <CostCalcResultField name="jcObCost" label="JC OB Cost" />
            </CostFlowRow>

            <CostFlowRow>
              <FormNumberField<StockFormValues>
                name="freightPct"
                label="Freight%"
                step="0.01"
                inputClassName={NUM}
              />
              <CostCalcResultField name="freightAmount" label="Freight Amount" />
              <CostCalcResultField name="arriveUk" label="Arrive UK" />
            </CostFlowRow>

            <CostCalcResultField name="calcFobX" label="Calc FOB X" decimals={2} className="max-w-md" />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              size="sm"
              className="h-8"
              disabled={!cost.supplierId}
              onClick={() => void cost.handleSaveFobX()}
            >
              Save FOB X in Supp Addr Record
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              disabled={!cost.supplierId}
              onClick={() => void cost.handleSaveSuppDefaults()}
            >
              Save as Supp Defaults
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              disabled={!cost.supplierId}
              onClick={() => void cost.handleReadSuppDefaults()}
            >
              Read Supp Defaults
            </Button>
          </div>
        </EditCard>

        <div>
          <EditCard title="Exchange Rate">
            <FormGrid cols={2}>
              <FormNumberField<StockFormValues>
                name="currentRate"
                label="Current Rate"
                step="0.000001"
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues>
                name="lastUsedXRate"
                label="Last Used X Rate"
                step="0.000001"
                readOnly
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues>
                name="buyAdjustPct"
                label="Buy Adjust %"
                step="0.01"
                readOnly
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues>
                name="effectiveRate"
                label="Effective Rate"
                step="0.000001"
                readOnly
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues>
                name="arriveUkRate"
                label="Arrive UK (GBP)"
                step="0.0001"
                readOnly
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues>
                name="upGbp"
                label="(Up) GBP"
                step="0.0001"
                readOnly
                inputClassName={NUM}
              />
            </FormGrid>
          </EditCard>

          <EditCard title="UK Costs">
            <FormGrid cols={3}>
              <div className="md:col-span-3">
                <CostCalcRow
                  left={{ name: "ukDutyPct", label: "UK Duty %", step: "0.01" }}
                  middle={{ name: "upGbp", label: "(Up) GBP", readOnly: true }}
                  result={{ name: "ukDutyAmount", label: "UK Duty Amount" }}
                />
              </div>
              <FormNumberField<StockFormValues>
                name="dutyPaid"
                label="Duty Paid"
                step="0.0001"
                readOnly
                inputClassName={NUM}
              />
              <div className="md:col-span-3">
                <CostCalcRow
                  left={{ name: "clearancePct", label: "Clearance %", step: "0.01" }}
                  result={{ name: "clearanceAmount", label: "Clearance Amount" }}
                />
              </div>
              <FormNumberField<StockFormValues>
                name="ukLanded"
                label="UK Landed"
                step="0.0001"
                readOnly
                inputClassName={NUM}
              />
              <div className="md:col-span-3">
                <CostCalcRow
                  left={{ name: "deliveryPct", label: "Delivery %", step: "0.01" }}
                  result={{ name: "deliveryAmount", label: "Delivery Amount" }}
                />
              </div>
              <FormNumberField<StockFormValues>
                name="delivered"
                label="Delivered"
                step="0.0001"
                readOnly
                inputClassName={NUM}
              />
              <FormReferenceField<StockFormValues>
                name="assemblySettingId"
                labelKey="assembly"
                amountKey="assemblyAmount"
                label="Assembly"
                klass={ReferenceKlass.StockCostPacking}
                displayConfig={STOCK_COST_REFERENCE_DISPLAY}
                inputClassName={TXT}
                placeholder="Search assembly…"
              />
              <div className="md:col-span-3">
                <CostCalcRow
                  left={{ name: "assemblyAmount", label: "Assembly Amount", step: "0.01" }}
                  result={{ name: "assembled", label: "Assembled" }}
                />
              </div>
              <Controller
                control={control}
                name="costDisplaySettingId"
                render={({ field }) => (
                  <div>
                    <label className="text-[12px] font-medium text-muted-foreground">Display</label>
                    <ReferenceSelect
                      klass={ReferenceKlass.Display}
                      value={field.value ?? null}
                      displayLabel={displayLabel}
                      placeholder="Search displays…"
                      inputClassName={TXT}
                      className="mt-1"
                      onChange={(id, opt) => {
                        field.onChange(refId(id));
                        if (id != null && opt) {
                          cost.onDisplayCostChange(
                            Number(id),
                            String(opt.name ?? opt.code ?? ""),
                            Number(opt.cost) || 0,
                          );
                        }
                      }}
                    />
                  </div>
                )}
              />
              <div className="md:col-span-3">
                <CostCalcRow
                  left={{ name: "displayAmount", label: "Display Amount", step: "0.01" }}
                  result={{ name: "calcReady", label: "Calc Ready" }}
                />
              </div>
              <FormSelectField<StockFormValues> name="readyCurrencyId" label="Ready currency">
                <option value="">—</option>
                {cost.currencyOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}
                  </option>
                ))}
              </FormSelectField>
              <FormNumberField<StockFormValues>
                name="per"
                label="Per (ready)"
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues>
                name="roundedUp"
                label="Rounded Up"
                step="0.01"
                readOnly
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues>
                name="landedFactr"
                label="Landed Factr"
                step="0.0001"
                readOnly
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues>
                name="calcdMarkup"
                label="Calcd Markup"
                step="0.01"
                readOnly
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues>
                name="gbpWhlsl"
                label="GBP Whlsl"
                step="0.01"
                readOnly
                inputClassName={NUM}
              />
            </FormGrid>
          </EditCard>
        </div>
      </div>
    </TabsContent>
  );
}
