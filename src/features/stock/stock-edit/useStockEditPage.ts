import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { GenerateNextCodeParams, stocks } from "@/api/stocks";
import type { ApiError } from "@/api/_client";
import type { StockItem } from "@/lib/types";
import { applyApiFieldErrors, firstFormErrorMessage, useEntityForm } from "@/lib/form";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { StockFormSchema, type StockFormValues } from "../stock-form-schema";
import {
  type CodeGenerationFieldErrors,
  extractCodeGenerationParams,
  extractGeneratedCode,
  loadStoredCodeGenerationParams,
  saveStoredCodeGenerationParams,
  validateCodeGenerationParams,
} from "../stock-code-generation";
import { useStockDetail } from "../hooks";
import { mapRowToStockItem, stockItemToPayload } from "../map-stock";
import { blankStock } from "./utils";

const routeApi = getRouteApi("/stock/$id");

export function useStockEditPage() {
  const { id } = routeApi.useParams();
  const nav = useNavigate();
  const isNew = id === "new";
  const detailQuery = useStockDetail(id, !isNew);
  const [codeGenerationParams, setCodeGenerationParams] = useState<GenerateNextCodeParams>(() => {
    return loadStoredCodeGenerationParams() ?? { prefix: "", length: 0 };
  });
  const [rulesErrors, setRulesErrors] = useState<CodeGenerationFieldErrors>({});
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  const resetValues = useMemo(() => {
    if (isNew) return blankStock();
    if (!detailQuery.data) return null;
    return mapRowToStockItem(detailQuery.data);
  }, [isNew, detailQuery.data]);

  const form = useEntityForm<StockFormValues>({
    schema: StockFormSchema,
    defaultValues: blankStock(),
    resetValues,
    resetKey: id,
  });

  const { watch, setValue, handleSubmit, setError, clearErrors, formState, isDirty, isSubmitting } =
    form;

  const draft = watch();

  const handleGenerateCode = async () => {
    const validation = validateCodeGenerationParams(codeGenerationParams);
    if (!validation.ok) {
      setRulesErrors(validation.errors);
      toast.error(
        validation.errors.prefix ?? validation.errors.length ?? "Check code generation rules",
      );
      return;
    }
    setRulesErrors({});
    setIsGeneratingCode(true);
    try {
      const result = await stocks.api.generateNextCode(validation.data);
      const code = extractGeneratedCode(result);
      const fromApi = extractCodeGenerationParams(result);
      const nextParams = fromApi ?? validation.data;
      setCodeGenerationParams(nextParams);
      saveStoredCodeGenerationParams(nextParams);
      if (code) {
        setValue("code", code.toUpperCase(), { shouldDirty: true, shouldTouch: true });
        clearErrors("code");
        toast.success("Code generated");
      } else {
        toast.error("Failed to generate code");
      }
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as ApiError).message)
          : "Failed to generate code";
      toast.error(message);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const clearPendingImages = () =>
    setValue("pendingImages", [], { shouldDirty: false, shouldTouch: false });

  const createStock = stocks.hooks.useCreate({
    onSuccess: (row) => {
      toast.success("Stock created");
      clearPendingImages();
      nav({ to: "/stock/$id", params: { id: String(row.id) } });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const updateStock = stocks.hooks.useUpdate({
    onSuccess: () => {
      toast.success("Stock saved");
      clearPendingImages();
      if (!isNew) void detailQuery.refetch();
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const deleteStock = stocks.hooks.useDelete({
    onSuccess: () => {
      toast.success(`Removed ${draft.code}`);
      nav({ to: "/stocks" });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const deleteConfirm = useDeleteConfirm<{ id: string }>({
    onConfirm: async ({ id }) => {
      await deleteStock.mutateAsync({ id });
    },
  });

  const isSaving = isSubmitting || createStock.isPending || updateStock.isPending;

  const save = handleSubmit(
    (values) => {
      const payload = stockItemToPayload({ ...values, code: values.code.toUpperCase() });
      const onError = (err: ApiError) => {
        if (!applyApiFieldErrors(setError, err)) toast.error(err.message);
      };
      if (isNew) createStock.mutate(payload, { onError });
      else updateStock.mutate({ id: values.id, data: payload }, { onError });
    },
    (errors) => {
      toast.error(firstFormErrorMessage(errors) ?? "Please fix the highlighted fields");
    },
  );

  const onDelete = () => {
    if (isNew) {
      nav({ to: "/stocks" });
      return;
    }
    deleteConfirm.requestDelete({
      title: "Delete stock",
      entityName: draft.code,
      entityType: "stock item",
      meta: { id: draft.id },
    });
  };

  const onGenerateBarcodes = async () => {
    try {
      const result = await stocks.api.generateBarcode();
      if (result.pack_barcode && result.retail_barcode) {
        setValue("packBarcode", result.pack_barcode, { shouldDirty: true });
        setValue("retailBarcode", result.retail_barcode, { shouldDirty: true });
        toast.success("Barcodes generated");
      } else {
        toast.info("No barcode returned from API");
      }
    } catch (err) {
      toast.error((err as ApiError)?.message ?? "Failed to generate barcodes");
    }
  };

  const pendingImages = draft.pendingImages ?? [];
  const hasPendingImages = pendingImages.length > 0;

  return {
    id,
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
    onGenerateBarcodes,
  };
}
