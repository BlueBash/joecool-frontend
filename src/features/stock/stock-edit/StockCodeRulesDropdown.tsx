import { Loader2, Settings2 } from "lucide-react";
import type { GenerateNextCodeParams } from "@/api/stocks";
import { FieldError } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CodeGenerationFieldErrors } from "../stock-code-generation";
import {
  saveStoredCodeGenerationParams,
} from "../stock-code-generation";

type StockCodeRulesDropdownProps = {
  codeGenerationParams: GenerateNextCodeParams;
  setCodeGenerationParams: (params: GenerateNextCodeParams) => void;
  rulesErrors: CodeGenerationFieldErrors;
  isGenerating: boolean;
  onGenerate: () => void;
};

export function StockCodeRulesDropdown({
  codeGenerationParams,
  setCodeGenerationParams,
  rulesErrors,
  isGenerating,
  onGenerate,
}: StockCodeRulesDropdownProps) {
  const updateParams = (next: GenerateNextCodeParams) => {
    setCodeGenerationParams(next);
    saveStoredCodeGenerationParams(next);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">Rules</span>
          <Settings2 size={12} />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div
          className="space-y-4 p-3"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Code prefix <span className="text-destructive">*</span>
            </label>
            <Input
              value={codeGenerationParams.prefix ?? ""}
              onChange={(e) => updateParams({ ...codeGenerationParams, prefix: e.target.value })}
              aria-invalid={!!rulesErrors.prefix}
              className={rulesErrors.prefix ? "border-destructive" : undefined}
            />
            <FieldError message={rulesErrors.prefix} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Total code length <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              min={1}
              value={codeGenerationParams.length || ""}
              onChange={(e) =>
                updateParams({
                  ...codeGenerationParams,
                  length: Number(e.target.value),
                })
              }
              aria-invalid={!!rulesErrors.length}
              className={rulesErrors.length ? "border-destructive" : undefined}
            />
            <span className="text-xs text-muted-foreground">
              Characters to generate after prefix.
            </span>
            <FieldError message={rulesErrors.length} />
          </div>
          <div className="flex justify-end">
            <Button type="button" disabled={isGenerating} onClick={onGenerate}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Generating…
                </>
              ) : (
                "Generate code"
              )}
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
