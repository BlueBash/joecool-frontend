import { useFormContext } from "react-hook-form";
import { FieldError } from "@/components/form";
import { EditCard } from "@/components/edit-screen";
import { Field, FormGrid } from "@/components/form-primitives";
import { FormDateField, FormTextField } from "@/components/form";
import { StockEditedTitleField } from "./form-helpers";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { GenerateNextCodeParams } from "@/api/stocks";
import type { CodeGenerationFieldErrors } from "../stock-code-generation";
import type { StockFormValues } from "../stock-form-schema";
import { StockImagePreview } from "../StockImagePreview";
import { StockCodeRulesDropdown } from "./StockCodeRulesDropdown";
import { STOCK_FIELD_CLASS } from "./field-classes";
import { StockInlineCheckbox } from "./form-helpers";

type StockEditIdentityCardProps = {
  isNew: boolean;
  existingImages: string[];
  pendingImages: string[];
  imageHue: number;
  codeGenerationParams: GenerateNextCodeParams;
  setCodeGenerationParams: (params: GenerateNextCodeParams) => void;
  rulesErrors: CodeGenerationFieldErrors;
  isGeneratingCode: boolean;
  onGenerateCode: () => void;
};

export function StockEditIdentityCard({
  isNew,
  existingImages,
  pendingImages,
  imageHue,
  codeGenerationParams,
  setCodeGenerationParams,
  rulesErrors,
  isGeneratingCode,
  onGenerateCode,
}: StockEditIdentityCardProps) {
  const { TXT, MONO } = STOCK_FIELD_CLASS;
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<StockFormValues>();
  const codeError = errors.code?.message as string | undefined;
  const codeErrorId = codeError ? "code-error" : undefined;

  return (
    <EditCard title="Identity">
      <div className="flex gap-4 items-start mb-4">
        <StockImagePreview
          existingImages={existingImages}
          pendingImages={pendingImages}
          imageHue={imageHue}
        />
        <div className="flex-1 min-w-0">
          <FormGrid cols={4}>
            <Field
              label="Code"
              fieldLabelAction={
                isNew ? (
                  <StockCodeRulesDropdown
                    codeGenerationParams={codeGenerationParams}
                    setCodeGenerationParams={setCodeGenerationParams}
                    rulesErrors={rulesErrors}
                    isGenerating={isGeneratingCode}
                    onGenerate={onGenerateCode}
                  />
                ) : undefined
              }
              fieldLabelActionClasses={isNew ? "flex justify-between" : undefined}
              required
            >
              <Input
                readOnly={!isNew}
                disabled={isSubmitting}
                aria-invalid={!!codeError}
                aria-describedby={codeErrorId}
                className={cn(MONO, !isNew && "bg-muted")}
                {...register("code", {
                  setValueAs: (v) => String(v ?? "").toUpperCase(),
                })}
              />
              <FieldError id={codeErrorId} message={codeError} />
            </Field>
            <FormDateField<StockFormValues>
              name="introDate"
              label="Intro Date"
              inputClassName={TXT}
            />
            <StockEditedTitleField />
            <FormTextField<StockFormValues>
              name="generatedTitle"
              label="Generated Title"
              inputClassName={TXT}
            />
          </FormGrid>
        </div>
      </div>
      <StockInlineCheckbox name="toZoho">TO Zoho</StockInlineCheckbox>
    </EditCard>
  );
}
