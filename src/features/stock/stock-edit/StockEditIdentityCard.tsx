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
  const { TXT, MONO, READONLY } = STOCK_FIELD_CLASS;
  const {
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<StockFormValues>();
  const code = watch("code");
  const codeError = errors.code?.message as string | undefined;
  const codeErrorId = codeError ? "code-error" : undefined;

  return (
    <EditCard title="Identity">
      <div className="flex gap-4 items-start">
        <StockImagePreview
          existingImages={existingImages}
          pendingImages={pendingImages}
          imageHue={imageHue}
        />
        <div className="flex-1 min-w-0">
          <FormGrid cols={4}>
            {isNew ? (
              <Field
                label="Code"
                fieldLabelAction={
                  <StockCodeRulesDropdown
                    codeGenerationParams={codeGenerationParams}
                    setCodeGenerationParams={setCodeGenerationParams}
                    rulesErrors={rulesErrors}
                    isGenerating={isGeneratingCode}
                    onGenerate={onGenerateCode}
                  />
                }
                fieldLabelActionClasses="flex justify-between"
                required
              >
                <Input
                  disabled={isSubmitting}
                  aria-invalid={!!codeError}
                  aria-describedby={codeErrorId}
                  className={MONO}
                  {...register("code", {
                    setValueAs: (v) => String(v ?? "").toUpperCase(),
                  })}
                />
                <FieldError id={codeErrorId} message={codeError} />
              </Field>
            ) : (
              ""
            )}
            {!isNew && (
              <FormDateField<StockFormValues>
                name="introDate"
                label="Intro Date"
                readOnly
                inputClassName={TXT}
              />
            )}
            <StockEditedTitleField />
            <FormTextField<StockFormValues>
              name="generatedTitle"
              label="Generated Title"
              inputClassName={TXT}
            />
            {/* <StockInlineCheckbox name="toZoho">TO Zoho</StockInlineCheckbox> */}
          </FormGrid>
        </div>
      </div>
    </EditCard>
  );
}
