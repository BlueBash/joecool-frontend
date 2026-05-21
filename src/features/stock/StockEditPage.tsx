import { Loader2, Save, ExternalLink, Trash2 } from "lucide-react";
import { FormProvider } from "react-hook-form";
import type { ApiError } from "@/api/_client";
import { AppGuard } from "@/components/app-guard";
import { EditScreen } from "@/components/edit-screen";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { Pill } from "@/components/pill";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  StockEditIdentityCard,
  StockEditTabs,
  useStockEditPage,
} from "./stock-edit";

export function StockEditPage() {
  const page = useStockEditPage();
  const {
    isNew,
    detailQuery,
    form,
    formState,
    draft,
    isDirty,
    isSaving,
    hasPendingImages,
    deleteConfirm,
    deleteStock,
    codeGenerationParams,
    setCodeGenerationParams,
    rulesErrors,
    isGeneratingCode,
    handleGenerateCode,
    save,
    onDelete,
    existingImages,
    pendingImages,
    setPendingImages,
    materials,
    setMaterial,
    addMaterial,
    removeMaterial,
    onGenerateBarcodes,
    setFlag,
    tabProps,
  } = page;

  if (!isNew && detailQuery.isPending) {
    return (
      <EditScreen backTo="/stocks" title="Loading stock…">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      </EditScreen>
    );
  }

  if (!isNew && detailQuery.isError) {
    return (
      <EditScreen backTo="/stocks" title="Stock not found">
        <p className="text-muted-foreground text-[13px]">
          {(detailQuery.error as ApiError)?.message ?? "This item may have been deleted."}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 h-8"
          onClick={() => detailQuery.refetch()}
        >
          Try again
        </Button>
      </EditScreen>
    );
  }

  return (
    <FormProvider {...form}>
      <DeleteConfirmDialog state={deleteConfirm} />
      <EditScreen
        backTo="/stocks"
        backLabel="Back to Stock"
        title={isNew ? "New Stock Item" : draft.title || draft.code}
        itemCode={!isNew ? draft.code : ""}
        badges={
          !isNew && (
            <Pill
              variant={
                draft.status === "active"
                  ? "success"
                  : draft.status === "low"
                    ? "warning"
                    : draft.status === "out"
                      ? "danger"
                      : "neutral"
              }
            >
              {draft.status}
            </Pill>
          )
        }
        actions={
          <>
            {!isNew && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => toast.info("Web page")}
              >
                <ExternalLink className="h-3.5 w-3.5" /> Web page
              </Button>
            )}
            {!isNew && (
              <AppGuard checkName="Delete Stock">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-destructive hover:text-destructive"
                  onClick={onDelete}
                  disabled={deleteStock.isPending || deleteConfirm.isPending || isSaving}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </AppGuard>
            )}
            <Button
              size="sm"
              className="h-8 gap-1.5"
              onClick={save}
              disabled={isSaving || (!isNew && !isDirty && !hasPendingImages)}
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {isNew ? "Create" : "Update"}
            </Button>
          </>
        }
      >
        <StockEditIdentityCard
          {...tabProps}
          isNew={isNew}
          codeError={formState.errors.code?.message}
          existingImages={existingImages}
          pendingImages={pendingImages}
          imageHue={draft.imageHue}
          codeGenerationParams={codeGenerationParams}
          setCodeGenerationParams={setCodeGenerationParams}
          rulesErrors={rulesErrors}
          isGeneratingCode={isGeneratingCode}
          onGenerateCode={() => void handleGenerateCode()}
        />

        <StockEditTabs
          tabProps={tabProps}
          makeupTabProps={{
            ...tabProps,
            materials,
            setMaterial,
            addMaterial,
            removeMaterial,
            onGenerateBarcodes,
          }}
          flagsTabProps={{ ...tabProps, setFlag }}
          imagesTabProps={{
            existingImages,
            pendingImages,
            onPendingChange: setPendingImages,
          }}
        />
      </EditScreen>
    </FormProvider>
  );
}
