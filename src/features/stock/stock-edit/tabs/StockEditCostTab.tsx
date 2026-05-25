import { toast } from "sonner";
import { TabsContent } from "@/components/ui/tabs";
import { EditCard } from "@/components/edit-screen";
import { FormGrid } from "@/components/form-primitives";
import { FormNumberField, FormTextField } from "@/components/form";
import { Button } from "@/components/ui/button";
import type { StockFormValues } from "../../stock-form-schema";
import { StockFirstCostField } from "../form-helpers";
import { STOCK_FIELD_CLASS } from "../field-classes";

export function StockEditCostTab() {
  const { TXT, NUM, MONO } = STOCK_FIELD_CLASS;

  return (
    <TabsContent value="cost" className="mt-3">
      <EditCard title="Supplier">
        <FormGrid cols={3}>
          <FormTextField<StockFormValues> name="supplierCode" label="Supplier Code" mono inputClassName={MONO} />
          <FormTextField<StockFormValues> name="supplierName" label="Supplier Name" inputClassName={TXT} />
          <FormNumberField<StockFormValues>
            name="supplierFobX"
            label="Supplier FOB X"
            step="0.01"
            inputClassName={NUM}
          />
        </FormGrid>
      </EditCard>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EditCard title="Country Of Origin Costs">
          <div className="flex justify-end mb-2">
            <FormTextField<StockFormValues>
              name="currencyCode"
              label="Currency"
              inputClassName={TXT}
              className="max-w-[140px]"
            />
          </div>
          <FormGrid cols={2}>
            <FormNumberField<StockFormValues> name="factyCost" label="Facty Cost" step="0.01" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="factyPer" label="Per" inputClassName={NUM} />
            <StockFirstCostField className="md:col-span-2" />
            <FormTextField<StockFormValues> name="factyPack" label="Facty Pack" inputClassName={TXT} />
            <FormNumberField<StockFormValues> name="factyAmount" label="Amount" step="0.01" inputClassName={NUM} />
            <FormNumberField<StockFormValues>
              name="factyInvd"
              label="Facty Invd"
              step="0.01"
              inputClassName={NUM}
              className="md:col-span-2"
            />
            <FormTextField<StockFormValues> name="packagingName" label="Packaging" inputClassName={TXT} />
            <FormNumberField<StockFormValues>
              name="packagingNewAmount"
              label="New Amount"
              step="0.01"
              inputClassName={NUM}
            />
            <FormNumberField<StockFormValues> name="agentCommPct" label="Agent Com%" step="0.01" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="agentAmount" label="Agent Amount" step="0.01" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="agentBase" label="Agent Base" step="0.01" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="agentCost" label="Agent Cost" step="0.01" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="agentPackPct" label="Agent Pack%" step="0.01" inputClassName={NUM} />
            <FormNumberField<StockFormValues>
              name="agentPackAmount"
              label="Agent Pack Amount"
              step="0.01"
              inputClassName={NUM}
            />
            <FormNumberField<StockFormValues> name="qualityPct" label="Quality%" step="0.01" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="probsPct" label="Probs%" step="0.01" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="chargesPct" label="Charges%" step="0.01" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="fobChargesPct" label="FOB Charges%" step="0.01" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="itemOb" label="Item OB" step="0.01" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="fobBase" label="FOB Base" step="0.01" inputClassName={NUM} />
            <FormTextField<StockFormValues> name="jcPacking" label="JC Packing" inputClassName={TXT} />
            <FormNumberField<StockFormValues>
              name="jcPackingAmount"
              label="JC Packing Amount"
              step="0.01"
              inputClassName={NUM}
            />
            <FormNumberField<StockFormValues>
              name="jcObCost"
              label="JC OB Cost"
              step="0.01"
              inputClassName={NUM}
              className="md:col-span-2"
            />
            <FormNumberField<StockFormValues> name="freightPct" label="Freight%" step="0.01" inputClassName={NUM} />
            <FormNumberField<StockFormValues>
              name="freightAmount"
              label="Freight% Amount"
              step="0.01"
              inputClassName={NUM}
            />
            <FormNumberField<StockFormValues> name="arriveUk" label="Arrive UK" step="0.01" inputClassName={NUM} />
            <FormNumberField<StockFormValues> name="calcFobX" label="Calc FOB X" step="0.01" inputClassName={NUM} />
          </FormGrid>
          <div className="flex gap-2 mt-3">
            <Button size="sm" className="h-8" onClick={() => toast.success("Saved FOB X")}>
              Save FOB X in Supp Addr Record
            </Button>
            <Button variant="outline" size="sm" className="h-8" onClick={() => toast.success("Saved")}>
              Save as Supp Defaults
            </Button>
            <Button variant="outline" size="sm" className="h-8" onClick={() => toast.success("Read")}>
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
                step="0.0001"
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues>
                name="lastUsedXRate"
                label="Last Used X Rate"
                step="0.0001"
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues>
                name="buyAdjustPct"
                label="Buy Adjust %"
                step="0.01"
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues>
                name="effectiveRate"
                label="Effective Rate"
                step="0.0001"
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues>
                name="arriveUkRate"
                label="Arrive UK Rate"
                step="0.0001"
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues> name="upGbp" label="(Up) GBP" step="0.0001" inputClassName={NUM} />
            </FormGrid>
          </EditCard>

          <EditCard title="UK Costs">
            <FormGrid cols={3}>
              <FormNumberField<StockFormValues> name="ukDutyPct" label="UK Duty %" step="0.01" inputClassName={NUM} />
              <FormNumberField<StockFormValues>
                name="ukDutyAmount"
                label="UK Duty% Amount"
                step="0.0001"
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues> name="dutyPaid" label="Duty Paid" step="0.0001" inputClassName={NUM} />
              <FormNumberField<StockFormValues>
                name="clearancePct"
                label="Clearance %"
                step="0.01"
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues>
                name="clearanceAmount"
                label="Clearance% Amount"
                step="0.0001"
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues> name="ukLanded" label="UK Landed" step="0.0001" inputClassName={NUM} />
              <FormNumberField<StockFormValues>
                name="deliveryPct"
                label="Delivery %"
                step="0.01"
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues>
                name="deliveryAmount"
                label="Delivery% Amount"
                step="0.0001"
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues> name="delivered" label="Delivered" step="0.0001" inputClassName={NUM} />
              <FormTextField<StockFormValues> name="assembly" label="Assembly" inputClassName={TXT} />
              <FormNumberField<StockFormValues>
                name="assemblyAmount"
                label="Assembly Amount"
                step="0.01"
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues> name="assembled" label="Assembled" step="0.0001" inputClassName={NUM} />
              <FormTextField<StockFormValues> name="display" label="Display" inputClassName={TXT} />
              <FormNumberField<StockFormValues>
                name="displayAmount"
                label="Display Amount"
                step="0.01"
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues> name="calcReady" label="Calc Ready" step="0.0001" inputClassName={NUM} />
              <FormNumberField<StockFormValues> name="per" label="Per" inputClassName={NUM} />
              <FormNumberField<StockFormValues> name="roundedUp" label="Rounded Up" step="0.01" inputClassName={NUM} />
              <FormNumberField<StockFormValues>
                name="landedFactr"
                label="Landed Factr"
                step="0.0001"
                inputClassName={NUM}
              />
              <FormNumberField<StockFormValues> name="storedReady" label="Stored Ready" step="0.01" inputClassName={NUM} />
              <FormNumberField<StockFormValues> name="calcdMarkup" label="Calcd Markup" step="0.01" inputClassName={NUM} />
              <FormNumberField<StockFormValues> name="gbpWhlsl" label="GBP Whlsl" step="0.01" inputClassName={NUM} />
            </FormGrid>
          </EditCard>
        </div>
      </div>
    </TabsContent>
  );
}
