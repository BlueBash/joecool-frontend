import { FieldError } from "@/components/form";
import { EditCard } from "@/components/edit-screen";
import { Field, FormGrid } from "@/components/form-primitives";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { GenerateNextCodeParams } from "@/api/stocks";
import type { CodeGenerationFieldErrors } from "../stock-code-generation";
import { StockImagePreview } from "../StockImagePreview";
import { StockCodeRulesDropdown } from "./StockCodeRulesDropdown";
import { STOCK_FIELD_CLASS } from "./field-classes";
import type { StockEditTabProps } from "./types";

type StockEditIdentityCardProps = StockEditTabProps & {
  isNew: boolean;
  codeError?: string;
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
  draft,
  set,
  isNew,
  codeError,
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
                value={draft.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
                readOnly={!isNew}
                className={cn(MONO, !isNew && "bg-muted")}
                aria-invalid={!!codeError}
              />
              <FieldError message={codeError} />
            </Field>
            <Field label="Intro Date">
              <Input
                type="date"
                value={draft.introDate}
                onChange={(e) => set("introDate", e.target.value)}
                className={TXT}
              />
            </Field>
            <Field label="Edited Title">
              <Input
                value={draft.editedTitle ?? draft.title}
                onChange={(e) => set("editedTitle", e.target.value)}
                className={TXT}
              />
            </Field>
            <Field label="Generated Title">
              <Input
                value={draft.generatedTitle ?? ""}
                onChange={(e) => set("generatedTitle", e.target.value)}
                className={TXT}
              />
            </Field>
          </FormGrid>
        </div>
      </div>
      <label className="inline-flex items-center gap-2 text-[13px] mt-3">
        <input
          type="checkbox"
          checked={!!draft.toZoho}
          onChange={(e) => set("toZoho", e.target.checked)}
          className="h-3.5 w-3.5"
        />
        TO Zoho
      </label>
    </EditCard>
  );
}
