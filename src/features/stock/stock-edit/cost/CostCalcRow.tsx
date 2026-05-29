import type { FieldPath } from "react-hook-form";
import { FormNumberField } from "@/components/form";
import type { FormNumberFieldProps } from "@/components/form/form-number-field";
import type { StockFormValues } from "../../stock-form-schema";
import { STOCK_FIELD_CLASS } from "../field-classes";
import { CostCalcResultField, CostFlowRow } from "./CostFlowRow";

type CostCalcFieldConfig = Pick<FormNumberFieldProps<StockFormValues>, "name" | "label"> &
  Partial<Pick<FormNumberFieldProps<StockFormValues>, "step" | "readOnly" | "inputClassName">>;

export type CostCalcRowProps = {
  left: CostCalcFieldConfig;
  /** Second input; omit when the row continues from the prior result. */
  middle?: CostCalcFieldConfig;
  result: {
    name: FieldPath<StockFormValues>;
    label: string;
    decimals?: number;
    formula?: string;
  };
  className?: string;
};

/** Two number inputs + calculated result (from `useStockCostTab`). */
export function CostCalcRow({ left, middle, result, className }: CostCalcRowProps) {
  const num = STOCK_FIELD_CLASS.NUM;

  return (
    <CostFlowRow className={className}>
      <FormNumberField<StockFormValues>
        {...left}
        inputClassName={left.inputClassName ?? num}
      />
      {middle ? (
        <FormNumberField<StockFormValues>
          {...middle}
          inputClassName={middle.inputClassName ?? num}
        />
      ) : (
        <div className="hidden sm:block" aria-hidden />
      )}
      <CostCalcResultField
        name={result.name}
        label={result.label}
        decimals={result.decimals}
        formula={result.formula}
      />
    </CostFlowRow>
  );
}
